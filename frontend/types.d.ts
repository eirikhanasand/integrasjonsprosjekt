// Configured in this file to be globally accessable.
declare module '*.svg' {
    const content: string
    export default content
}

type ReduxState = {
    theme: {
        value: number
        theme: Theme
    }
    lang: {
        lang: boolean
    }
    user: {
        authenticated: boolean
        username: string
        userID: string
        highscore: number
    },
    game: {
        coins: number
        startTime: number
        inGame: boolean
        alive: boolean
        score: number
        highscore: number
        multiplier: number
    }
}

type Setting = {
    screen: string
    nav: string
    setting: 
        {
            id: number
            nav: MenuRoutes
            title: string
        }[]
}

type User = {
    username: string
    score: number
}

type Theme = {
    background: string
    darker: string
    contrast: string
    transparent: string
    transparentAndroid: string
    orange: string
    discord: string
    textColor: string
    titleTextColor: string
    oppositeTextColor: string
    switchOnState: string
    switchOffState: string
    trackColor: string
    trackBackgroundColor: string
    dark: string
}

type Direction = VerticalDirection | HorizontalDirection
type VerticalDirection = 'up' | 'down' | 'normal'
type HorizontalDirection = 'left' | 'right' | 'middle'
