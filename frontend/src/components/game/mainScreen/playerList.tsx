import { Dimensions, Text, TouchableOpacity, View, TextInput } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import {useDispatch, useSelector} from "react-redux"
import { useState } from "react"
import {API} from "@/constants";
import {setGameId} from "@redux/game";

export default function PlayerList({ players, setPlayers }: { players: any[], setPlayers: (_: any) => void }) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const height = Dimensions.get('window').height
    const [newGame, setNewGame] = useState("")  // State for entering game ID
    const gameId = useSelector((state: ReduxState) => state.game.gameId)
    const userId = useSelector((state: ReduxState) => state.user.userID)
    const dispatch = useDispatch()

    function handleInvitePress() {
        // Copies the game ID to clipboard and logs action
        console.log("Clicked invite button (unimplemented)")
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(gameId)
        }
    }

    async function handleJoinGame() {
        if (newGame.trim()) {
            console.log("Joining game with ID:", newGame)
            let joined = await JoinGame(userId, newGame)
            if (joined) {
                dispatch(setGameId(newGame))
            } else {
                // popup for failed
            }
        }
    }

    return (
        <View style={{
            width: 140,
            height: 300,  // Adjusted height to fit all elements
            top: height * 0.2,
            backgroundColor: 'red',
            left: 20,
            borderRadius: 20,
            paddingBottom: 10, // Extra padding at bottom to avoid cutoff
        }}>
            <ScrollView style={{
                backgroundColor: 'yellow',
                marginBottom: 20, // Margin to prevent overlapping with buttons
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 10
            }}>
                {players.map((player, index) => (
                    <Text key={index} style={{ fontWeight: 'bold' }}>{player}</Text>
                ))}
            </ScrollView>

            {/* Invite Button */}
            <TouchableOpacity onPress={handleInvitePress} activeOpacity={0.8} style={{
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: theme.contrast,
                width: 120,
                height: 30,
                borderRadius: 8,
            }}>
                <Text style={{ color: theme.textColor, textAlign: 'center', fontWeight: 'bold' }}>
                    Invite
                </Text>
            </TouchableOpacity>
            <TextInput
                value={newGame}
                onChangeText={setNewGame}
                placeholder="Enter game ID"
                placeholderTextColor={theme.textColor}
                style={{
                    backgroundColor: theme.background,
                    borderColor: theme.contrast,
                    borderWidth: 1,
                    borderRadius: 8,
                    width: 120,
                    height: 30,
                    paddingHorizontal: 8,
                    alignSelf: 'center',
                    marginVertical: 5,
                    color: theme.textColor,
                }}
            />

            {/* Join Game Button */}
            <TouchableOpacity onPress={handleJoinGame} activeOpacity={0.8} style={{
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: theme.contrast,
                width: 120,
                height: 30,
                borderRadius: 8,
                marginBottom: 10, // Margin to separate from the "Invite" button
            }}>
                <Text style={{ color: theme.textColor, textAlign: 'center', fontWeight: 'bold' }}>
                    Join Game
                </Text>
            </TouchableOpacity>
        </View>
    )
}

async function JoinGame(userId: string, gameId: string) {
    try {
        const response = await fetch(`${API}/game/join/${gameId}/${userId}`, {
            method: "HEAD",
        })
        if (!response.ok) {
            console.error("Failed to join lobby: ", response.status, response.statusText)
        } else {
            console.log("Joined lobby")
            return true
        }
    } catch (error) {
        console.error("Error sending death:", error)
    }
    return false
}