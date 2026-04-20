module ZEngine exposing
    ( Session
    , Msg
    , Event(..)
    , Error(..)
    , RuntimeErrorData
    , Frame(..)
    , OutputFrameData
    , InputFrameData
    , StatusLine
    , StatusLineMode(..)
    , MoveInfo(..)
    , Prompt(..)
    , Phase(..)
    , TurnRecord
    , new
    , update
    , sendLine
    , sendChar
    , sendSaveResult
    , sendRestore
    , restore
    , resumeFrom
    , foldEvents
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
    , activePrompt
    , formatMoveInfo
    , TurnEventsContext
    , buildTurnEventsForLine
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
import ZMachine.Snapshot
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


type Prompt
    = LinePrompt
    | CharPrompt
    | SavePrompt Bytes
    | RestorePrompt


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
    | PromptIssued Prompt
    | StatusLineChanged StatusLine
    | TurnCompleted
    | TitleDetected String
    | GameOver


type Error
    = LoadError String
    | RestoreError String
    | RuntimeError RuntimeErrorData


type alias RuntimeErrorData =
    { session : Session
    , events : List Event
    , message : String
    }


type Phase
    = Loading
    | Running
    | Waiting Prompt
    | Halted
    | Errored String


phase : Session -> Phase
phase (Session state) =
    case state.phase of
        Internal.Loading ->
            Loading

        Internal.Running ->
            Running

        Internal.Waiting ->
            Waiting (promptFromInternal state)

        Internal.Halted ->
            Halted

        Internal.Errored message ->
            Errored message


activePrompt : Session -> Maybe Prompt
activePrompt (Session state) =
    Maybe.map (\_ -> promptFromInternal state) state.activePrompt


promptFromInternal : Internal.InternalState -> Prompt
promptFromInternal state =
    case state.activePrompt of
        Just (Internal.LineActive _) ->
            LinePrompt

        Just Internal.CharActive ->
            CharPrompt

        Just (Internal.SaveActive bytes) ->
            SavePrompt bytes

        Just Internal.RestoreActive ->
            RestorePrompt

        Nothing ->
            LinePrompt


new : Bytes -> Result Error ( Session, List Event, Cmd Msg )
new bytes =
    case ZMachine.load bytes of
        Err err ->
            Err (LoadError err)

        Ok machine ->
            Ok
                ( Session (initialState machine bytes)
                , []
                , yieldCmd
                )


initialState : ZMachine.ZMachine -> Bytes -> Internal.InternalState
initialState machine bytes =
    { machine = machine
    , storyBytes = bytes
    , activePrompt = Nothing
    , inputQueue = []
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


update : Msg -> Session -> Result Error ( Session, List Event, Cmd Msg )
update msg (Session state) =
    case msg of
        Yielded ->
            dispatch (ZMachine.runSteps stepBudget state.machine) state

        StepCompleted result ->
            dispatch result state


dispatch : StepResult -> Internal.InternalState -> Result Error ( Session, List Event, Cmd Msg )
dispatch result state =
    case result of
        ZTypes.Continue events machine ->
            Ok
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
            Ok (onLinePrompt req events machine state)

        ZTypes.NeedChar events machine ->
            Ok (onNonLinePrompt Internal.CharActive CharPrompt events machine state)

        ZTypes.NeedSave snapshot events machine ->
            let
                saveBytes : Bytes
                saveBytes =
                    ZMachine.Snapshot.encode state.machine.originalMemory snapshot
            in
            Ok (onNonLinePrompt (Internal.SaveActive saveBytes) (SavePrompt saveBytes) events machine state)

        ZTypes.NeedRestore events machine ->
            Ok (onNonLinePrompt Internal.RestoreActive RestorePrompt events machine state)

        ZTypes.Halted events machine ->
            let
                finalOutput : EngineTypes.PendingOutput
                finalOutput =
                    ZEngine.Output.processEvents events state.pendingOutput

                newTranscript : List EngineTypes.Frame
                newTranscript =
                    state.transcript ++ [ EngineTypes.OutputFrame finalOutput ]
            in
            Ok
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

                erroredSession : Session
                erroredSession =
                    Session
                        { state
                            | machine = machine
                            , phase = Internal.Errored message
                            , transcript = newTranscript
                            , pendingOutput = emptyPendingOutput
                        }
            in
            Err
                (RuntimeError
                    { session = erroredSession
                    , events = [ OutputProduced (toPublicFrame (EngineTypes.OutputFrame finalOutput)) ]
                    , message = message
                    }
                )


onLinePrompt : ZTypes.LineInputInfo -> List ZTypes.OutputEvent -> ZMachine.ZMachine -> Internal.InternalState -> ( Session, List Event, Cmd Msg )
onLinePrompt req events machine state =
    if state.restoringSession then
        ( Session
            { state
                | machine = machine
                , phase = Internal.Waiting
                , activePrompt = Just (Internal.LineActive req)
                , pendingOutput = emptyPendingOutput
                , restoringSession = False
            }
        , [ PromptIssued LinePrompt ]
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

            transcriptAfterOutput : List EngineTypes.Frame
            transcriptAfterOutput =
                state.transcript ++ [ EngineTypes.OutputFrame finalOutput ]

            turnRecord : Maybe EngineTypes.TurnRecord
            turnRecord =
                ZEngine.Output.captureTurnRecord machine newStatusLine transcriptAfterOutput state.turnHistory

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

            ctx : TurnEventsContext
            ctx =
                { finalFrame = toPublicFrame (EngineTypes.OutputFrame finalOutput)
                , previousStatusLine = Maybe.map toPublicStatusLine state.currentStatusLine
                , detectedTitle = detectedTitle
                }

            commonUpdates : Internal.InternalState -> Internal.InternalState
            commonUpdates s =
                { s
                    | machine = machine
                    , pendingOutput = emptyPendingOutput
                    , currentStatusLine = newStatusLine
                    , turnHistory = newTurnHistory
                    , storyName = nextStoryName
                    , titleEmitted = state.titleEmitted || detectedTitle /= Nothing
                }
        in
        case state.inputQueue of
            [] ->
                ( Session
                    (commonUpdates
                        { state
                            | phase = Internal.Waiting
                            , activePrompt = Just (Internal.LineActive req)
                            , transcript = transcriptAfterOutput
                        }
                    )
                , buildTurnEventsForLine ctx ++ [ PromptIssued LinePrompt ]
                , Cmd.none
                )

            next :: rest ->
                ( Session
                    (commonUpdates
                        { state
                            | phase = Internal.Running
                            , activePrompt = Nothing
                            , inputQueue = rest
                            , transcript = transcriptAfterOutput ++ [ EngineTypes.InputFrame { command = next } ]
                        }
                    )
                , buildTurnEventsForLine ctx
                , Task.succeed ()
                    |> Task.perform (\_ -> StepCompleted (ZMachine.provideInput (truncateInput req next) req machine))
                )


onNonLinePrompt :
    Internal.InternalPrompt
    -> Prompt
    -> List ZTypes.OutputEvent
    -> ZMachine.ZMachine
    -> Internal.InternalState
    -> ( Session, List Event, Cmd Msg )
onNonLinePrompt internalPrompt publicPrompt events machine state =
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

        statusChanged : Bool
        statusChanged =
            newStatusLine /= state.currentStatusLine

        hasOutput : Bool
        hasOutput =
            not (String.isEmpty finalOutput.text) || finalOutput.statusLine /= Nothing

        transcriptAfterOutput : List EngineTypes.Frame
        transcriptAfterOutput =
            if hasOutput then
                state.transcript ++ [ EngineTypes.OutputFrame finalOutput ]

            else
                state.transcript

        outputEvents : List Event
        outputEvents =
            if hasOutput then
                [ OutputProduced (toPublicFrame (EngineTypes.OutputFrame finalOutput)) ]

            else
                []

        statusEvents : List Event
        statusEvents =
            case ( statusChanged, newStatusLine ) of
                ( True, Just sl ) ->
                    [ StatusLineChanged (toPublicStatusLine sl) ]

                _ ->
                    []
    in
    ( Session
        { state
            | machine = machine
            , phase = Internal.Waiting
            , activePrompt = Just internalPrompt
            , transcript = transcriptAfterOutput
            , pendingOutput = emptyPendingOutput
            , currentStatusLine = newStatusLine
        }
    , outputEvents ++ statusEvents ++ [ PromptIssued publicPrompt ]
    , Cmd.none
    )


truncateInput : ZTypes.LineInputInfo -> String -> String
truncateInput req input =
    String.left req.maxLength input


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


{-| Inputs to `buildTurnEventsForLine`. Exposed for ordering tests.
-}
type alias TurnEventsContext =
    { finalFrame : Frame
    , previousStatusLine : Maybe StatusLine
    , detectedTitle : Maybe String
    }


{-| Pure event-list construction for a line-prompt turn boundary. Ordering
contract (covered by tests in `tests/ZEngine/EventsTest.elm`):
OutputProduced → StatusLineChanged (when different from previous) →
TurnCompleted → TitleDetected (only if `detectedTitle` is `Just` and the
caller hasn't already emitted one). The final `PromptIssued` event is
appended by the dispatch layer so it can carry the right `Prompt` variant.
-}
buildTurnEventsForLine : TurnEventsContext -> List Event
buildTurnEventsForLine ctx =
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


{-| Respond to a line prompt (the common `read` case). Safe to call in any
phase: if the engine isn't currently waiting for a line, the input is queued
and drained at the next line prompt. Input longer than the Z-Machine's
advertised max length is truncated on the way in.
-}
sendLine : String -> Session -> Result Error ( Session, List Event, Cmd Msg )
sendLine input (Session state) =
    let
        command : String
        command =
            stripTrailingNewline input
    in
    case ( state.phase, state.activePrompt ) of
        ( Internal.Waiting, Just (Internal.LineActive req) ) ->
            let
                truncated : String
                truncated =
                    truncateInput req command

                newTranscript : List EngineTypes.Frame
                newTranscript =
                    state.transcript ++ [ EngineTypes.InputFrame { command = truncated } ]

                newState : Internal.InternalState
                newState =
                    { state
                        | transcript = newTranscript
                        , activePrompt = Nothing
                        , phase = Internal.Running
                    }
            in
            Ok
                ( Session newState
                , []
                , Task.succeed ()
                    |> Task.perform (\_ -> StepCompleted (ZMachine.provideInput truncated req state.machine))
                )

        ( Internal.Loading, _ ) ->
            Ok ( Session { state | inputQueue = state.inputQueue ++ [ command ] }, [], Cmd.none )

        ( Internal.Running, _ ) ->
            Ok ( Session { state | inputQueue = state.inputQueue ++ [ command ] }, [], Cmd.none )

        _ ->
            Ok ( Session state, [], Cmd.none )


{-| Respond to a char prompt (`read_char`). No-op if the engine isn't
waiting for a single character.
-}
sendChar : Char -> Session -> Result Error ( Session, List Event, Cmd Msg )
sendChar c (Session state) =
    case ( state.phase, state.activePrompt ) of
        ( Internal.Waiting, Just Internal.CharActive ) ->
            let
                newState : Internal.InternalState
                newState =
                    { state | activePrompt = Nothing, phase = Internal.Running }
            in
            Ok
                ( Session newState
                , []
                , Task.succeed ()
                    |> Task.perform (\_ -> StepCompleted (ZMachine.provideChar (String.fromChar c) state.machine))
                )

        _ ->
            Ok ( Session state, [], Cmd.none )


{-| Respond to an in-game save prompt. Pass `True` if the consumer has
persisted the save bytes (from the `SavePrompt Bytes` variant), `False` on
failure or when the consumer declines. No-op if the engine isn't waiting for
a save result.
-}
sendSaveResult : Bool -> Session -> Result Error ( Session, List Event, Cmd Msg )
sendSaveResult ok (Session state) =
    case ( state.phase, state.activePrompt ) of
        ( Internal.Waiting, Just (Internal.SaveActive _) ) ->
            let
                newState : Internal.InternalState
                newState =
                    { state | activePrompt = Nothing, phase = Internal.Running }
            in
            Ok
                ( Session newState
                , []
                , Task.succeed ()
                    |> Task.perform (\_ -> StepCompleted (ZMachine.provideSaveResult ok state.machine))
                )

        _ ->
            Ok ( Session state, [], Cmd.none )


{-| Respond to an in-game restore prompt. Pass `Just bytes` to restore from
a previously-saved snapshot (produced by `SavePrompt`), `Nothing` to decline.
No-op if the engine isn't waiting for a restore.
-}
sendRestore : Maybe Bytes -> Session -> Result Error ( Session, List Event, Cmd Msg )
sendRestore maybeBytes (Session state) =
    case ( state.phase, state.activePrompt ) of
        ( Internal.Waiting, Just Internal.RestoreActive ) ->
            let
                newState : Internal.InternalState
                newState =
                    { state | activePrompt = Nothing, phase = Internal.Running }
            in
            Ok
                ( Session newState
                , []
                , Task.succeed ()
                    |> Task.perform
                        (\_ ->
                            let
                                maybeSnapshot : Maybe ZMachine.Snapshot
                                maybeSnapshot =
                                    maybeBytes
                                        |> Maybe.andThen
                                            (\bs ->
                                                ZMachine.Snapshot.decode state.machine.originalMemory bs
                                                    |> Result.toMaybe
                                            )
                            in
                            StepCompleted (ZMachine.provideRestoreResult maybeSnapshot state.machine)
                        )
                )

        _ ->
            Ok ( Session state, [], Cmd.none )


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
    -> Result Error ( Session, List Event, Cmd Msg )
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
                        , []
                        , yieldCmd
                        )


resumeFrom : TurnRecord -> Session -> Result Error ( Session, List Event, Cmd Msg )
resumeFrom publicRecord (Session state) =
    let
        record : EngineTypes.TurnRecord
        record =
            fromPublicTurnRecord publicRecord
    in
    case ZEngine.Snapshot.restore record.snapshotBytes state.machine of
        Err message ->
            Err (RestoreError message)

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
                        , activePrompt = Nothing
                        , transcript = truncatedTranscript
                        , turnHistory = truncatedHistory
                        , pendingOutput = emptyPendingOutput
                        , restoringSession = True
                        , currentStatusLine = Just (ZEngine.Output.statusLineFromTurnRecord record)
                    }
            in
            Ok ( Session newState, [], yieldCmd )


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


{-| Fold a list of events into a `(model, Cmd msg)` accumulator. Lets consumers
write a single `Event -> model -> (model, Cmd msg)` handler and apply it to
whatever events came back from `new` / `update` / `send` in one line. Cmds from
each handler are batched with the seed Cmd.
-}
foldEvents : (Event -> m -> ( m, Cmd msg )) -> List Event -> ( m, Cmd msg ) -> ( m, Cmd msg )
foldEvents handler events seed =
    List.foldl
        (\event ( m, cmd ) ->
            let
                ( m2, cmd2 ) =
                    handler event m
            in
            ( m2, Cmd.batch [ cmd, cmd2 ] )
        )
        seed
        events


formatMoveInfo : MoveInfo -> String
formatMoveInfo info =
    case info of
        AtTurn 0 ->
            "Start"

        AtTurn n ->
            "Turn " ++ String.fromInt n

        AtTime h m ->
            String.fromInt h ++ ":" ++ String.padLeft 2 '0' (String.fromInt m)
