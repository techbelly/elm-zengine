module OutputEventsTest exposing (suite)

import Bytes.Encode
import Expect
import Test exposing (Test, describe, test)
import ZEngine.Output as OutputEvents
import ZEngine.Types exposing (MoveInfo(..), TurnRecord)
import ZMachine.Types exposing (StatusLineMode(..))


stubRecord : Int -> TurnRecord
stubRecord locationId =
    { index = 0
    , snapshotBytes = Bytes.Encode.encode (Bytes.Encode.sequence [])
    , locationId = locationId
    , locationName = "Somewhere"
    , moveInfo = AtTurn 0
    , transcriptLength = 0
    }


suite : Test
suite =
    describe "OutputEvents"
        [ describe "shouldCaptureLocation"
            [ test "captures the first turn when history is empty" <|
                \_ ->
                    OutputEvents.shouldCaptureLocation 42 []
                        |> Expect.equal True
            , test "does not capture when the location matches the most recent record" <|
                \_ ->
                    OutputEvents.shouldCaptureLocation 42 [ stubRecord 42 ]
                        |> Expect.equal False
            , test "captures when the location differs from the most recent record" <|
                \_ ->
                    OutputEvents.shouldCaptureLocation 7 [ stubRecord 42 ]
                        |> Expect.equal True
            , test "compares only against the most recent record, not earlier ones" <|
                \_ ->
                    OutputEvents.shouldCaptureLocation 42 [ stubRecord 42, stubRecord 7 ]
                        |> Expect.equal True
            ]
        , describe "moveInfoFromMode"
            [ test "ScoreAndTurns carries the turn count through" <|
                \_ ->
                    OutputEvents.moveInfoFromMode (ScoreAndTurns 100 5)
                        |> Expect.equal (AtTurn 5)
            , test "TimeOfDay carries hours and minutes" <|
                \_ ->
                    OutputEvents.moveInfoFromMode (TimeOfDay 14 30)
                        |> Expect.equal (AtTime 14 30)
            , test "ScreenRows falls back to AtTurn 0" <|
                \_ ->
                    OutputEvents.moveInfoFromMode (ScreenRows [])
                        |> Expect.equal (AtTurn 0)
            ]
        ]
