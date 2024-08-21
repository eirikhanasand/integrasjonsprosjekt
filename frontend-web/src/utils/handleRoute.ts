import sendCommand from "./postApi";

// Handles menu routes (sends valid data to API)
export default function handleRoute(route: string, player: string, text: string) {
    switch (route) {
        case "/new-game":
            sendCommand({command: `newgame ${text}`, player_name: player});
            break;
        case "/load-sgf":
            sendCommand({command: `newsgf ${text}`, player_name: player})
            break;
        case "/new-sgf-string":
            sendCommand({command: `newsgf ${text}`, player_name: player})
            break;
        case "/pass-turn":
            sendCommand({command: "pass", player_name: player});
            break;
        case "/save-sgf":
            sendCommand({command: "save", player_name: player});
            break;
        default:
            console.error("Unknown route:", route);
    }
}