import React, { PureComponent, useState, useEffect } from "react";
import { GameEngine } from "react-native-game-engine";
import Player from "./player";
import { Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import T from "@styles/text";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "@/interfaces";

type GameProps = {
    paused: boolean; // Updated type definition to include paused state
};

type PauseButtonProps = {
    score: number;
    onPause: () => void;
    onResume: () => void;
};

export default function Gameplay() {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme);

    // Game states
    const [score, setScore] = useState(0);
    const [multiplier, setMultiplier] = useState(31);
    const [paused, setPaused] = useState(false); // New state to handle pause

    // Helper functions
    function updateScore() {
        setScore((prev) => prev + 1 * multiplier);
    }

    // Effect to handle score updates based on the paused state
    useEffect(() => {
        if (!paused) {
            const interval = setInterval(() => {
                console.log("Score Updated"); // Debug log
                updateScore();
            }, 1000); // Update every 1 second

            return () => {
                console.log("Clearing Interval"); // Debug log
                clearInterval(interval); // Cleanup on unmount or pause change
            };
        }
    }, [paused, multiplier]);

    // Pause and resume functions
    const handlePause = () => {
        console.log("Game Paused"); // Debug log
        setPaused(true);
    };
    
    const handleResume = () => {
        console.log("Game Resumed"); // Debug log
        setPaused(false);
    };

    return (
        <>
            <PauseButton score={score} onPause={handlePause} onResume={handleResume} />
            <Text style={{
                ...T.text20,
                position: 'absolute',
                color: theme.textColor,
                top: 65,
                zIndex: 10,
                right: 10,
                fontWeight: '800'
            }}>
                {score}
            </Text>
            <Game paused={paused} />
        </>
    );
}

class Game extends PureComponent<GameProps> {
    constructor(props: GameProps) {
        super(props);
    }

    render() {
        return (
            <GameEngine
                style={{}}
                systems={[]}
                entities={{
                    1: { position: [], renderer: <Player /> },
                }}
                running={!this.props.paused} // Use running prop to control game engine
            />
        );
    }
}

function PauseButton({ score, onPause, onResume }: PauseButtonProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme);
    const navigation: Navigation = useNavigation();

    const handlePress = () => {
        onPause(); // Trigger pause state
        navigation.navigate("PauseScreen", {
            score,
            onResume,
        });
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={{
                position: 'absolute',
                top: 65,
                zIndex: 10,
                left: 10,
            }}
        >
            <Text style={{
                ...T.text20,
                color: theme.textColor,
                fontWeight: '800'
            }}>
                Pause
            </Text>
        </TouchableOpacity>
    );
}
