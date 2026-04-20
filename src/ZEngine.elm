module ZEngine exposing
    ( Session
    , Msg
    , Event(..)
    , Error(..)
    , Frame(..)
    , OutputFrameData
    , InputFrameData
    , StatusLine
    , StatusLineMode(..)
    , MoveInfo(..)
    , InputRequest
    , Phase(..)
    , TurnRecord
    , new
    , update
    , send
    , restore
    , resumeFrom
    , transcript
    , statusLine
    , turnHistory
    , storyName
    , storyId
    , storyIdFromBytes
    , releaseNumber
    , serialNumber
    , storyBytes
    , snapshotBytes
    , phase
    , formatMoveInfo
    , InputEventsContext
    , buildInputEvents
    )

{-| Public surface for the elm-zengine library.

Readers are real; driver operations are still `Debug.todo`s and will be wired
in subsequent commits. The app does not yet import this module.

-}

import Bytes exposing (Bytes)
import Process
import Task
import ZEngine.Internal as Internal
import ZEngine.Output
import ZEngine.Snapshot
import ZEngine.Title
import ZEngine.Types as EngineTypes exposing (TurnRecord, emptyPendingOutput)
import ZMachine
import ZMachine.Header
import ZMachine.Types as ZTypes exposing (StepResult)


type Session
    = Session Internal.InternalState


type Msg
    = Yielded
    | StepCompleted StepResult


type Frame
    = OutputFrame OutputFrameData
    | InputFrame InputFrameData


type alias OutputFrameData =
    { text : String
    , statusLine : Maybe StatusLine
    }


type alias InputFrameData =
    { command : String
    }


type alias StatusLine =
    { locationId : Int
    , locationName : String
    , mode : StatusLineMode
    }


type StatusLineMode
    = ScoreAndTurns Int Int
    | TimeOfDay Int Int
    | ScreenRows (List String)


type alias InputRequest =
    { maxLength : Int
    }


type alias TurnRecord =
    { index : Int
    , snapshotBytes : Bytes
    , locationId : Int
    , locationName : String
    , moveInfo : MoveInfo
    , transcriptLength : Int
    }


type MoveInfo
    = AtTurn Int
    | AtTime Int Int


type Event
    = OutputProduced Frame
    | InputNeeded InputRequest
    | StatusLineChanged StatusLine
    | TurnCompleted
    | TitleDetected String
    | GameOver
    | RuntimeError String


type Error
    = LoadError String
    | RestoreError String


type Phase
    = Loading
    | Running
    | Waiting
    | Halted
    | Errored String


phase : Session -> Phase
phase (Session state) =
    fromInternalPhase state.phase


fromInternalPhase : Internal.Phase -> Phase
fromInternalPhase p =
    case p of
        Internal.Loading ->
            Loading

        Internal.Running ->
            Running

        Internal.Waiting ->
            Waiting

        Internal.Halted ->
            Halted

        Internal.Errored message ->
            Errored message


new : Bytes -> Result Error ( Session, Cmd Msg )
new bytes =
    case ZMachine.load bytes of
        Err err ->
            Err (LoadError err)

        Ok machine ->
            Ok
                ( Session (initialState machine bytes)
                , yieldCmd
                )


initialState : ZMachine.ZMachine -> Bytes -> Internal.InternalState
initialState machine bytes =
    { machine = machine
    , storyBytes = bytes
    , inputRequest = Nothing
    , transcript = []
    , pendingOutput = emptyPendingOutput
    , currentStatusLine = Nothing
    , turnHistory = []
    , restoringSession = False
    , phase = Internal.Loading
    , storyName = ""
    , titleEmitted = False
    }


yieldCmd : Cmd Msg
yieldCmd =
    Process.sleep 0
        |> Task.perform (\_ -> Yielded)


stepBudget : Int
stepBudget =
    100000


update : Msg -> Session -> ( Session, List Event, Cmd Msg )
update msg (Session state) =
    case msg of
        Yielded ->
            dispatch (ZMachine.runSteps stepBudget state.machine) state

        StepCompleted result ->
            dispatch result state


dispatch : StepResult -> Internal.InternalState -> ( Session, List Event, Cmd Msg )
dispatch result state =
    case result of
        ZTypes.Continue events machine ->
            ( Session
                { state
                    | machine = machine
                    , phase = Internal.Running
                    , pendingOutput = ZEngine.Output.processEvents events state.pendingOutput
                }
            , []
            , yieldCmd
            )

        ZTypes.NeedInput req events machine ->
            onNeedInput req events machine state

        ZTypes.NeedChar events machine ->
            dispatch
                (ZMachine.provideChar " " machine)
                { state | pendingOutput = ZEngine.Output.processEvents events state.pendingOutput }

        ZTypes.NeedSave _ events machine ->
            dispatch
                (ZMachine.provideSaveResult False machine)
                { state | pendingOutput = ZEngine.Output.processEvents events state.pendingOutput }

        ZTypes.NeedRestore events machine ->
            dispatch
                (ZMachine.provideRestoreResult Nothing machine)
                { state | pendingOutput = ZEngine.Output.processEvents events state.pendingOutput }

        ZTypes.Halted events machine ->
            let
                finalOutput : EngineTypes.PendingOutput
                finalOutput =
                    ZEngine.Output.processEvents events state.pendingOutput

                newTranscript : List EngineTypes.Frame
                newTranscript =
                    state.transcript ++ [ EngineTypes.OutputFrame finalOutput ]
            in
            ( Session
                { state
                    | machine = machine
                    , phase = Internal.Halted
                    , transcript = newTranscript
                    , pendingOutput = emptyPendingOutput
                }
            , [ OutputProduced (toPublicFrame (EngineTypes.OutputFrame finalOutput)), GameOver ]
            , Cmd.none
            )

        ZTypes.Error err events machine ->
            let
                finalOutput : EngineTypes.PendingOutput
                finalOutput =
                    ZEngine.Output.processEvents events state.pendingOutput

                newTranscript : List EngineTypes.Frame
                newTranscript =
                    state.transcript ++ [ EngineTypes.OutputFrame finalOutput ]

                message : String
                message =
                    zmachineErrorToString err
            in
            ( Session
                { state
                    | machine = machine
                    , phase = Internal.Errored message
                    , transcript = newTranscript
                    , pendingOutput = emptyPendingOutput
                }
            , [ OutputProduced (toPublicFrame (EngineTypes.OutputFrame finalOutput)), RuntimeError message ]
            , Cmd.none
            )


onNeedInput : ZTypes.LineInputInfo -> List ZTypes.OutputEvent -> ZMachine.ZMachine -> Internal.InternalState -> ( Session, List Event, Cmd Msg )
onNeedInput req events machine state =
    if state.restoringSession then
        ( Session
            { state
                | machine = machine
                , phase = Internal.Waiting
                , inputRequest = Just req
                , pendingOutput = emptyPendingOutput
                , restoringSession = False
            }
        , [ InputNeeded (toInputRequest req) ]
        , Cmd.none
        )

    else
        let
            finalOutput : EngineTypes.PendingOutput
            finalOutput =
                ZEngine.Output.processEvents events state.pendingOutput

            newStatusLine : Maybe ZTypes.StatusLine
            newStatusLine =
                case finalOutput.statusLine of
                    Just sl ->
                        Just sl

                    Nothing ->
                        state.currentStatusLine

            newTranscript : List EngineTypes.Frame
            newTranscript =
                state.transcript ++ [ EngineTypes.OutputFrame finalOutput ]

            turnRecord : Maybe EngineTypes.TurnRecord
            turnRecord =
                ZEngine.Output.captureTurnRecord machine newStatusLine newTranscript state.turnHistory

            newTurnHistory : List EngineTypes.TurnRecord
            newTurnHistory =
                case turnRecord of
                    Just record ->
                        state.turnHistory ++ [ record ]

                    Nothing ->
                        state.turnHistory

            detectedTitle : Maybe String
            detectedTitle =
                if state.titleEmitted then
                    Nothing

                else
                    ZEngine.Title.fromOutput finalOutput.text

            nextStoryName : String
            nextStoryName =
                Maybe.withDefault state.storyName detectedTitle

            events_ : List Event
            events_ =
                buildInputEvents
                    { finalFrame = toPublicFrame (EngineTypes.OutputFrame finalOutput)
                    , previousStatusLine = Maybe.map toPublicStatusLine state.currentStatusLine
                    , detectedTitle = detectedTitle
                    , inputRequest = toInputRequest req
                    }
        in
        ( Session
            { state
                | machine = machine
                , phase = Internal.Waiting
                , inputRequest = Just req
                , transcript = newTranscript
                , pendingOutput = emptyPendingOutput
                , currentStatusLine = newStatusLine
                , turnHistory = newTurnHistory
                , storyName = nextStoryName
                , titleEmitted = state.titleEmitted || detectedTitle /= Nothing
            }
        , events_
        , Cmd.none
        )


toPublicFrame : EngineTypes.Frame -> Frame
toPublicFrame frame =
    case frame of
        EngineTypes.OutputFrame data ->
            OutputFrame
                { text = data.text
                , statusLine = Maybe.map toPublicStatusLine data.statusLine
                }

        EngineTypes.InputFrame data ->
            InputFrame { command = data.command }


toPublicStatusLine : ZTypes.StatusLine -> StatusLine
toPublicStatusLine sl =
    { locationId = sl.locationId
    , locationName = sl.locationName
    , mode = toPublicStatusLineMode sl.mode
    }


toPublicStatusLineMode : ZTypes.StatusLineMode -> StatusLineMode
toPublicStatusLineMode mode =
    case mode of
        ZTypes.ScoreAndTurns s t ->
            ScoreAndTurns s t

        ZTypes.TimeOfDay h m ->
            TimeOfDay h m

        ZTypes.ScreenRows rows ->
            ScreenRows rows


toInputRequest : ZTypes.LineInputInfo -> InputRequest
toInputRequest info =
    { maxLength = info.maxLength }


fromPublicFrame : Frame -> EngineTypes.Frame
fromPublicFrame frame =
    case frame of
        OutputFrame data ->
            EngineTypes.OutputFrame
                { text = data.text
                , statusLine = Maybe.map fromPublicStatusLine data.statusLine
                }

        InputFrame data ->
            EngineTypes.InputFrame { command = data.command }


fromPublicStatusLine : StatusLine -> ZTypes.StatusLine
fromPublicStatusLine sl =
    { locationId = sl.locationId
    , locationName = sl.locationName
    , mode = fromPublicStatusLineMode sl.mode
    }


fromPublicStatusLineMode : StatusLineMode -> ZTypes.StatusLineMode
fromPublicStatusLineMode mode =
    case mode of
        ScoreAndTurns s t ->
            ZTypes.ScoreAndTurns s t

        TimeOfDay h m ->
            ZTypes.TimeOfDay h m

        ScreenRows rows ->
            ZTypes.ScreenRows rows


toPublicTurnRecord : EngineTypes.TurnRecord -> TurnRecord
toPublicTurnRecord r =
    { index = r.index
    , snapshotBytes = r.snapshotBytes
    , locationId = r.locationId
    , locationName = r.locationName
    , moveInfo = toPublicMoveInfo r.moveInfo
    , transcriptLength = r.transcriptLength
    }


fromPublicTurnRecord : TurnRecord -> EngineTypes.TurnRecord
fromPublicTurnRecord r =
    { index = r.index
    , snapshotBytes = r.snapshotBytes
    , locationId = r.locationId
    , locationName = r.locationName
    , moveInfo = fromPublicMoveInfo r.moveInfo
    , transcriptLength = r.transcriptLength
    }


toPublicMoveInfo : EngineTypes.MoveInfo -> MoveInfo
toPublicMoveInfo info =
    case info of
        EngineTypes.AtTurn n ->
            AtTurn n

        EngineTypes.AtTime h m ->
            AtTime h m


fromPublicMoveInfo : MoveInfo -> EngineTypes.MoveInfo
fromPublicMoveInfo info =
    case info of
        AtTurn n ->
            EngineTypes.AtTurn n

        AtTime h m ->
            EngineTypes.AtTime h m


{-| Inputs to `buildInputEvents`. Exposed for ordering tests.
-}
type alias InputEventsContext =
    { finalFrame : Frame
    , previousStatusLine : Maybe StatusLine
    , detectedTitle : Maybe String
    , inputRequest : InputRequest
    }


{-| Pure event-list construction for the Waiting transition. Ordering
contract (covered by tests in `tests/ZEngine/EventsTest.elm`):
OutputProduced → StatusLineChanged (when different from previous) →
TurnCompleted → TitleDetected (only if `detectedTitle` is `Just` and the
caller hasn't already emitted one) → InputNeeded.

`detectedTitle` is the caller's responsibility — `buildInputEvents`
emits whatever it's given. Pass `Nothing` once the title has been
emitted to suppress repeats.
-}
buildInputEvents : InputEventsContext -> List Event
buildInputEvents ctx =
    let
        currentStatusLine : Maybe StatusLine
        currentStatusLine =
            case ctx.finalFrame of
                OutputFrame data ->
                    case data.statusLine of
                        Just sl ->
                            Just sl

                        Nothing ->
                            ctx.previousStatusLine

                InputFrame _ ->
                    ctx.previousStatusLine

        statusChanged : Bool
        statusChanged =
            currentStatusLine /= ctx.previousStatusLine
    in
    List.concat
        [ [ OutputProduced ctx.finalFrame ]
        , case ( statusChanged, currentStatusLine ) of
            ( True, Just sl ) ->
                [ StatusLineChanged sl ]

            _ ->
                []
        , [ TurnCompleted ]
        , case ctx.detectedTitle of
            Just title ->
                [ TitleDetected title ]

            Nothing ->
                []
        , [ InputNeeded ctx.inputRequest ]
        ]


zmachineErrorToString : ZTypes.ZMachineError -> String
zmachineErrorToString err =
    case err of
        ZTypes.DivisionByZero ->
            "Division by zero"

        ZTypes.StackUnderflow ->
            "Stack underflow"

        ZTypes.InvalidOpcode n ->
            "Invalid opcode: " ++ String.fromInt n

        ZTypes.InvalidVariable n ->
            "Invalid variable: " ++ String.fromInt n


send : String -> Session -> ( Session, Cmd Msg )
send input (Session state) =
    case ( state.phase, state.inputRequest ) of
        ( Internal.Waiting, Just req ) ->
            let
                command : String
                command =
                    stripTrailingNewline input

                newTranscript : List EngineTypes.Frame
                newTranscript =
                    state.transcript ++ [ EngineTypes.InputFrame { command = command } ]

                newState : Internal.InternalState
                newState =
                    { state
                        | transcript = newTranscript
                        , inputRequest = Nothing
                        , phase = Internal.Running
                    }
            in
            ( Session newState
            , Task.succeed ()
                |> Task.perform (\_ -> StepCompleted (ZMachine.provideInput command req state.machine))
            )

        _ ->
            ( Session state, Cmd.none )


stripTrailingNewline : String -> String
stripTrailingNewline s =
    if String.endsWith "\n" s then
        String.dropRight 1 s

    else
        s


restore :
    { story : Bytes
    , snapshot : Bytes
    , transcript : List Frame
    , turnHistory : List TurnRecord
    , currentStatusLine : Maybe StatusLine
    , storyName : String
    }
    -> Result Error ( Session, Cmd Msg )
restore args =
    case ZMachine.load args.story of
        Err err ->
            Err (LoadError err)

        Ok freshMachine ->
            case ZEngine.Snapshot.restore args.snapshot freshMachine of
                Err message ->
                    Err (RestoreError message)

                Ok restoredMachine ->
                    let
                        base : Internal.InternalState
                        base =
                            initialState restoredMachine args.story
                    in
                    Ok
                        ( Session
                            { base
                                | restoringSession = True
                                , phase = Internal.Running
                                , transcript = List.map fromPublicFrame args.transcript
                                , turnHistory = List.map fromPublicTurnRecord args.turnHistory
                                , currentStatusLine = Maybe.map fromPublicStatusLine args.currentStatusLine
                                , storyName = args.storyName
                                , titleEmitted = not (String.isEmpty args.storyName)
                            }
                        , yieldCmd
                        )


resumeFrom : TurnRecord -> Session -> ( Session, Cmd Msg )
resumeFrom publicRecord (Session state) =
    let
        record : EngineTypes.TurnRecord
        record =
            fromPublicTurnRecord publicRecord
    in
    case ZEngine.Snapshot.restore record.snapshotBytes state.machine of
        Err _ ->
            ( Session state, Cmd.none )

        Ok restoredMachine ->
            let
                truncatedTranscript : List EngineTypes.Frame
                truncatedTranscript =
                    List.take record.transcriptLength state.transcript

                truncatedHistory : List EngineTypes.TurnRecord
                truncatedHistory =
                    List.filter (\r -> r.index <= record.index) state.turnHistory

                newState : Internal.InternalState
                newState =
                    { state
                        | machine = restoredMachine
                        , phase = Internal.Running
                        , inputRequest = Nothing
                        , transcript = truncatedTranscript
                        , turnHistory = truncatedHistory
                        , pendingOutput = emptyPendingOutput
                        , restoringSession = True
                        , currentStatusLine = Just (ZEngine.Output.statusLineFromTurnRecord record)
                    }
            in
            ( Session newState, yieldCmd )


transcript : Session -> List Frame
transcript (Session state) =
    List.map toPublicFrame state.transcript


statusLine : Session -> Maybe StatusLine
statusLine (Session state) =
    Maybe.map toPublicStatusLine state.currentStatusLine


turnHistory : Session -> List TurnRecord
turnHistory (Session state) =
    List.map toPublicTurnRecord state.turnHistory


storyName : Session -> String
storyName (Session state) =
    state.storyName


storyId : Session -> String
storyId (Session state) =
    storyIdFromMachine state.machine


storyIdFromBytes : Bytes -> Maybe String
storyIdFromBytes bytes =
    case ZMachine.load bytes of
        Ok machine ->
            Just (storyIdFromMachine machine)

        Err _ ->
            Nothing


storyIdFromMachine : ZMachine.ZMachine -> String
storyIdFromMachine machine =
    String.fromInt (ZMachine.Header.releaseNumber machine.memory)
        ++ "-"
        ++ ZMachine.Header.serialNumber machine.memory
        ++ "-"
        ++ String.fromInt (ZMachine.Header.checksum machine.memory)


releaseNumber : Session -> Int
releaseNumber (Session state) =
    ZMachine.Header.releaseNumber state.machine.memory


serialNumber : Session -> String
serialNumber (Session state) =
    ZMachine.Header.serialNumber state.machine.memory


storyBytes : Session -> Bytes
storyBytes (Session state) =
    state.storyBytes


snapshotBytes : Session -> Bytes
snapshotBytes (Session state) =
    ZEngine.Snapshot.encode state.machine


formatMoveInfo : MoveInfo -> String
formatMoveInfo info =
    case info of
        AtTurn 0 ->
            "Start"

        AtTurn n ->
            "Turn " ++ String.fromInt n

        AtTime h m ->
            String.fromInt h ++ ":" ++ String.padLeft 2 '0' (String.fromInt m)
