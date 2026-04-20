module ZEngine.Output exposing
    ( captureTurnRecord
    , moveInfoFromMode
    , processEvents
    , shouldCaptureLocation
    , statusLineFromTurnRecord
    )

import ZEngine.Snapshot
import ZEngine.Types exposing (Frame, MoveInfo(..), PendingOutput, TurnRecord)
import ZMachine
import ZMachine.Types exposing (OutputEvent(..), StatusLine, StatusLineMode(..))


processEvents : List OutputEvent -> PendingOutput -> PendingOutput
processEvents events pending =
    List.foldl processEvent pending events


processEvent : OutputEvent -> PendingOutput -> PendingOutput
processEvent event pending =
    case event of
        PrintText s ->
            { pending | text = pending.text ++ s }

        PrintObject s ->
            { pending | text = pending.text ++ s }

        ShowStatusLine status ->
            { pending | statusLine = Just status }

        _ ->
            pending


captureTurnRecord : ZMachine.ZMachine -> Maybe ZMachine.StatusLine -> List Frame -> List TurnRecord -> Maybe TurnRecord
captureTurnRecord machine statusLine transcript existingHistory =
    statusLine
        |> Maybe.andThen
            (\sl ->
                if shouldCaptureLocation sl.locationId existingHistory then
                    Just
                        { index = List.length existingHistory
                        , snapshotBytes = ZEngine.Snapshot.encode machine
                        , locationId = sl.locationId
                        , locationName = sl.locationName
                        , moveInfo = moveInfoFromMode sl.mode
                        , transcriptLength = List.length transcript
                        }

                else
                    Nothing
            )


shouldCaptureLocation : Int -> List TurnRecord -> Bool
shouldCaptureLocation locationId existingHistory =
    case lastOf existingHistory of
        Nothing ->
            True

        Just prev ->
            prev.locationId /= locationId


lastOf : List a -> Maybe a
lastOf list =
    case list of
        [] ->
            Nothing

        [ x ] ->
            Just x

        _ :: rest ->
            lastOf rest


moveInfoFromMode : StatusLineMode -> MoveInfo
moveInfoFromMode mode =
    case mode of
        ScoreAndTurns _ turns ->
            AtTurn turns

        TimeOfDay h m ->
            AtTime h m

        ScreenRows _ ->
            AtTurn 0


statusLineFromTurnRecord : TurnRecord -> StatusLine
statusLineFromTurnRecord record =
    { locationId = record.locationId
    , locationName = record.locationName
    , mode =
        case record.moveInfo of
            AtTurn n ->
                ScoreAndTurns 0 n

            AtTime h m ->
                TimeOfDay h m
    }
