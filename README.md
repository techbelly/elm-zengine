# elm-zengine

A session, transcript, and snapshot layer for
[`techbelly/elm-zmachine`](https://package.elm-lang.org/packages/techbelly/elm-zmachine/latest).

elm-zmachine gives you a pure Elm Z-Machine interpreter that you step
forward instruction by instruction — the level of control a custom
interpreter needs, but rarely what an application author wants. This
library wraps the interpreter in a small TEA-style (`Model`, `Msg`,
`update`) API so a simple interactive-fiction player is a few dozen
lines of Elm.

## Quick start

One import gives you everything a client needs:

```elm
import ZEngine exposing (Session, Msg, Event(..))
```

Start a session from story-file bytes, then drive it from your `update`:

```elm
init : Bytes -> ( Model, Cmd Msg )
init storyBytes =
    let
        step =
            ZEngine.new EngineMsg ZEngine.defaultConfig storyBytes
    in
    ( { session = step.session
      , transcript = []
      , error = Maybe.map ZEngine.errorMessage step.error
      }
    , step.cmd
    )


type Msg
    = EngineMsg ZEngine.Msg
    | PlayerTyped String


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

        PlayerTyped command ->
            case model.session of
                Just session ->
                    ZEngine.sendLine EngineMsg command session
                        |> ZEngine.apply mergeEngine model

                Nothing ->
                    ( model, Cmd.none )


mergeEngine : Maybe Session -> Maybe ZEngine.Error -> Model -> Model
mergeEngine session error model =
    { model
        | session = session
        , transcript = Maybe.map ZEngine.transcript session |> Maybe.withDefault []
        , error = Maybe.map ZEngine.errorMessage error
    }
```

Each engine call returns a `Step` record (`{ session, events, cmd, error }`).
`apply` folds it into your own model via a `merge` function you supply
and returns the `( Model, Cmd Msg )` tuple your `update` needs.

## What's in the box

- **Session** — opaque handle carrying the interpreter, transcript,
  turn history, status line, and queued input.
- **Frame-structured transcript** — `OutputFrame { text, statusLine }`
  and `InputFrame { command }` instead of a raw text stream, so
  renderers can style player input and game output differently without
  parsing.
- **Event stream** — each call returns a `List Event`
  (`OutputProduced`, `PromptIssued`, `StatusLineChanged`, `TurnCompleted`,
  `TitleDetected`, `GameOver`). Fold with `foldEvents` to write a
  per-event handler once and apply it uniformly.
- **Yielding execution** — long runs yield to the runtime between step
  batches (100K instructions at a time), so the page stays responsive
  while a story settles after a restart or fast-forward.
- **Save / restore** — opaque `SessionSnapshot` values that encode
  through `encodeSnapshot` / `snapshotDecoder`. The full session
  round-trips through JSON, including the transcript and turn history.
- **Turn history** — automatic rewind points recorded when the player
  enters a new location; pass one back to `resumeFrom` to jump.
- **Configurable prompts** — by default `read_char` auto-answers with
  a space and in-game `save`/`restore` are declined. Opt into
  surfacing any of them via `Config` for richer UIs.

## Versions supported

Whatever `techbelly/elm-zmachine` supports — currently Z-Machine v3 and
partial v5.

## License

MIT
