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
    , Config
    , CharPolicy(..)
    , SavePolicy(..)
    , RestorePolicy(..)
    , defaultConfig
    , new
    , update
    , sendLine
    , sendChar
    , sendSaveResult
    , sendRestore
    , SessionSnapshot
    , snapshot
    , encodeSnapshot
    , snapshotDecoder
    , restoreFrom
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
    )

{-| Public surface for the elm-zengine library.

Readers are real; driver operations are still `Debug.todo`s and will be wired
in subsequent commits. The app does not yet import this module.

-}

import Base64
import Bytes exposing (Bytes)
import Json.Decode as D
import Json.Encode as E
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
    = Session InternalState


type alias InternalState =
    { machine : ZMachine.ZMachine
    , storyBytes : Bytes
    , config : Config
    , activePrompt : Maybe Internal.InternalPrompt
    , inputQueue : List String
    , transcript : List EngineTypes.Frame
    , pendingOutput : EngineTypes.PendingOutput
    , currentStatusLine : Maybe ZTypes.StatusLine
    , turnHistory : List EngineTypes.TurnRecord
    , restoringSession : Bool
    , phase : Internal.Phase
    , storyName : String
    , titleEmitted : Bool
    }


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


{-| Session-wide policy for non-line prompts. Each prompt can be auto-handled
internally (the defaults) or surfaced to the consumer as a `PromptIssued`
event.
-}
type alias Config =
    { onCharPrompt : CharPolicy
    , onSavePrompt : SavePolicy
    , onRestorePrompt : RestorePolicy
    }


type CharPolicy
    = AutoChar Char
    | SurfaceChar


type SavePolicy
    = DeclineSave
    | SurfaceSave


type RestorePolicy
    = DeclineRestore
    | SurfaceRestore


{-| Sensible defaults that preserve pre-Config behavior: auto-send space for
`read_char`, decline in-game saves, decline in-game restores.
-}
defaultConfig : Config
defaultConfig =
    { onCharPrompt = AutoChar ' '
    , onSavePrompt = DeclineSave
    , onRestorePrompt = DeclineRestore
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


promptFromInternal : InternalState -> Prompt
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


new : Config -> Bytes -> Result Error ( Session, List Event, Cmd Msg )
new config bytes =
    case ZMachine.load bytes of
        Err err ->
            Err (LoadError err)

        Ok machine ->
            Ok
                ( Session (initialState config machine bytes)
                , []
                , yieldCmd
                )


initialState : Config -> ZMachine.ZMachine -> Bytes -> InternalState
initialState config machine bytes =
    { machine = machine
    , storyBytes = bytes
    , config = config
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


dispatch : StepResult -> InternalState -> Result Error ( Session, List Event, Cmd Msg )
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
            case state.config.onCharPrompt of
                SurfaceChar ->
                    Ok (onNonLinePrompt Internal.CharActive CharPrompt events machine state)

                AutoChar c ->
                    Ok (onAutoRespondPrompt (ZMachine.provideChar (String.fromChar c)) events machine state)

        ZTypes.NeedSave machineSnapshot events machine ->
            case state.config.onSavePrompt of
                SurfaceSave ->
                    let
                        saveBytes : Bytes
                        saveBytes =
                            ZMachine.Snapshot.encode state.machine.originalMemory machineSnapshot
                    in
                    Ok (onNonLinePrompt (Internal.SaveActive saveBytes) (SavePrompt saveBytes) events machine state)

                DeclineSave ->
                    Ok (onAutoRespondPrompt (ZMachine.provideSaveResult False) events machine state)

        ZTypes.NeedRestore events machine ->
            case state.config.onRestorePrompt of
                SurfaceRestore ->
                    Ok (onNonLinePrompt Internal.RestoreActive RestorePrompt events machine state)

                DeclineRestore ->
                    Ok (onAutoRespondPrompt (ZMachine.provideRestoreResult Nothing) events machine state)

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


onLinePrompt : ZTypes.LineInputInfo -> List ZTypes.OutputEvent -> ZMachine.ZMachine -> InternalState -> ( Session, List Event, Cmd Msg )
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

            commonUpdates : InternalState -> InternalState
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
    -> InternalState
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


{-| Flush output/status like `onNonLinePrompt`, but instead of surfacing a
`PromptIssued` event, advance the machine with the provided responder and
stay in `Running`. Used when the session `Config` opts to auto-handle the
prompt internally.
-}
onAutoRespondPrompt :
    (ZMachine.ZMachine -> StepResult)
    -> List ZTypes.OutputEvent
    -> ZMachine.ZMachine
    -> InternalState
    -> ( Session, List Event, Cmd Msg )
onAutoRespondPrompt respond events machine state =
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
            , phase = Internal.Running
            , activePrompt = Nothing
            , transcript = transcriptAfterOutput
            , pendingOutput = emptyPendingOutput
            , currentStatusLine = newStatusLine
        }
    , outputEvents ++ statusEvents
    , Task.succeed ()
        |> Task.perform (\_ -> StepCompleted (respond machine))
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


type alias TurnEventsContext =
    { finalFrame : Frame
    , previousStatusLine : Maybe StatusLine
    , detectedTitle : Maybe String
    }


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

                newState : InternalState
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
                newState : InternalState
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
                newState : InternalState
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
                newState : InternalState
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


{-| Serialized snapshot of a `Session`, suitable for persistence. Carries
everything `restoreFrom` needs to rebuild a session (story bytes, machine
snapshot, transcript, turn history, current status line, story name).

Opaque so the library can evolve the internal shape without breaking
clients — use `encodeSnapshot` / `snapshotDecoder` to move it on and off
disk, and `restoreFrom` to turn it back into a live `Session`.
-}
type SessionSnapshot
    = SessionSnapshot SnapshotInternals


type alias SnapshotInternals =
    { storyBytes : Bytes
    , machineSnapshot : Maybe Bytes
    , transcript : List EngineTypes.Frame
    , turnHistory : List EngineTypes.TurnRecord
    , currentStatusLine : Maybe ZTypes.StatusLine
    , storyName : String
    }


{-| Capture a session's state for persistence. The resulting snapshot is
self-contained — pass it to `restoreFrom` later to rebuild the session.
-}
snapshot : Session -> SessionSnapshot
snapshot (Session state) =
    SessionSnapshot
        { storyBytes = state.storyBytes
        , machineSnapshot = Just (ZEngine.Snapshot.encode state.machine)
        , transcript = state.transcript
        , turnHistory = state.turnHistory
        , currentStatusLine = state.currentStatusLine
        , storyName = state.storyName
        }


{-| Rebuild a `Session` from a previously-captured snapshot. If the snapshot
lacks a machine snapshot (legacy saves that predate snapshot capture), falls
back to starting a fresh session from the story bytes.
-}
restoreFrom : Config -> SessionSnapshot -> Result Error ( Session, List Event, Cmd Msg )
restoreFrom config (SessionSnapshot snap) =
    case ZMachine.load snap.storyBytes of
        Err err ->
            Err (LoadError err)

        Ok freshMachine ->
            case effectiveMachineSnapshot snap of
                Nothing ->
                    Ok
                        ( Session (initialState config freshMachine snap.storyBytes)
                        , []
                        , yieldCmd
                        )

                Just machineSnapshot ->
                    case ZEngine.Snapshot.restore machineSnapshot freshMachine of
                        Err message ->
                            Err (RestoreError message)

                        Ok restoredMachine ->
                            let
                                base : InternalState
                                base =
                                    initialState config restoredMachine snap.storyBytes
                            in
                            Ok
                                ( Session
                                    { base
                                        | restoringSession = True
                                        , phase = Internal.Running
                                        , transcript = snap.transcript
                                        , turnHistory = snap.turnHistory
                                        , currentStatusLine = snap.currentStatusLine
                                        , storyName = snap.storyName
                                        , titleEmitted = not (String.isEmpty snap.storyName)
                                    }
                                , []
                                , yieldCmd
                                )


{-| Pick the best available machine snapshot: the one captured at save time
if present, otherwise the most recent turn-history snapshot. Legacy saves
wrote the machine state into the last turn record instead of a top-level
`machineSnapshot` field.
-}
effectiveMachineSnapshot : SnapshotInternals -> Maybe Bytes
effectiveMachineSnapshot snap =
    case snap.machineSnapshot of
        Just bytes ->
            Just bytes

        Nothing ->
            List.foldl (\tr _ -> Just tr.snapshotBytes) Nothing snap.turnHistory


{-| Encode a snapshot as a JSON value for persistence. Pair with
`snapshotDecoder` to round-trip through any JSON-backed store.
-}
encodeSnapshot : SessionSnapshot -> E.Value
encodeSnapshot (SessionSnapshot snap) =
    E.object
        [ ( "storyBytes", encodeBytes snap.storyBytes )
        , ( "machineSnapshot", encodeMaybe encodeBytes snap.machineSnapshot )
        , ( "transcript", E.list encodeFrame snap.transcript )
        , ( "turnHistory", E.list encodeTurnRecord snap.turnHistory )
        , ( "currentStatusLine", encodeMaybe encodeStatusLine snap.currentStatusLine )
        , ( "storyName", E.string snap.storyName )
        ]


{-| Decode a snapshot produced by `encodeSnapshot`, with fallbacks for older
shapes so pre-migration saves still load.
-}
snapshotDecoder : D.Decoder SessionSnapshot
snapshotDecoder =
    D.map SessionSnapshot
        (D.map6 SnapshotInternals
            (D.field "storyBytes" decodeBytes)
            (D.oneOf
                [ D.field "machineSnapshot" (D.nullable decodeBytes)
                , D.field "currentSnapshot" (D.nullable decodeBytes)
                , D.succeed Nothing
                ]
            )
            (decoderOrDefault "transcript" (D.list decodeFrame) [])
            (decoderOrDefault "turnHistory" (D.list decodeTurnRecord) [])
            (decoderOrDefault "currentStatusLine" (D.nullable decodeStatusLine) Nothing)
            (decoderOrDefault "storyName" D.string "")
        )


decoderOrDefault : String -> D.Decoder a -> a -> D.Decoder a
decoderOrDefault fieldName decoder fallback =
    D.oneOf [ D.field fieldName decoder, D.succeed fallback ]


encodeBytes : Bytes -> E.Value
encodeBytes bytes =
    E.string (Base64.fromBytes bytes |> Maybe.withDefault "")


decodeBytes : D.Decoder Bytes
decodeBytes =
    D.string
        |> D.andThen
            (\s ->
                case Base64.toBytes s of
                    Just bytes ->
                        D.succeed bytes

                    Nothing ->
                        D.fail "Invalid base64"
            )


encodeMaybe : (a -> E.Value) -> Maybe a -> E.Value
encodeMaybe encoder =
    Maybe.map encoder >> Maybe.withDefault E.null


encodeFrame : EngineTypes.Frame -> E.Value
encodeFrame frame =
    case frame of
        EngineTypes.OutputFrame data ->
            E.object
                [ ( "type", E.string "output" )
                , ( "text", E.string data.text )
                , ( "statusLine", encodeMaybe encodeStatusLine data.statusLine )
                ]

        EngineTypes.InputFrame data ->
            E.object
                [ ( "type", E.string "input" )
                , ( "command", E.string data.command )
                ]


decodeFrame : D.Decoder EngineTypes.Frame
decodeFrame =
    taggedUnion "type"
        [ ( "output"
          , D.map2 (\text sl -> EngineTypes.OutputFrame { text = text, statusLine = sl })
                (D.field "text" D.string)
                (D.field "statusLine" (D.nullable decodeStatusLine))
          )
        , ( "input"
          , D.map (\cmd -> EngineTypes.InputFrame { command = cmd })
                (D.field "command" D.string)
          )
        ]


encodeTurnRecord : EngineTypes.TurnRecord -> E.Value
encodeTurnRecord record =
    E.object
        [ ( "index", E.int record.index )
        , ( "snapshotBytes", encodeBytes record.snapshotBytes )
        , ( "locationId", E.int record.locationId )
        , ( "locationName", E.string record.locationName )
        , ( "moveInfo", encodeMoveInfo record.moveInfo )
        , ( "transcriptLength", E.int record.transcriptLength )
        ]


decodeTurnRecord : D.Decoder EngineTypes.TurnRecord
decodeTurnRecord =
    D.oneOf
        [ D.succeed EngineTypes.TurnRecord
            |> andMap (D.field "index" D.int)
            |> andMap (D.field "snapshotBytes" decodeBytes)
            |> andMap (D.field "locationId" D.int)
            |> andMap (D.field "locationName" D.string)
            |> andMap (D.field "moveInfo" decodeMoveInfo)
            |> andMap (D.field "transcriptLength" D.int)
        , decodeLegacyTurnRecord
        ]


decodeLegacyTurnRecord : D.Decoder EngineTypes.TurnRecord
decodeLegacyTurnRecord =
    D.map5
        (\idx snap _ locName tl ->
            { index = idx
            , snapshotBytes = snap
            , locationId = 0
            , locationName = locName
            , moveInfo = EngineTypes.AtTurn 0
            , transcriptLength = tl
            }
        )
        (D.field "index" D.int)
        (D.field "snapshotBytes" decodeBytes)
        (D.field "command" D.string)
        (D.field "locationName" D.string)
        (D.field "transcriptLength" D.int)


encodeMoveInfo : EngineTypes.MoveInfo -> E.Value
encodeMoveInfo info =
    case info of
        EngineTypes.AtTurn n ->
            E.object [ ( "type", E.string "turns" ), ( "turns", E.int n ) ]

        EngineTypes.AtTime h m ->
            E.object [ ( "type", E.string "time" ), ( "hours", E.int h ), ( "minutes", E.int m ) ]


decodeMoveInfo : D.Decoder EngineTypes.MoveInfo
decodeMoveInfo =
    taggedUnion "type"
        [ ( "turns", D.map EngineTypes.AtTurn (D.field "turns" D.int) )
        , ( "time"
          , D.map2 EngineTypes.AtTime
                (D.field "hours" D.int)
                (D.field "minutes" D.int)
          )
        ]


encodeStatusLine : ZTypes.StatusLine -> E.Value
encodeStatusLine sl =
    E.object
        [ ( "locationId", E.int sl.locationId )
        , ( "locationName", E.string sl.locationName )
        , ( "mode", encodeStatusLineMode sl.mode )
        ]


decodeStatusLine : D.Decoder ZTypes.StatusLine
decodeStatusLine =
    D.oneOf
        [ D.map3 ZTypes.StatusLine
            (D.field "locationId" D.int)
            (D.field "locationName" D.string)
            (D.field "mode" decodeStatusLineMode)
        , decodeLegacyStatusLine
        ]


decodeLegacyStatusLine : D.Decoder ZTypes.StatusLine
decodeLegacyStatusLine =
    D.map4
        (\name score turns isTime ->
            { locationId = 0
            , locationName = name
            , mode =
                if isTime then
                    ZTypes.TimeOfDay score turns

                else
                    ZTypes.ScoreAndTurns score turns
            }
        )
        (D.field "locationName" D.string)
        (D.field "score" D.int)
        (D.field "turns" D.int)
        (D.field "isTimeGame" D.bool)


encodeStatusLineMode : ZTypes.StatusLineMode -> E.Value
encodeStatusLineMode mode =
    case mode of
        ZTypes.ScoreAndTurns score turns ->
            E.object
                [ ( "type", E.string "scoreAndTurns" )
                , ( "score", E.int score )
                , ( "turns", E.int turns )
                ]

        ZTypes.TimeOfDay hours minutes ->
            E.object
                [ ( "type", E.string "timeOfDay" )
                , ( "hours", E.int hours )
                , ( "minutes", E.int minutes )
                ]

        ZTypes.ScreenRows rows ->
            E.object
                [ ( "type", E.string "screenRows" )
                , ( "rows", E.list E.string rows )
                ]


decodeStatusLineMode : D.Decoder ZTypes.StatusLineMode
decodeStatusLineMode =
    taggedUnion "type"
        [ ( "scoreAndTurns"
          , D.map2 ZTypes.ScoreAndTurns
                (D.field "score" D.int)
                (D.field "turns" D.int)
          )
        , ( "timeOfDay"
          , D.map2 ZTypes.TimeOfDay
                (D.field "hours" D.int)
                (D.field "minutes" D.int)
          )
        , ( "screenRows"
          , D.map ZTypes.ScreenRows
                (D.field "rows" (D.list D.string))
          )
        ]


taggedUnion : String -> List ( String, D.Decoder a ) -> D.Decoder a
taggedUnion tagField cases =
    D.field tagField D.string
        |> D.andThen
            (\tag ->
                case List.filter (\( k, _ ) -> k == tag) cases of
                    ( _, decoder ) :: _ ->
                        decoder

                    [] ->
                        D.fail ("Unknown " ++ tagField ++ ": " ++ tag)
            )


andMap : D.Decoder a -> D.Decoder (a -> b) -> D.Decoder b
andMap argDecoder funcDecoder =
    D.map2 (\f a -> f a) funcDecoder argDecoder


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

                newState : InternalState
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
