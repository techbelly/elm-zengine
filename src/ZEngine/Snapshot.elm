module ZEngine.Snapshot exposing (encode, restore)

import Bytes exposing (Bytes)
import ZMachine
import ZMachine.Snapshot


encode : ZMachine.ZMachine -> Bytes
encode machine =
    ZMachine.Snapshot.encode machine.originalMemory (ZMachine.snapshot machine)


restore : Bytes -> ZMachine.ZMachine -> Result String ZMachine.ZMachine
restore bytes machine =
    ZMachine.Snapshot.decode machine.originalMemory bytes
        |> Result.mapError (\err -> "Failed to decode snapshot: " ++ err)
        |> Result.andThen
            (\snap ->
                ZMachine.restoreSnapshot snap machine
                    |> Result.mapError (\_ -> "Failed to restore snapshot")
            )
