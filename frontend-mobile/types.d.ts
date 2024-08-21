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
    event: {
        events: EventProps[]
        event: DetailedEventResponse
        history: number[]
        clickedEvents: EventProps[]
        renderedEvents: EventProps[]
        lastFetch: string
        search: boolean
        categories: {
            no: string[]
            en: string[]
        }
        clickedCategories: string[]
        input: string
        downloadState: Date
        tag: {
            title: string
            body: string
        }
    }
    ad: {
        ads: AdProps[]
        ad: DetailedAdResponse
        history: number[]
        clickedAds: AdProps[]
        renderedAds: AdProps[]
        lastFetch: string
        search: boolean
        skills: string[]
        clickedSkills: string[]
        input: string
        downloadState: Date
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