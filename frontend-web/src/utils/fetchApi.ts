// Fetches SGF sequence from API and parses it to a GoBoard object (JS Array)
export default async function fetchBoard(id: string): Promise<GoBoard | null> {
    try {
        const response = await fetch(`http://127.0.0.1:8080/board/${id}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return parseSgf(data.response);
    } catch (error) {
        console.error('Failed to fetch game board:', error);
        return null;
    }
}

// Fetches the complete board data from the API
export async function fetchCompleteBoard(id: string): Promise<BoardResponse | null> {
    try {
        const response = await fetch(`http://127.0.0.1:8080/board/${id}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data
    } catch (error) {
        console.error('Failed to fetch game board:', error);
        return null;
    }
}

// Fetches all boards from API and returns them as ScoreBoard objects for the recent games tab
export async function processBoards(): Promise<ScoreBoard[]> {
    const boards = await fetchAllBoards();
    if (!boards) {
        return [];
    }

    const uniqueBoards = new Set([...games, ...boards].map(board => JSON.stringify({
        players: [board.player_one_name, board.player_two_name],
        score: board.score,
        finished: board.finished,
        winner: board.finished
            ? board.score[0] > board.score[1]
                ? board.player_one_name
                : board.player_two_name
            : null,
    })));

    const processedBoards = Array.from(uniqueBoards).map(boardStr =>
        JSON.parse(boardStr) as ScoreBoard
    );

    return processedBoards.reverse();
}

// Fetches all boards from API
async function fetchAllBoards(): Promise<BoardResponse[]> {
    let id = 0;
    const boards: BoardResponse[] = [];

    while (true) {
        const board = await fetchCompleteBoard(id.toString());
        if (board) {
            boards.push(board);
            id++;
        } else {
            break;
        }
    }

    return boards;
}

// Parses SGF content to a GoBoard object
function parseSgf(sgfContent: string): GoBoard {
    const sizeRegex = /SZ\[(\d+)(?:,(\d+))?\]/;
    const moveRegex = /(B|W)\[([a-z]{2})\]/g;

    // Parsing board size
    const sizeMatch = sgfContent.match(sizeRegex);
    const sx = sizeMatch ? parseInt(sizeMatch[1], 10) : 19;
    const sy = sizeMatch && sizeMatch[2] ? parseInt(sizeMatch[2], 10) : sx;
    const boardSize: [number, number] = [sx, sy];
    const board: Cell[][] = Array.from({ length: sx }, () => Array(sy).fill(0));

    // Parsing moves
    let match: RegExpExecArray | null;
    while ((match = moveRegex.exec(sgfContent)) !== null) {
        const color = match[1] === 'B' ? 1 : 2;
        const moveCoords = match[2];
        const x = moveCoords.charCodeAt(0) - 97;
        const y = moveCoords.charCodeAt(1) - 97;
        board[x][y] = color;
    }

    return {
        size: boardSize,
        board: board
    };
}

// Static data if not enough games are available
const games = [
    {
      player_one_name: 'Alice',
      player_two_name: 'Bob',
      score: [ 50, 80 ],
      finished: true,
      winner: 'Bob'
    },
    {
      player_one_name: 'Carol',
      player_two_name: 'Dave',
      score: [ 30, 40 ],
      finished: true,
      winner: 'Dave'
    },
    {
      player_one_name: 'Eve',
      player_two_name: 'Frank',
      score: [ 30, 20 ],
      finished: true,
      winner: 'Eve'
    },
    {
      player_one_name: 'Daryll',
      player_two_name: 'Peter',
      score: [ 110, 120 ],
      finished: true,
      winner: 'Peter'
    },
    {
      player_one_name: 'Nick',
      player_two_name: 'Jenna',
      score: [ 90, 120 ],
      finished: true,
      winner: 'Jenna'
    },
    {
      player_one_name: 'Dave',
      player_two_name: 'Jenna',
      score: [ 40, 50 ],
      finished: true,
      winner: 'Jenna'
    }
  ]