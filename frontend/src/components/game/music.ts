import { useEffect, useState } from "react"
import { Audio, AVPlaybackStatus } from "expo-av"
import songs from "./songs"

export default function Music() {
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    const [currentSong, setCurrentSong] = useState<Song | null>(null)

    // Loads and plays a song
    async function playSong(song: Song) {
        console.log("Playing song:", song.uri)
        const { sound } = await Audio.Sound.createAsync(song)
        setSound(sound)
        setCurrentSong(song)

        // Play the sound and set it to loop automatically
        await sound.playAsync()

        // Set up listener to know when the song finishes
        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
            if ('didJustFinish' in status && status.didJustFinish) {
                handleSongEnd()
            }
        })
    }

    useEffect(() => {
        // Cleanup the sound when component unmounts
        return () => {
            if (sound) {
                sound.unloadAsync()
            }
        }
    }, [sound])

    // Handles the end of the current song and picks the next song randomly
    function handleSongEnd() {
        if (currentSong) {
            const nextSongUri = getRandomNextSong(currentSong.nextSongs)
            const nextSong = songs.find((s) => s.uri === nextSongUri)
            if (nextSong) {
                playNextSong(nextSong)
            }
        }
    }

    // Plays the next song
    async function playNextSong(song: Song) {
        if (sound) {
            // Unloads the current sound before playing the next one
            await sound.unloadAsync()
        }

        await playSong(song)
    }

    // Get a random song from the list of "next songs"
    function getRandomNextSong(nextSongs: string[]) {
        const randomIndex = Math.floor(Math.random() * nextSongs.length)
        return nextSongs[randomIndex]
    }

    // Start playing the first song when the component mounts
    useEffect(() => {
        if (songs.length > 0) {
            playSong(songs[0])
        }
    }, [])

    return null
}
