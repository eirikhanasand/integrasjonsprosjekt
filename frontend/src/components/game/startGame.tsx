import { setAlive, setInGame, setStartTime } from "@redux/game"
import T from "@styles/text"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import PlayerMode from "./mainScreen/playerMode"
import Coins from "./mainScreen/coins"
import PlayerList from "./mainScreen/playerList"
import Scoreboard from "./mainScreen/leaderboard"
import { useState } from 'react';
import { ScrollView } from "react-native"
import Players from "./mainScreen/players"

export default function StartGame() {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { inGame } = useSelector((state: ReduxState) => state.game)
    const [players, setPlayers] = useState([lang ? "Spiller 1" : 'Player 1'])
    const height = Dimensions.get('window').height
    const width = Dimensions.get('window').width
    const dispatch = useDispatch()

    // Helper functions
    // Hides start game text while playing
    if (inGame) {
        return null
    }

    // Game states
    const text = lang ? "Trykk for å starte" : "Tap to Play"

    // Helper functions
    // Hides start game text while playing
    if (inGame) {
        return null
    }

    function handleStart() {
        dispatch(setStartTime(Date.now()))
        dispatch(setInGame(true))
        dispatch(setAlive(true))
    }

    return (
        <View>
            <PlayerMode />
            <Coins />
            <PlayerList players={players} setPlayers={setPlayers} />
            <Scoreboard />
            <Players players={players} />
            <TouchableOpacity
                onPress={handleStart}
                style={{
                   
                    top: height * 0.6,
                    width: width * 0.8,
                    alignSelf: 'center',
                    height: 200,
                }}
            >
                <Text style={{
                    ...T.text30,
                    color: theme.textColor,
                    fontWeight: '600',
                    alignSelf: 'center',
                    marginVertical: 'auto'
                }}>
                    {text}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
