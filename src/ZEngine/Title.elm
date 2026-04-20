module ZEngine.Title exposing (fromOutput)


fromOutput : String -> Maybe String
fromOutput output =
    let
        candidates : List String
        candidates =
            output
                |> String.lines
                |> List.map String.trim
                |> List.filter
                    (\line ->
                        String.length line > 2 && String.length line < 80
                    )
    in
    case List.filter isAllCapsTitle candidates of
        firstAllCaps :: _ ->
            Just firstAllCaps

        [] ->
            List.head candidates


isAllCapsTitle : String -> Bool
isAllCapsTitle line =
    let
        letters : String
        letters =
            String.filter Char.isAlpha line
    in
    String.length letters >= 3
        && letters
        == String.toUpper letters
