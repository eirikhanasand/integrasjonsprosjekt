import { API } from '@/constants'

export async function getLeaderboard() {
    try {
        const promise = await fetch(`${API}/leaderboard`, )
    
        if (!promise.ok) {
            throw new Error(`Failed to fetch leaderboard: ${promise}`)
        }
    } catch (error) {
        
    }
}

export async function getWeeklyLeaderboard() {
    try {
        const promise = await fetch(`${API}/weeklyleaderboard`, )
    
        if (!promise.ok) {
            throw new Error(`Failed to fetch weekly leaderboard: ${promise}`)
        }
    } catch (error) {
        
    }
}
