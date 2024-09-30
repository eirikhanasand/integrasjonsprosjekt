const songs: Song[] = [
    {
        uri: require('./assets/music/song1.mp4'),
        nextSongs: ['./assets/music/song2.mp4', './assets/music/song3.mp4']
    },
    {
        uri: require('./assets/song2.mp4'),
        nextSongs: ['./assets/song1.mp4', './assets/music/song3.mp4']
    },
    {
        uri: require('./assets/music/song3.mp4'),
        nextSongs: ['./assets/music/song1.mp4', './assets/music/song2.mp4']
    }
]

export default songs
