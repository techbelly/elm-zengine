module ZEngine.Internal exposing
    ( InternalPrompt(..)
    , Phase(..)
    )

{-| Internal library labels shared between `ZEngine` and internal step-loop
helpers. Not exposed to consumers. The main `InternalState` record lives in
`ZEngine.elm` alongside the public `Session` wrapper so it can reference
public-surface policy types without circular imports.
-}

import Bytes exposing (Bytes)
import ZMachine.Types exposing (LineInputInfo)


type InternalPrompt
    = LineActive LineInputInfo
    | CharActive
    | SaveActive Bytes
    | RestoreActive


type Phase
    = Loading
    | Running
    | Waiting
    | Halted
    | Errored String
