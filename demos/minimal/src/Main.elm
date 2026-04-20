module Main exposing (main)

import Browser
import Bytes exposing (Bytes)
import File exposing (File)
import File.Select as Select
import Html exposing (Html, button, div, form, input, p, pre, span, text)
import Html.Attributes exposing (autofocus, disabled, placeholder, style, value)
import Html.Events exposing (onClick, onInput, onSubmit)
import Task
import ZEngine exposing (Frame(..), Session)


main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> ( { session = Nothing, input = "", error = Nothing }, Cmd.none )
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }


type alias Model =
    { session : Maybe Session
    , input : String
    , error : Maybe String
    }


type Msg
    = OpenClicked
    | FileChosen File
    | BytesLoaded Bytes
    | InputChanged String
    | Submit
    | EngineMsg ZEngine.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OpenClicked ->
            ( model, Select.file [] FileChosen )

        FileChosen file ->
            ( model, Task.perform BytesLoaded (File.toBytes file) )

        BytesLoaded bytes ->
            ZEngine.new EngineMsg ZEngine.defaultConfig bytes
                |> ZEngine.apply mergeEngine { model | error = Nothing }

        EngineMsg engineMsg ->
            case model.session of
                Just session ->
                    ZEngine.update EngineMsg engineMsg session
                        |> ZEngine.apply mergeEngine model

                Nothing ->
                    ( model, Cmd.none )

        InputChanged s ->
            ( { model | input = s }, Cmd.none )

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


mergeEngine : Maybe ZEngine.Session -> Maybe ZEngine.Error -> Model -> Model
mergeEngine session error model =
    { model
        | session = session
        , error = Maybe.map ZEngine.errorMessage error
    }


view : Model -> Html Msg
view model =
    div [ style "font-family" "monospace", style "max-width" "48em", style "margin" "2em auto", style "padding" "0 1em" ]
        [ viewHeader model
        , viewTranscript model
        , viewPrompt model
        ]


viewHeader : Model -> Html Msg
viewHeader model =
    div [ style "margin-bottom" "1em" ]
        [ button [ onClick OpenClicked ] [ text "Open .z3 story\u{2026}" ]
        , case model.session of
            Just session ->
                span [ style "margin-left" "1em" ]
                    [ text (ZEngine.storyName session)
                    , text "  "
                    , viewStatus session
                    ]

            Nothing ->
                text ""
        , case model.error of
            Just err ->
                p [ style "color" "crimson" ] [ text err ]

            Nothing ->
                text ""
        ]


viewStatus : Session -> Html msg
viewStatus session =
    case ZEngine.statusLine session of
        Just status ->
            span [ style "color" "#666" ] [ text ("[" ++ status.locationName ++ "]") ]

        Nothing ->
            text ""


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


viewPrompt : Model -> Html Msg
viewPrompt model =
    form [ onSubmit Submit, style "margin-top" "1em" ]
        [ span [ style "margin-right" "0.5em" ] [ text ">" ]
        , input
            [ value model.input
            , onInput InputChanged
            , disabled (model.session == Nothing)
            , autofocus True
            , placeholder "Type command\u{2026}"
            , style "width" "30em"
            , style "font-family" "monospace"
            ]
            []
        ]
