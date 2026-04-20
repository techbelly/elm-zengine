module ZEngine.ConfigTest exposing (suite)

import Expect
import Test exposing (Test, describe, test)
import ZEngine


suite : Test
suite =
    describe "ZEngine.defaultConfig"
        [ test "auto-sends space for char prompts" <|
            \_ ->
                ZEngine.defaultConfig.onCharPrompt
                    |> Expect.equal (ZEngine.AutoChar ' ')
        , test "declines in-game saves" <|
            \_ ->
                ZEngine.defaultConfig.onSavePrompt
                    |> Expect.equal ZEngine.DeclineSave
        , test "declines in-game restores" <|
            \_ ->
                ZEngine.defaultConfig.onRestorePrompt
                    |> Expect.equal ZEngine.DeclineRestore
        ]
