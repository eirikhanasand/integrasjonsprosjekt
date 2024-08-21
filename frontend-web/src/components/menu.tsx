'use client'
import React, { useState } from "react";
import handleRoute from "@/utils/handleRoute";

interface NameProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

const options = [
    { title: "New game", route: "/new-game" },
    { title: "Load from SGF file", route: "/load-sgf" }
];

// Right side menu, holds the valid options for the user
export default function Menu(): JSX.Element {
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [boardSize, setBoardSize] = useState({ x: 19, y: 19 });
    const [playerColor, setPlayerColor] = useState("black");
    const [sgfFile, setSgfFile] = useState<File | null>(null);

    // Handles menu clicks
    function handleClick(route: string, send?: boolean) {
        setActiveButton(route);
        setTimeout(() => setActiveButton(null), 150);
        switch (route) {
            case "/new-game":
                if (send) {
                    handleRoute(route, name, `${boardSize.x} ${boardSize.y} ${playerColor}`);
                    reset();
                } else {
                    setSelectedOption(route);
                }
                break;
            case "/load-sgf":
                if (sgfFile) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (send) {
                            handleRoute(route, name, reader.result as string);
                            reset();
                        }
                    };
                    reader.readAsText(sgfFile);
                }

                if (selectedOption !== route) {
                    setSelectedOption(route);
                }

                break;
            default:
                handleRoute(route, name, "");
                setSelectedOption(null)
        }
    }

    // Resets options to prevent immature animations and sendings
    function reset() {
        setActiveButton(null);
        setSelectedOption(null);
    }

    return (
        <div className="pt-5 rounded-xl overflow-auto">
            <div className="space-y-4 overflow-auto">
                {options.map(({ title, route }) => (
                    <div
                        key={title}
                        className="p-4 rounded-lg cursor-pointer select-none"
                        style={{
                            backgroundColor: activeButton === route ? "#3a3a3a" : "#282828",
                        }}
                        onClick={() => handleClick(route)}
                    >
                        <h2 className="text-lg font-semibold text-white">
                            {title}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
