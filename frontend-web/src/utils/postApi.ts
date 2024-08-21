type SendCommandProps = {
    command: string
    player_name: string
    board_id?: string | null
    player_id?: string | null
}

// Sends commands to the API
export default async function sendCommand({command, player_name, board_id = null, player_id = null}: SendCommandProps) {
    try {
        const response = await fetch('http://127.0.0.1:8080/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                command,
                player_name,
                player_id,
                board_id,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.board_id) {
            const boardUrl = `/board/${data.board_id}`;

            // Check if the current URL is not the desired board URL
            if (window.location.pathname !== boardUrl) {
                const newData: StoredData = {
                    player_id: player_id || data.player_two_id || data.player_one_id,
                    player_name: player_name,
                    board: data.board_id,
                }

                localStorage.setItem('boardData', JSON.stringify(newData));
                window.location.href = boardUrl;
            }
        }

        return data;
    } catch (error) {
        console.error('Failed to send command:', error);
    }
}

// Both players ids and names should be recorded.

// Input to /command except newgame related:
// {
//     "command": "board",
//     "player_name": "Petter",
//     "player_id": "0",
//     "board_id": "0"
//   }

// Response for board for /command:
// {
//     "response": "(;FF[4]GM[1]SZ[4,4])",
//     "notification": null,
//     "player_one_id": "0",
//     "player_two_id": "",
//     "player_one_name": "Petter",
//     "player_two_name": "",
//     "board_id": "0"
//   }

// Input to /command:
// {
//     "command": String
//     "player_name"
//     "board_id": String | null
//     "player_id": String | null
// }

// Response:
// {
//     "response": String
//     "notification": String | null
//     "player_one_id": String
//     "player_two_id": String
//     "player_one_name": String
//     "player_two_name": String
//     "board_id": String
// }

// Get /state/[id] // gets the board with the given id
// Response:
// {
//     "response": String // Board as sgf like it is rn
//     "notification": String | null
//     "player_one_id": String
//     "player_two_id": String
//     "player_one_name": String
//     "player_two_name": String
// }