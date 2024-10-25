import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {setGameId, setMultiplayer} from "@redux/game";
import {API} from "@/constants";

export default function PlayerMode({ mode, setMode }) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const modeText = mode === 'singleplayer' ? 'Single Player' : 'Multiplayer'
    const dispatch = useDispatch()
    const userId = useSelector((state: ReduxState) => state.user.userID)

    function handlePress() {
        const newMode = mode === 'singleplayer' ? 'multiplayer' : 'singleplayer';
        setMode(newMode);
        const multiplayer = newMode === 'multiplayer';

        dispatch(setMultiplayer(multiplayer))

        if (multiplayer) {
            console.log("CREATING LE LOBBY BABY")
            handleLobbyCreation()
        }

    }

    async function handleLobbyCreation() {
        const gameId = await createLobby(userId)
        dispatch(setGameId(gameId))
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
            <TouchableOpacity onPress={handlePress} activeOpacity={1} style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.contrast, 
                width: 140, 
                height: 40,
                borderRadius: 8,
            }}>
                <Text style={{color: theme.textColor}}>
                    {modeText}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

async function createLobby(userId: string): Promise<string> {
    const params = new URLSearchParams({
        userId: userId
    }).toString();
    try {
        const response = await fetch(`${API}/game/create?${params}`, {
            method: 'POST',
        });
        if (!response.ok) {
            console.error('Failed to send score:', response.status);
        } else {
            console.log('Score sent successfully');
        }
    } catch (error) {
        console.error('Error sending score:', error);
    }
}
