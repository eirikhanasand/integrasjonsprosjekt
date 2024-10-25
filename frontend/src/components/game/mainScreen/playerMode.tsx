import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import {useDispatch, useSelector} from "react-redux"
import {setGameId, setMultiplayer} from "@redux/game"
import { API } from "@/constants"

export default function PlayerMode({ mode, setMode }) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const modeText = mode === 'singleplayer' ? 'Single Player' : 'Multiplayer'
    const dispatch = useDispatch()
    const userId = useSelector((state: ReduxState) => state.user.userID)

    function handlePress() {
        const newMode = mode === 'singleplayer' ? 'multiplayer' : 'singleplayer'
        setMode(newMode)
        const multiplayer = newMode === 'multiplayer'
        dispatch(setMultiplayer(multiplayer))

        if (multiplayer) {
            console.log("CREATING LE LOBBY BABY")
            handleLobbyCreation()
        }

    }

    async function handleLobbyCreation() {
        console.log("created lobby")
        const gameId = await createLobby(userId)

        if (gameId) {
            dispatch(setGameId(gameId))
            console.log("gameID is now", gameId)
        }
    }


    return (
        <View style={{ 
            width: 140, 
            height: 40, 
            top: 50, 
            left: 20, 
            position: 'absolute',
            borderRadius: 20,
        }}>
            <TouchableOpacity 
                onPress={handlePress} 
                activeOpacity={1} 
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.contrast, 
                    width: 140, 
                    height: 40,
                    borderRadius: 8,
                }}
            >
                <Text style={{color: theme.textColor}}>
                    {modeText}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

async function createLobby(id: string): Promise<string> {
    const params = new URLSearchParams({
        userId: id
    }).toString()

    console.log("CREATING LOBBY", "user: " + id)

    console.log(params)

    try {
        const response = await fetch(`${API}/game/create?${params}`, {
            method: 'POST',
        })

        if (!response.ok) {
            console.error('Failed to send score:', response.status)
        } 
        
        const lobby = await response.json()
        console.log("LOBBY", lobby)
        return lobby
    } catch (error) {
        console.error('Error sending score:', error)
    }
}
