'use client'
import React, { useEffect, useState } from 'react';
import en from '../../text/en.json';
import RecentGames from '@/components/recent';
import fetchNotifications from '@/utils/fetchNotifications';
import { fetchCompleteBoard } from '@/utils/fetchApi';
import Board from '@/components/board';
import Menu from '@/components/menu';

// Handles games in progress
export default function Game({ params }: { params: { id: string } }): JSX.Element {
    const [notification, setNotification] = useState<string | null>(null);
    const [id, setID] = useState<string | null>(null);
    const [isFirstPlayer, setIsFirstPlayer] = useState<boolean | null>(null);
    const storedData = localStorage.getItem('boardData');

    // Checks if the current player has an ID
    if (!id && storedData) {
        let stored = JSON.parse(storedData)
        setID(stored.player_id)
    }

    // Useeffect to periodically fetch data
    useEffect(() => {
        let intervalId;

        // Fetches data from API
        async function fetchData() {
            // Only fetches the id if it is not already set
            if (isFirstPlayer === null) {
                const response = await fetchCompleteBoard(params.id[0]);
                if (response) {
                    setIsFirstPlayer(response.player_one_id === id);
                }
            }

            // Fetches the current notifications to let the players know the status of the game
            const response = await fetchNotifications(params.id[0]);

            if (response) {
                setNotification(isFirstPlayer ? response.player_1 : response.player_2);
            }
        };
    
        fetchData();
    
        // Fetches every second
        intervalId = setInterval(fetchData, 1000);
    
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <main className="grid place-items-center h-[100vh] w-full">
            <div className="flex mx-8 justify-center w-full">
                <div className="bg-[#191919] h-[92vh] overflow-auto mx-4 p-10 w-1/4 rounded-xl">
                    <div className="sticky top-0 bg-[#191919] pb-5">
                        <h1 className="text-4xl font-bold">{en.left.title}</h1>
                    </div>
                    <div className="overflow-auto h-[80vh]">
                        <RecentGames />
                    </div>
                </div>
                <div className="bg-[#191919] ml-4 mr-4 pl-10 pr-10 pb-10 pt-5 h-[92vh] w-1/2 overflow-auto rounded-xl grid place-items-center">
                    {!notification && <h1 className="text-4xl font-bold">{en.mid.title}</h1>}
                    {notification && <h1 className="text-xl font-bold">{notification}</h1>}
                    <Board id={params.id[0]} />
                </div>
                <div className="bg-[#191919] mx-4 p-10 h-[92vh] w-1/4 overflow-auto rounded-xl">
                    <h1 className="text-4xl font-bold">{en.right.title}</h1>
                    <Menu />
                </div>
            </div>
        </main>
    );
}