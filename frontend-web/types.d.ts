type Cell = 0 | 1 | 2;
type GoBoard = {
    size: [number, number],
    board: Cell[][]
}

type StoredData = {
    player_id: string
    player_name: string
    board: string
}

type ScoreBoard = {
    players: string[]
    score: [number, number];
    finished: boolean;
    winner: string | null;
};
