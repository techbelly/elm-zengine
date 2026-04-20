module ZEngine.Internal exposing
    ( InternalState
    , Phase(..)
    )

{-| Internal library state. Leaf module: imported by `ZEngine` (the public
surface) and by internal step-loop helpers. Not exposed to consumers.
-}

import Bytes exposing (Bytes)
import ZEngine.Types exposing (Frame, PendingOutput, TurnRecord)
import ZMachine exposing (StatusLine, ZMachine)
import ZMachine.Types exposing (LineInputInfo)


type alias InternalState =
    { machine : ZMachine
    , storyBytes : Bytes
    , inputRequest : Maybe LineInputInfo
    , transcript : List Frame
    , pendingOutput : PendingOutput
    , currentStatusLine : Maybe StatusLine
    , turnHistory : List TurnRecord
    , restoringSession : Bool
    , phase : Phase
    , storyName : String
    , titleEmitted : Bool
    }


type Phase
    = Loading
    | Running
    | Waiting
    | Halted
    | Errored String
