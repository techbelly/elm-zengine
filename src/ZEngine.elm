module ZEngine exposing
    ( Session
    , Msg
    , Event(..)
    , Error(..)
    , errorMessage
    , Step
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
    , apply
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

{-| Session, transcript, and snapshot layer on top of
[`techbelly/elm-zmachine`](https://package.elm-lang.org/packages/techbelly/elm-zmachine/latest).

elm-zmachine gives you a pure Elm Z-Machine interpreter that you step
forward instruction by instruction; that's the level of control a
custom interpreter needs, but it's rarely what an application author
wants. This library wraps the interpreter in a small TEA-style
(`Model`, `Msg`, `update`) API:

  - You hold a [`Session`](#Session) and pass [`Msg`](#Msg) values to
    [`update`](#update).
  - Each `update` returns a [`Step`](#Step), which tells you the new
    session, what to render, and whether a `Cmd` needs to run (the
    interpreter yields to the runtime between step batches so the page
    stays responsive during long runs).
  - Output arrives as a frame-structured [`transcript`](#transcript)
    — one `OutputFrame` per prompt, one `InputFrame` per player
    command — not a raw text stream.
  - Save and restore flow through opaque [`SessionSnapshot`](#SessionSnapshot)
    values that round-trip through JSON.

The module re-exports everything you need; import it directly:

    import ZEngine exposing (Session, Msg, Event(..))

See the bundled tutorial, _Making a minimal interactive fiction
player with ZEngine_, for a walking-skeleton app that pulls all of
this together.


# Sessions

@docs Session, new, update


# Driving the update loop

@docs Msg, Step, apply, foldEvents, Event, Error, errorMessage


# Sending input

@docs sendLine, sendChar, sendSaveResult, sendRestore


# Inspecting the session

@docs phase, Phase, activePrompt, Prompt


# Transcript

@docs transcript, Frame, OutputFrameData, InputFrameData
@docs statusLine, StatusLine, StatusLineMode


# Turn history

@docs turnHistory, TurnRecord, MoveInfo, formatMoveInfo


# Saved state

@docs SessionSnapshot, snapshot, encodeSnapshot, snapshotDecoder
@docs restoreFrom, resumeFrom, snapshotBytes


# Story identity

@docs storyName, storyId, storyIdFromBytes
@docs releaseNumber, serialNumber, storyBytes


# Configuration

@docs Config, defaultConfig, CharPolicy, SavePolicy, RestorePolicy

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
import ZMachine.Snapshot
import ZMachine.Types as ZTypes exposing (StepResult)


{-| An opaque running session: the Z-Machine, its transcript, turn
history, current status line, and queued input. Store one in your
`Model`; all engine operations take a `Session` and return a
[`Step`](#Step) containing the next `Session`.
-}
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


{-| Internal engine messages. Wrap in your own `Msg` type with a
tagger: every engine call accepts `(Msg -> msg)` as its first
argument so commands come back already mapped.
-}
type Msg
    = Yielded
    | StepCompleted StepResult


{-| A single entry in the session transcript: either text the game
printed ([`OutputFrame`](#OutputFrameData)) or a command the player
sent ([`InputFrame`](#InputFrameData)).
-}
type Frame
    = OutputFrame OutputFrameData
    | InputFrame InputFrameData


{-| Contents of an `OutputFrame`: the full text rendered during this
turn (with embedded `\n` line breaks) and the status line that was
current when the frame was flushed (`Nothing` for pre-status-line
output such as the banner).
-}
type alias OutputFrameData =
    { text : String
    , statusLine : Maybe StatusLine
    }


{-| Contents of an `InputFrame`: the command string the player
submitted, already truncated to the Z-Machine's advertised max length.
-}
type alias InputFrameData =
    { command : String
    }


{-| The status line shown at the top of the game. Values are derived
from the underlying Z-Machine [`StatusLine`](ZMachine-Types#StatusLine)
— see [`StatusLineMode`](#StatusLineMode) for the version-dependent
right-hand content.
-}
type alias StatusLine =
    { locationId : Int
    , locationName : String
    , mode : StatusLineMode
    }


{-| Version-dependent payload of the status line:

  - `ScoreAndTurns score turns` — V3 score-based game.
  - `TimeOfDay hours minutes` — V3 time-based game (0–23, 0–59).
  - `ScreenRows rows` — V5+ game that draws its own upper window;
    one string per rendered row, already trimmed.

-}
type StatusLineMode
    = ScoreAndTurns Int Int
    | TimeOfDay Int Int
    | ScreenRows (List String)


{-| What the engine is currently waiting for when you receive a
`PromptIssued` event:

  - `LinePrompt` — a line of input; respond with [`sendLine`](#sendLine).
  - `CharPrompt` — a single character; respond with [`sendChar`](#sendChar).
  - `SavePrompt bytes` — an in-game `save`; persist `bytes` and call
    [`sendSaveResult`](#sendSaveResult).
  - `RestorePrompt` — an in-game `restore`; call
    [`sendRestore`](#sendRestore) with previously-persisted bytes.

The non-line variants only surface if the session [`Config`](#Config)
asks for them; the defaults auto-handle char/save/restore.

-}
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


{-| How to respond when the story asks for a single keypress
(`read_char`).

  - `AutoChar c` — answer internally with character `c` and keep
    running.
  - `SurfaceChar` — emit `PromptIssued CharPrompt` so the consumer
    can prompt the player and call [`sendChar`](#sendChar).

-}
type CharPolicy
    = AutoChar Char
    | SurfaceChar


{-| How to respond when the story executes the `save` opcode.

  - `DeclineSave` — report failure; the story's save-branch-on-failure
    is taken. Good default for linear play.
  - `SurfaceSave` — emit `PromptIssued (SavePrompt bytes)` carrying the
    snapshot bytes to persist; resume with [`sendSaveResult`](#sendSaveResult).

-}
type SavePolicy
    = DeclineSave
    | SurfaceSave


{-| How to respond when the story executes the `restore` opcode.

  - `DeclineRestore` — report failure; execution continues past the
    restore instruction.
  - `SurfaceRestore` — emit `PromptIssued RestorePrompt` so the
    consumer can pick a saved snapshot and call [`sendRestore`](#sendRestore).

-}
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


{-| One rewind point in the turn history. Captured automatically
when the player enters a room the engine hasn't seen before, so
[`resumeFrom`](#resumeFrom) can jump back to any past location.

  - `index` — monotonic counter, stable for the session.
  - `snapshotBytes` — Z-Machine snapshot bytes for the turn.
  - `locationId` / `locationName` — the room at that point.
  - `moveInfo` — turn counter or time, depending on the story.
  - `transcriptLength` — how much of the transcript belongs to this
    turn; used to trim on rewind.

-}
type alias TurnRecord =
    { index : Int
    , snapshotBytes : Bytes
    , locationId : Int
    , locationName : String
    , moveInfo : MoveInfo
    , transcriptLength : Int
    }


{-| Move counter for a turn. V3 stories are either score games
(`AtTurn`) or time games (`AtTime hours minutes`). Format for display
with [`formatMoveInfo`](#formatMoveInfo).
-}
type MoveInfo
    = AtTurn Int
    | AtTime Int Int


{-| Observations emitted during an `update`/`send` call, returned in
`step.events`. Handle the ones you care about and ignore the rest:

  - `OutputProduced frame` — a new transcript frame was added.
    Append to your rendered transcript.
  - `PromptIssued prompt` — the story is blocked waiting for the
    consumer; show a prompt and eventually call the matching
    `send…` function.
  - `StatusLineChanged status` — the status line changed. Useful
    for keeping a sticky header in sync without re-reading
    `statusLine` every render.
  - `TurnCompleted` — a full player turn just resolved.
  - `TitleDetected title` — the engine sniffed a game title from
    banner output. Emitted at most once per session.
  - `GameOver` — the story halted cleanly (the player quit).

-}
type Event
    = OutputProduced Frame
    | PromptIssued Prompt
    | StatusLineChanged StatusLine
    | TurnCompleted
    | TitleDetected String
    | GameOver


{-| A session-level failure. Paired with a `Step` whose `session`
is `Nothing` (load/restore) or a terminal session (runtime).

  - `LoadError` — the story bytes couldn't be parsed as a Z-Machine
    story file, or the version isn't supported.
  - `RestoreError` — a snapshot couldn't be applied to the story
    (wrong story, corrupt data).
  - `RuntimeError` — the interpreter halted with an error. The
    returned session is terminal but still useful for rendering the
    final transcript.

Use [`errorMessage`](#errorMessage) if you just want the string.

-}
type Error
    = LoadError String
    | RestoreError String
    | RuntimeError String


{-| Extract the human-readable message from an `Error`, regardless of
variant. Saves clients writing their own case-on-Error-to-string helper.
-}
errorMessage : Error -> String
errorMessage err =
    case err of
        LoadError msg ->
            msg

        RestoreError msg ->
            msg

        RuntimeError msg ->
            msg


{-| The result of any session-advancing call (`new`, `update`, `sendLine`,
etc.). One uniform shape covers both success and failure:

  - `session` is `Just` whenever the caller has a usable session to store —
    including runtime errors, where it holds the terminal state so the client
    can keep rendering the transcript. It's `Nothing` only when the machine
    couldn't load or restore at all.
  - `events` is the list of things the library observed during the step.
  - `cmd` is the next command the client should return from their `update`.
    Every session-advancing call takes a `(Msg -> msg)` tagger as its first
    argument and the command comes out already wrapped, so clients never need
    `Cmd.map` at the call site.
  - `error` is `Just` iff something went wrong. Pair with `errorMessage` for
    a display string.

-}
type alias Step msg =
    { session : Maybe Session
    , events : List Event
    , cmd : Cmd msg
    , error : Maybe Error
    }


okStep : Session -> List Event -> Cmd Msg -> Step Msg
okStep session events cmd =
    { session = Just session, events = events, cmd = cmd, error = Nothing }


loadFailed : String -> Step Msg
loadFailed message =
    { session = Nothing, events = [], cmd = Cmd.none, error = Just (LoadError message) }


restoreFailed : String -> Step Msg
restoreFailed message =
    { session = Nothing, events = [], cmd = Cmd.none, error = Just (RestoreError message) }


runtimeErrored : Session -> List Event -> String -> Step Msg
runtimeErrored session events message =
    { session = Just session, events = events, cmd = Cmd.none, error = Just (RuntimeError message) }


mapStep : (Msg -> msg) -> Step Msg -> Step msg
mapStep tagger step =
    { session = step.session
    , events = step.events
    , cmd = Cmd.map tagger step.cmd
    , error = step.error
    }


{-| Fold a `Step` into your model in one call. `merge` is yours — it's how
you copy the engine's session (and any error) into your own `Model`. The
helper takes care of wrapping `step.cmd` into your `update` return tuple.
Designed to pipe:

    mergeEngine : Maybe ZEngine.Session -> Maybe ZEngine.Error -> Model -> Model
    mergeEngine session error model =
        { model
            | session = session
            , error = Maybe.map ZEngine.errorMessage error
        }

    ZEngine.sendLine EngineMsg command session
        |> ZEngine.apply mergeEngine model

-}
apply : (Maybe Session -> Maybe Error -> m -> m) -> m -> Step msg -> ( m, Cmd msg )
apply merge model step =
    ( merge step.session step.error model, step.cmd )


{-| The session's lifecycle state. Most UIs only need to distinguish
`Waiting` (show a prompt) from everything else (show a spinner or
nothing), but the full set is available for richer rendering.

  - `Loading` — `new` / `restoreFrom` kicked off but hasn't yielded yet.
  - `Running` — the interpreter is mid-turn.
  - `Waiting prompt` — blocked on the consumer; see [`Prompt`](#Prompt).
  - `Halted` — the story quit cleanly.
  - `Errored message` — the interpreter reported a runtime error;
    the session is terminal.

-}
type Phase
    = Loading
    | Running
    | Waiting Prompt
    | Halted
    | Errored String


{-| The session's current [`Phase`](#Phase).
-}
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


{-| The current [`Prompt`](#Prompt), or `Nothing` if the session isn't
waiting on the consumer. Equivalent to `phase >> toPrompt`, but a
direct accessor is usually enough.
-}
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


{-| Start a new session from raw story-file bytes. The returned
`Step` carries the initial `Session` and a yield `Cmd` that kicks off
execution; return the cmd from your `update` and the engine will
start stepping through the prologue.

    init : Bytes -> ( Model, Cmd Msg )
    init storyBytes =
        let
            step =
                ZEngine.new EngineMsg ZEngine.defaultConfig storyBytes
        in
        ( { session = step.session, error = Maybe.map ZEngine.errorMessage step.error }
        , step.cmd
        )

On load failure, `step.session` is `Nothing` and `step.error` is
`Just (LoadError _)`.

-}
new : (Msg -> msg) -> Config -> Bytes -> Step msg
new tagger config bytes =
    (case ZMachine.load bytes of
        Err err ->
            loadFailed err

        Ok machine ->
            okStep (Session (initialState config machine bytes)) [] yieldCmd
    )
        |> mapStep tagger


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


{-| Advance the session in response to an engine `Msg`. This is what
you call from your own `update` whenever you receive a tagged engine
message:

    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            EngineMsg engineMsg ->
                case model.session of
                    Just session ->
                        ZEngine.update EngineMsg engineMsg session
                            |> ZEngine.apply mergeEngine model

                    Nothing ->
                        ( model, Cmd.none )

The engine yields to the runtime between step batches, so long runs
don't block the UI — just keep piping the returned `Cmd` back into
your `update`.

-}
update : (Msg -> msg) -> Msg -> Session -> Step msg
update tagger msg (Session state) =
    (case msg of
        Yielded ->
            dispatch (ZMachine.runSteps stepBudget state.machine) state

        StepCompleted result ->
            dispatch result state
    )
        |> mapStep tagger


dispatch : StepResult -> InternalState -> Step Msg
dispatch result state =
    case result of
        ZTypes.Continue events machine ->
            okStep
                (Session
                    { state
                        | machine = machine
                        , phase = Internal.Running
                        , pendingOutput = ZEngine.Output.processEvents events state.pendingOutput
                    }
                )
                []
                yieldCmd

        ZTypes.NeedInput req events machine ->
            okFromTriple (onLinePrompt req events machine state)

        ZTypes.NeedChar events machine ->
            case state.config.onCharPrompt of
                SurfaceChar ->
                    okFromTriple (onNonLinePrompt Internal.CharActive CharPrompt events machine state)

                AutoChar c ->
                    okFromTriple (onAutoRespondPrompt (ZMachine.provideChar (String.fromChar c)) events machine state)

        ZTypes.NeedSave machineSnapshot events machine ->
            case state.config.onSavePrompt of
                SurfaceSave ->
                    let
                        saveBytes : Bytes
                        saveBytes =
                            ZMachine.Snapshot.encode state.machine.originalMemory machineSnapshot
                    in
                    okFromTriple (onNonLinePrompt (Internal.SaveActive saveBytes) (SavePrompt saveBytes) events machine state)

                DeclineSave ->
                    okFromTriple (onAutoRespondPrompt (ZMachine.provideSaveResult False) events machine state)

        ZTypes.NeedRestore events machine ->
            case state.config.onRestorePrompt of
                SurfaceRestore ->
                    okFromTriple (onNonLinePrompt Internal.RestoreActive RestorePrompt events machine state)

                DeclineRestore ->
                    okFromTriple (onAutoRespondPrompt (ZMachine.provideRestoreResult Nothing) events machine state)

        ZTypes.Halted events machine ->
            let
                finalOutput : EngineTypes.PendingOutput
                finalOutput =
                    ZEngine.Output.processEvents events state.pendingOutput

                newTranscript : List EngineTypes.Frame
                newTranscript =
                    state.transcript ++ [ EngineTypes.OutputFrame finalOutput ]
            in
            okStep
                (Session
                    { state
                        | machine = machine
                        , phase = Internal.Halted
                        , transcript = newTranscript
                        , pendingOutput = emptyPendingOutput
                    }
                )
                [ OutputProduced (toPublicFrame (EngineTypes.OutputFrame finalOutput)), GameOver ]
                Cmd.none

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
            runtimeErrored
                erroredSession
                [ OutputProduced (toPublicFrame (EngineTypes.OutputFrame finalOutput)) ]
                message


okFromTriple : ( Session, List Event, Cmd Msg ) -> Step Msg
okFromTriple ( session, events, cmd ) =
    okStep session events cmd


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
sendLine : (Msg -> msg) -> String -> Session -> Step msg
sendLine tagger input (Session state) =
    let
        command : String
        command =
            stripTrailingNewline input
    in
    (case ( state.phase, state.activePrompt ) of
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
            okStep
                (Session newState)
                []
                (Task.succeed ()
                    |> Task.perform (\_ -> StepCompleted (ZMachine.provideInput truncated req state.machine))
                )

        ( Internal.Loading, _ ) ->
            okStep (Session { state | inputQueue = state.inputQueue ++ [ command ] }) [] Cmd.none

        ( Internal.Running, _ ) ->
            okStep (Session { state | inputQueue = state.inputQueue ++ [ command ] }) [] Cmd.none

        _ ->
            okStep (Session state) [] Cmd.none
    )
        |> mapStep tagger


{-| Respond to a char prompt (`read_char`). No-op if the engine isn't
waiting for a single character.
-}
sendChar : (Msg -> msg) -> Char -> Session -> Step msg
sendChar tagger c (Session state) =
    (case ( state.phase, state.activePrompt ) of
        ( Internal.Waiting, Just Internal.CharActive ) ->
            let
                newState : InternalState
                newState =
                    { state | activePrompt = Nothing, phase = Internal.Running }
            in
            okStep
                (Session newState)
                []
                (Task.succeed ()
                    |> Task.perform (\_ -> StepCompleted (ZMachine.provideChar (String.fromChar c) state.machine))
                )

        _ ->
            okStep (Session state) [] Cmd.none
    )
        |> mapStep tagger


{-| Respond to an in-game save prompt. Pass `True` if the consumer has
persisted the save bytes (from the `SavePrompt Bytes` variant), `False` on
failure or when the consumer declines. No-op if the engine isn't waiting for
a save result.
-}
sendSaveResult : (Msg -> msg) -> Bool -> Session -> Step msg
sendSaveResult tagger saveOk (Session state) =
    (case ( state.phase, state.activePrompt ) of
        ( Internal.Waiting, Just (Internal.SaveActive _) ) ->
            let
                newState : InternalState
                newState =
                    { state | activePrompt = Nothing, phase = Internal.Running }
            in
            okStep
                (Session newState)
                []
                (Task.succeed ()
                    |> Task.perform (\_ -> StepCompleted (ZMachine.provideSaveResult saveOk state.machine))
                )

        _ ->
            okStep (Session state) [] Cmd.none
    )
        |> mapStep tagger


{-| Respond to an in-game restore prompt. Pass `Just bytes` to restore from
a previously-saved snapshot (produced by `SavePrompt`), `Nothing` to decline.
No-op if the engine isn't waiting for a restore.
-}
sendRestore : (Msg -> msg) -> Maybe Bytes -> Session -> Step msg
sendRestore tagger maybeBytes (Session state) =
    (case ( state.phase, state.activePrompt ) of
        ( Internal.Waiting, Just Internal.RestoreActive ) ->
            let
                newState : InternalState
                newState =
                    { state | activePrompt = Nothing, phase = Internal.Running }
            in
            okStep
                (Session newState)
                []
                (Task.succeed ()
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
            okStep (Session state) [] Cmd.none
    )
        |> mapStep tagger


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
restoreFrom : (Msg -> msg) -> Config -> SessionSnapshot -> Step msg
restoreFrom tagger config (SessionSnapshot snap) =
    (case ZMachine.load snap.storyBytes of
        Err err ->
            loadFailed err

        Ok freshMachine ->
            case effectiveMachineSnapshot snap of
                Nothing ->
                    okStep (Session (initialState config freshMachine snap.storyBytes)) [] yieldCmd

                Just machineSnapshot ->
                    case ZEngine.Snapshot.restore machineSnapshot freshMachine of
                        Err message ->
                            restoreFailed message

                        Ok restoredMachine ->
                            let
                                base : InternalState
                                base =
                                    initialState config restoredMachine snap.storyBytes
                            in
                            okStep
                                (Session
                                    { base
                                        | restoringSession = True
                                        , phase = Internal.Running
                                        , transcript = snap.transcript
                                        , turnHistory = snap.turnHistory
                                        , currentStatusLine = snap.currentStatusLine
                                        , storyName = snap.storyName
                                        , titleEmitted = not (String.isEmpty snap.storyName)
                                    }
                                )
                                []
                                yieldCmd
    )
        |> mapStep tagger


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


{-| Rewind the session to a past `TurnRecord` captured in
[`turnHistory`](#turnHistory). Trims the transcript and history back
to that point and resumes the interpreter from the recorded machine
snapshot.

    case List.head (ZEngine.turnHistory session) of
        Just earliest ->
            ZEngine.resumeFrom EngineMsg earliest session

        Nothing ->
            -- no prior turns recorded yet
            ...

-}
resumeFrom : (Msg -> msg) -> TurnRecord -> Session -> Step msg
resumeFrom tagger publicRecord (Session state) =
    let
        record : EngineTypes.TurnRecord
        record =
            fromPublicTurnRecord publicRecord
    in
    (case ZEngine.Snapshot.restore record.snapshotBytes state.machine of
        Err message ->
            restoreFailed message

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
            okStep (Session newState) [] yieldCmd
    )
        |> mapStep tagger


{-| The session's transcript as a flat list of frames in play order.
Use for rendering; prefer subscribing to `OutputProduced` events if
you want to react to each turn as it arrives.
-}
transcript : Session -> List Frame
transcript (Session state) =
    List.map toPublicFrame state.transcript


{-| The most recent status line, or `Nothing` if the game hasn't
produced one yet. Mirrors the value carried inside the last
`OutputFrame`.
-}
statusLine : Session -> Maybe StatusLine
statusLine (Session state) =
    Maybe.map toPublicStatusLine state.currentStatusLine


{-| Rewind points recorded as the player visited new locations. Pass
one back to [`resumeFrom`](#resumeFrom) to jump the session to that
point in history.
-}
turnHistory : Session -> List TurnRecord
turnHistory (Session state) =
    List.map toPublicTurnRecord state.turnHistory


{-| The game's detected title, or `""` until it's been sniffed from
the banner. Clients usually listen for the `TitleDetected` event and
remember the value themselves; this accessor is a convenience.
-}
storyName : Session -> String
storyName (Session state) =
    state.storyName


{-| A stable identifier for the story file backing this session —
release, serial, and checksum joined with dashes. Useful as a key in
per-story stores (autosaves, bookmarks, preferences).
-}
storyId : Session -> String
storyId (Session state) =
    storyIdFromMachine state.machine


{-| Compute [`storyId`](#storyId) directly from raw bytes without
constructing a session. Returns `Nothing` if the bytes aren't a
valid story file.
-}
storyIdFromBytes : Bytes -> Maybe String
storyIdFromBytes bytes =
    case ZMachine.load bytes of
        Ok machine ->
            Just (storyIdFromMachine machine)

        Err _ ->
            Nothing


storyIdFromMachine : ZMachine.ZMachine -> String
storyIdFromMachine machine =
    String.fromInt (ZMachine.storyRelease machine)
        ++ "-"
        ++ ZMachine.storySerial machine
        ++ "-"
        ++ String.fromInt (ZMachine.storyChecksum machine)


{-| The story file's release number (header word 0x02).
-}
releaseNumber : Session -> Int
releaseNumber (Session state) =
    ZMachine.storyRelease state.machine


{-| The story file's serial number — six ASCII bytes at header 0x12.
Usually a `YYMMDD` build date for Infocom stories.
-}
serialNumber : Session -> String
serialNumber (Session state) =
    ZMachine.storySerial state.machine


{-| The raw story bytes this session was loaded from. Handy when you
want to re-seed a fresh session or hand the bytes off elsewhere
without re-reading from disk.
-}
storyBytes : Session -> Bytes
storyBytes (Session state) =
    state.storyBytes


{-| Encode just the Z-Machine machine state as bytes. Lighter than
[`snapshot`](#snapshot) — no transcript, no turn history — and
compatible with
[`ZMachine.Snapshot.decode`](ZMachine-Snapshot#decode) for clients
that want to round-trip machine state only.
-}
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


{-| Format a [`MoveInfo`](#MoveInfo) for display. `AtTurn 0` renders
as `"Start"`; other turns render as `"Turn N"`; times render as
`"H:MM"`.
-}
formatMoveInfo : MoveInfo -> String
formatMoveInfo info =
    case info of
        AtTurn 0 ->
            "Start"

        AtTurn n ->
            "Turn " ++ String.fromInt n

        AtTime h m ->
            String.fromInt h ++ ":" ++ String.padLeft 2 '0' (String.fromInt m)
