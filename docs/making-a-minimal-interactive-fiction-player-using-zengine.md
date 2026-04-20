# Making a minimal interactive fiction player using ZEngine

This walkthrough builds a ~150-line Elm app that loads a Z-Machine story
file and lets the user play it. Every line of code shown below is in
[demos/minimal/src/Main.elm](../../demos/minimal/src/Main.elm); you can
clone the repo and run it.

## What you're building

A single-page app with:

- an "Open .z3 story…" button that takes a local file
- a scrolling transcript of the game's output and your commands
- a status line at the top (location name)
- a text input at the bottom for typing commands

That's it. No saved games, no history navigation, no mobile tweaks, no
styling beyond a monospace font. Those things are possible — Planedrift
builds them on the same library — but they aren't in scope here.

## Prerequisites

- Elm 0.19.1
- A Z-Machine v3 or v5 story file (`.z3` / `.z5`). Infocom's early
  catalogue is the canonical source; several stories are freely
  distributed for personal use.
- A dev server of your choice (`elm reactor`, `elm-live`, Vite with
  `vite-plugin-elm`, whatever).

Familiarity with The Elm Architecture is assumed. If you know what
`Browser.element` is and why `update` returns `( Model, Cmd Msg )`,
you're ready.

## Setup

ZEngine is a standalone Elm package. Add it plus the two deps it needs
to your `elm.json` (the exact dep list mirrors ZEngine's own, since it
has to serialize story bytes as Base64):

```json
"dependencies": {
    "direct": {
        "beng/elm-zengine": "1.0.0",
        "danfishgold/base64-bytes": "1.1.0",
        "elm/browser": "1.0.2",
        "elm/bytes": "1.0.8",
        "elm/core": "1.0.5",
        "elm/file": "1.0.5",
        "elm/html": "1.0.1",
        "elm/json": "1.1.4"
    }
}
```

## The model

The engine keeps all game state inside an opaque `Session` value
("opaque" meaning the library doesn't let you poke inside it — you hand
it back to ZEngine functions as-is). Your model only needs to hold that
session plus whatever UI-local state you want:

```elm
type alias Model =
    { session : Maybe Session
    , input : String
    , error : Maybe String
    }
```

`Session` is `Maybe` because the app starts empty — no story has been
loaded. Once the user picks a file, it becomes `Just session` and stays
that way.

## The message type

Five messages for our app and one for the engine:

```elm
type Msg
    = OpenClicked
    | FileChosen File
    | BytesLoaded Bytes
    | InputChanged String
    | Submit
    | EngineMsg ZEngine.Msg
```

The first three walk a file from "user clicked open" through to
"here's the raw bytes." `InputChanged` and `Submit` run the command
box. `EngineMsg` wraps the library's own `Msg` type — the engine emits
internal timing messages that your app has to forward back to it (more
on this below).

## Loading the story

Two boring steps followed by the interesting one:

```elm
OpenClicked ->
    ( model, Select.file [] FileChosen )

FileChosen file ->
    ( model, Task.perform BytesLoaded (File.toBytes file) )

BytesLoaded bytes ->
    ZEngine.new EngineMsg ZEngine.defaultConfig bytes
        |> ZEngine.apply mergeEngine { model | error = Nothing }
```

`ZEngine.new` is how a session comes into existence. It takes a
message-tagger (`EngineMsg`), a `Config`, and the story bytes. The tagger
lets the engine wrap its internal `Msg` in *your* app's message type, so
you never have to `Cmd.map` at the call site.

For now use `ZEngine.defaultConfig` — it tells the engine to auto-handle
the two "exotic" prompts most stories will never hit (character prompts
get an auto-space reply; in-game save/restore commands get politely
declined). You can customize this later if you want to surface those
prompts to the user.

`ZEngine.new` returns a `Step` record, described next. `ZEngine.apply`
is a convenience that folds the step into your model in one pipeline
step — you'll see it defined in a moment.

## The Step shape

Every session-advancing call in ZEngine — `new`, `update`, `sendLine`,
and the more specialized `sendChar`, `sendSaveResult`, `sendRestore`,
`restoreFrom`, `resumeFrom` — returns the same thing:

```elm
type alias Step msg =
    { session : Maybe Session
    , events : List Event
    , cmd : Cmd msg
    , error : Maybe Error
    }
```

`Step` is parameterized by your app's `msg` type (the same convention
`Html msg` follows) because every entry point takes a `(ZEngine.Msg -> msg)`
tagger as its first argument and pre-maps `cmd` before handing it back.

- `session` — the new session state, if there is one. `Nothing` only
  when a load or restore failed outright.
- `events` — things the engine noticed during this step (a prompt was
  issued, the game ended, the status line changed). A minimal client
  can ignore these; a fancier one listens for `GameOver` or
  `PromptIssued` to play sounds, scroll, auto-save, etc.
- `cmd` — usually `Cmd.none`, but sometimes a command the engine needs
  your `update` to return so it can deliver its next internal message
  through your `EngineMsg` wrapper. You forward that message back into
  `ZEngine.update`. This is how the engine yields and resumes — see the
  next section.
- `error` — `Just` if something went wrong; pair with
  `ZEngine.errorMessage` for a human-readable string.

## Folding a Step into your model

ZEngine ships a helper that turns a `Step` into a `( Model, Cmd Msg )`
tuple in one line, given a merge function of your own:

```elm
mergeEngine : Maybe ZEngine.Session -> Maybe ZEngine.Error -> Model -> Model
mergeEngine session error model =
    { model
        | session = session
        , error = Maybe.map ZEngine.errorMessage error
    }
```

Then every engine call is a pipeline:

```elm
ZEngine.sendLine EngineMsg command session
    |> ZEngine.apply mergeEngine model
```

`ZEngine.apply mergeEngine model step` is equivalent to
`( mergeEngine step.session step.error model, step.cmd )`. The merge
function is the one piece of boilerplate you write per app — ZEngine
doesn't presume to know what your `Model` looks like.

## Why the engine yields

The Z-Machine is a bytecode interpreter. Some turns of execution run a
few hundred instructions; some (cutscenes, large text dumps) run tens
of thousands. If you let it run synchronously to completion you'll
block the browser's main thread.

ZEngine solves this with a step budget: it runs up to 100,000 machine
instructions at a time, then *yields* — returning a `Cmd` that will
produce a `ZEngine.Msg` on the next animation frame. Your app forwards
that message back in, and the engine resumes.

This is why you need the `EngineMsg` branch in `update`:

```elm
EngineMsg engineMsg ->
    case model.session of
        Just session ->
            ZEngine.update EngineMsg engineMsg session
                |> ZEngine.apply mergeEngine model

        Nothing ->
            ( model, Cmd.none )
```

From a client's point of view, this is bookkeeping. The engine is doing
a cooperative multitasking dance with your `update` loop; you just make
sure the messages flow.

## Sending commands

When the user hits Enter in the input box, send the text to the engine:

```elm
Submit ->
    case model.session of
        Just session ->
            if String.isEmpty (String.trim model.input) then
                ( model, Cmd.none )

            else
                ZEngine.sendLine EngineMsg model.input session
                    |> ZEngine.apply mergeEngine { model | input = "" }

        Nothing ->
            ( model, Cmd.none )
```

`sendLine` is safe to call whether the engine is currently waiting for
input or still chewing on the previous turn — if it's busy, your input
gets queued and consumed at the next prompt. You don't have to guard on
phase.

## Rendering the transcript

The session holds a `List Frame`. Each frame is either output the game
produced or a command the player entered:

```elm
viewTranscript : Model -> Html msg
viewTranscript model =
    case model.session of
        Just session ->
            pre [ style "white-space" "pre-wrap", style "line-height" "1.4" ]
                (List.map viewFrame (ZEngine.transcript session))

        Nothing ->
            p [] [ text "Load a .z3 story to begin." ]


viewFrame : Frame -> Html msg
viewFrame frame =
    case frame of
        OutputFrame data ->
            text data.text

        InputFrame data ->
            span [ style "color" "#06c" ] [ text ("\n> " ++ data.command ++ "\n") ]
```

Because the transcript lives on the session and every step returns a
new session, you never have to accumulate output yourself. Re-render
from `ZEngine.transcript session` on every `view` call and you're done.

(If you're worried about re-rendering a long transcript every keystroke
— don't. Elm's virtual DOM diffs this cheaply. A 50-turn Zork transcript
re-renders in a millisecond or two.)

## The status line

Z-Machine v3 games maintain a small status line above the main text —
typically "Location Name / Score: 10 / Turns: 3" or a time of day.
ZEngine exposes it separately from the transcript:

```elm
viewStatus : Session -> Html msg
viewStatus session =
    case ZEngine.statusLine session of
        Just status ->
            span [ style "color" "#666" ] [ text ("[" ++ status.locationName ++ "]") ]

        Nothing ->
            text ""
```

`statusLine` returns `Maybe` because the game might not have produced
one yet (the title screen, for example). `status.mode` gives you the
score/turns or time-of-day breakdown if you want to render them.

## The story title

`ZEngine.storyName session` returns whatever the engine has detected as
the game's title (parsed from the opening banner — "ZORK I: The Great
Underground Empire" and so on). It starts empty and fills in after the
first turn or two. Useful for the browser tab title or a header.

## Wiring it together

Your `Browser.element` record is boring:

```elm
main =
    Browser.element
        { init = \_ -> ( { session = Nothing, input = "", error = Nothing }, Cmd.none )
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
```

No subscriptions — the engine drives itself via Cmds.

## What we skipped

The minimal client ignores several things ZEngine offers:

- **`events`**: listening to `PromptIssued`, `GameOver`, `TurnCompleted`,
  `StatusLineChanged`, `TitleDetected`. Use `ZEngine.foldEvents` to
  thread a `(Event -> Model -> ( Model, Cmd Msg ))` handler through the
  step's event list.
- **`sendChar` / `sendSaveResult` / `sendRestore`**: the engine surfaces
  three other prompt types (single character input, in-game save, in-game
  restore). `defaultConfig` auto-handles them; a real client can surface
  them instead by customising `Config`.
- **Persistence**: `ZEngine.snapshot`, `encodeSnapshot`, `snapshotDecoder`,
  `restoreFrom` let you serialize a session to JSON, store it in
  localStorage or a file, and restore later. Skipped here — the demo is
  ephemeral.
- **`turnHistory` / `resumeFrom`**: the engine records a per-turn
  checkpoint. You can offer "rewind to an earlier turn" with
  `resumeFrom`.

None of these are required to have a working player. Start with the
skeleton above, add the pieces you need.

## Public API reference

The names you'll touch:

| Value | Type | What it does |
|-------|------|--------------|
| `Session` | opaque | A live game session. Store it in your model. |
| `Step msg` | record | The result of every session-advancing call, parameterized by your app's `msg`. |
| `Msg` | opaque | Internal engine messages. Tagger-wrap and forward. |
| `Event` | union | Side-channel notifications per step. |
| `Error` | union | `LoadError`, `RestoreError`, `RuntimeError`. |
| `Frame` | union | `OutputFrame` or `InputFrame`. |
| `Config` | record | Engine configuration (prompt policies). |
| `defaultConfig` | value | Sensible defaults. |
| `new` | (Msg → msg) → Config → Bytes → Step msg | Start a new session. |
| `update` | (Msg → msg) → Msg → Session → Step msg | Drive the engine forward. |
| `sendLine` | (Msg → msg) → String → Session → Step msg | Submit a command. |
| `apply` | (Maybe Session → Maybe Error → m → m) → m → Step msg → (m, Cmd msg) | Fold a step into your model. |
| `errorMessage` | Error → String | Extract a display string. |
| `transcript` | Session → List Frame | Everything the game has shown plus commands entered. |
| `statusLine` | Session → Maybe StatusLine | The v3 status line if present. |
| `storyName` | Session → String | Detected title, `""` until detected. |

That's enough to build the app above. The rest of the module is
optional — reach for it when the minimal client has a need.
