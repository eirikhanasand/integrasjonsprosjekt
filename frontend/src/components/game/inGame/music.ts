import { useEffect, useRef, useState } from "react"
import { Audio, AVPlaybackStatus } from "expo-av"
import songs from "./songs"

export default function Music() {
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    const currentSong = useRef(0)

    // Loads and plays a song
    async function playSong(song: Song) {
        const uri: number | string = 
            typeof song.uri === 'object' && 'default' in song.uri 
                ? song.uri.default as string 
                : song.uri as unknown as number
        const { sound } = await Audio.Sound.createAsync(Number(uri as string) || { uri: uri as string })
        setSound(sound)
        sound.playAsync()

        // Listener to handle finished song
        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
            if ('didJustFinish' in status && status.didJustFinish) {
                handleSongEnd()
            }
        })
    }

    // Finds the next song
    function handleSongEnd() {
        if (currentSong) {
            const nextSong = getRandomNextSong(songs[currentSong.current].nextSongs)

            if (nextSong) {
                playNextSong(nextSong)
            }
        }
    }

    // Plays the next song
    async function playNextSong(song: number) {
        if (sound) {
            await sound.unloadAsync()
        }

        await playSong(songs[song])
        currentSong.current = song
    }

    // Gets a random song from the provided list
    function getRandomNextSong(nextSongs: number[]) {
        const randomIndex = Math.floor(Math.random() * nextSongs.length)
        return nextSongs[randomIndex]
    }

    // Starts playing when the component mounts
    useEffect(() => {
        if (songs.length > 0) {
            playSong(songs[0])
        }
    }, [])

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync()
            }
        }
    }, [sound])
}
