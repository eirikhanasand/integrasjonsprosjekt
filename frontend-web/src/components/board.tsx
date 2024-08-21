'use client';
import fetchBoard from '@/utils/fetchApi';
import sendCommand from '@/utils/postApi';
import React, { useEffect, useState } from 'react';

type Cell = 0 | 1 | 2;
type GoBoard = {
    size: [number, number],
    board: Cell[][]
}
type BoardProps = {
    id: string
    spectator?: boolean
}

// Board component, handles all states related to board
export default function Board({ id, spectator }: BoardProps) {
    const [boardData, setBoardData] = useState<GoBoard | null>(null);

    useEffect(() => {
        let intervalId;
    
        async function fetchData() {
            const board = await fetchBoard(id);

            if (board) {
                setBoardData(board);
            }
        };
    
        fetchData();
    
        intervalId = setInterval(fetchData, 1000);
    
        return () => {
            clearInterval(intervalId);
        };
    }, [id]);

    if (!boardData) {
        return <div>Loading...</div>;
    }

    const { board, size } = boardData;
    const [rows, cols] = size;

    // Handles cell clicks, checks what cell is clicked, and sends the move to the server
    function handleCellClick(x: number, y: number) {
        const storedData = localStorage.getItem('boardData');
        const numToLetter = (num: number) => String.fromCharCode(65 + num);
        if (boardData && boardData.board[y][x] === 0 && storedData) {
            const data: StoredData = JSON.parse(storedData);
            const letterX = numToLetter(y);
            const letterY = numToLetter(x);
            
            sendCommand({
                command: `MOVE ${letterX} ${letterY}`, 
                player_name: data.player_name, 
                board_id: id,
                player_id: data.player_id
            });
        }
    }

    return (
        <div
            className="grid"
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridAutoRows: `minmax(0, 1fr)`,
                width: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: `${cols} / ${rows}`,
            }}
        >
            {board.map((row, i) => (
                <React.Fragment key={i}>
                    {row.map((cell, j) => (
                        <div
                            key={j}
                            className={`w-full h-full flex items-center justify-center ${
                                (i + j) % 2 === 0 ? 'bg-white' : 'bg-gray-700'
                            }`}
                            onClick={() => !spectator ? handleCellClick(j, i) : undefined}
                        >
                            {getStoneElement(cell)}
                        </div>
                    ))}
                </React.Fragment>
            ))}
        </div>
    )
}

// Returns the stone color based on the cell value
function getStoneElement(cell: Cell): JSX.Element | null {
    switch (cell) {
        case 1: return <div className="w-7 h-7 rounded-full bg-black" />;
        case 2: return <div className="w-7 h-7 rounded-full bg-white border border-black" />;
        default: return null;
    }
}