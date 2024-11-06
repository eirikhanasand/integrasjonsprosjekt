const songs: Song[] = [
    {
        uri: require('@assets/music/ambient.mp3'),
        nextSongs: [
            '@assets/music/box.mp3', 
            '@assets/music/bubbles.mp3',
            '@assets/music/happy.mp3',
            '@assets/music/cottage.mp3',
        ]
    },
    {
        uri: require('./assets/music/box.mp3'),
        nextSongs: [
            '@assets/music/bubbles.mp3', 
            '@assets/music/ambient.mp3',
            '@assets/music/nature.mp3'
        ]
    },
    {
        uri: require('./assets/music/bubbles.mp3'),
        nextSongs: [
            '@assets/music/nature.mp3', 
            '@assets/music/cottage.mp3'
        ]
    },
    {
        uri: require('./assets/music/cottage.mp3'),
        nextSongs: [
            '@assets/music/nature.mp3', 
            '@assets/music/ambient.mp3',
            '@assets/music/box.mp3'
        ]
    },
    {
        uri: require('./assets/music/drone.mp3'),
        nextSongs: [
            '@assets/music/ambient.mp3',
            '@assets/music/box.mp3',
            '@assets/music/shark.mp3'
        ]
    },
    {
        uri: require('./assets/music/happy.mp3'),
        nextSongs: [
            '@assets/music/nature.mp3',
            '@assets/music/ambient.mp3',
            '@assets/music/bubbles.mp3',
            '@assets/music/cottage.mp3',
            '@assets/music/mysterious.mp3',
        ]
    },
    {
        uri: require('./assets/music/mysterious.mp3'),
        nextSongs: [
            '@assets/music/ambient.mp3',
            '@assets/music/bubbles.mp3',
            '@assets/music/cottage.mp3',
        ]
    },
    {
        uri: require('./assets/music/nature.mp3'),
        nextSongs: [
            '@assets/music/ambient.mp3',
            '@assets/music/box.mp3',
            '@assets/music/bubbles.mp3',
            '@assets/music/mysterious.mp3',
        ]
    },
    {
        uri: require('./assets/music/shark.mp3'),
        nextSongs: [
            '@assets/music/story.mp3', 
            '@assets/music/drone.mp3'
        ]
    },
    {
        uri: require('./assets/music/story.mp3'),
        nextSongs: [
            '@assets/music/nature.mp3', 
            '@assets/music/ambient.mp3',
            '@assets/music/bubbles.mp3',
        ]
    },
    {
        uri: require('./assets/music/upbeat.mp3'),
        nextSongs: [
            '@assets/music/ambient.mp3',
            '@assets/music/nature.mp3',
            '@assets/music/mysterious.mp3',
        ]
    },
]

export default songs
