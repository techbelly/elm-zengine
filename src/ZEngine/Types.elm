module ZEngine.Types exposing
    ( Frame(..)
    , InputFrameData
    , MoveInfo(..)
    , OutputFrameData
    , PendingOutput
    , TurnRecord
    , emptyPendingOutput
    )

import Bytes exposing (Bytes)
import ZMachine.Types exposing (StatusLine)


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


type MoveInfo
    = AtTurn Int
    | AtTime Int Int


type alias TurnRecord =
    { index : Int
    , snapshotBytes : Bytes
    , locationId : Int
    , locationName : String
    , moveInfo : MoveInfo
    , transcriptLength : Int
    }


type alias PendingOutput =
    OutputFrameData


emptyPendingOutput : PendingOutput
emptyPendingOutput =
    { text = "", statusLine = Nothing }
