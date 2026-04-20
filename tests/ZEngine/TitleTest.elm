module ZEngine.TitleTest exposing (suite)

import Expect
import Test exposing (Test, describe, test)
import ZEngine.Title


suite : Test
suite =
    describe "ZEngine.Title"
        [ describe "fromOutput"
            [ test "prefers an all-caps line over an earlier short line" <|
                \_ ->
                    let
                        output =
                            String.join "\n"
                                [ "Copyright (c) 1985"
                                , ""
                                , "WISHBRINGER"
                                , "An Interactive Story"
                                ]
                    in
                    ZEngine.Title.fromOutput output
                        |> Expect.equal (Just "WISHBRINGER")
            , test "falls back to first short line when no all-caps line exists" <|
                \_ ->
                    let
                        output =
                            String.join "\n"
                                [ ""
                                , "A brief introduction"
                                , "More text on the next line"
                                ]
                    in
                    ZEngine.Title.fromOutput output
                        |> Expect.equal (Just "A brief introduction")
            , test "ignores lines shorter than 3 characters" <|
                \_ ->
                    let
                        output =
                            String.join "\n"
                                [ "A"
                                , ""
                                , "Z"
                                , "West of House"
                                ]
                    in
                    ZEngine.Title.fromOutput output
                        |> Expect.equal (Just "West of House")
            , test "ignores lines 80 chars or longer" <|
                \_ ->
                    let
                        long =
                            String.repeat 90 "x"

                        output =
                            long ++ "\nShort line"
                    in
                    ZEngine.Title.fromOutput output
                        |> Expect.equal (Just "Short line")
            , test "requires at least 3 letters for all-caps detection" <|
                \_ ->
                    let
                        output =
                            String.join "\n"
                                [ "A B"
                                , "TITLE"
                                ]
                    in
                    ZEngine.Title.fromOutput output
                        |> Expect.equal (Just "TITLE")
            , test "returns Nothing when there are no usable lines" <|
                \_ ->
                    ZEngine.Title.fromOutput "\n\n"
                        |> Expect.equal Nothing
            ]
        ]
