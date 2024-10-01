package api

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"time"
)

type Game struct {
	PlayerMap   map[string]Player
	LobbyLeader string
	Playing     bool
	StartTime   *time.Time
}

type Player struct {
	Id    string
	Alive bool
	Score int32
}

type GameRequestParam struct {
	GameId string `form:"gameId" binding:"required"`
}

type GamePostRequestParam struct {
	GameId string `form:"gameId" binding:"required"`
	Player string `form:"player" binding:"required"`
	Died   *bool  `form:"died"`
	Score  *int32 `form:"score"`
}

type GameCreationRequest struct {
	LobbyLeader string `form:"lobbyLeader" binding:"required"`
}

type GameJoinLeaveRequest struct {
	GameId string `uri:"gameId" binding:"required"`
	UserId string `uri:"userId" binding:"required"`
}

func (server *Server) CreateGame(ctx *gin.Context) {
	var req GameCreationRequest

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed param request")
		return
	}

	game := Game{
		Playing:     false,
		LobbyLeader: req.LobbyLeader,
	}

	playerMap := make(map[string]Player)

	playerMap[req.LobbyLeader] = Player{
		Id:    req.LobbyLeader,
		Alive: true,
		Score: 0,
	}
	gameId := uuid.New().String()[:6]

	server.SetGame(gameId, game)

	ctx.JSON(http.StatusOK, gameId)
}

func (server *Server) JoinGame(ctx *gin.Context) {
	var req GameJoinLeaveRequest

	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed uri")
		return
	}

}

func (server *Server) StartGame(ctx *gin.Context) {
	var req GameRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed param request")
		return
	}

	game, found := server.GetGame(req.GameId)

	if found == false {
		ctx.Status(http.StatusNotFound)
		return
	}

	timeIn5Seconds := time.Now().Add(5 * time.Second)
	game.StartTime = &timeIn5Seconds

	server.SetGame(req.GameId, game)
}

func (server *Server) GameStatus(ctx *gin.Context) {
	var req GameRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.Status(http.StatusBadRequest)
		return
	}
	game, found := server.GetGame(req.GameId)

	if found == false {
		ctx.Status(http.StatusNotFound)
		return
	}

	if game.StartTime != nil {
		ctx.Header("start-time", game.StartTime.String())
	}
	if game.Playing == true {
		ctx.Status(http.StatusOK)
		return
	}
	ctx.Status(http.StatusAccepted)
}

func (server *Server) GetGameDeaths(ctx *gin.Context) {
	var req GameRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed param request")
		return
	}

	game, exists := server.GetGame(req.GameId)

	if exists == false {
		ctx.JSON(http.StatusNotFound, "No game with this id exists.")
		return
	}
	var aliveMap map[string]bool

	for s := range game.PlayerMap {
		player := game.PlayerMap[s]
		aliveMap[player.Id] = player.Alive
	}
	ctx.JSON(http.StatusOK, aliveMap)
}

func (server *Server) GetGameScores(ctx *gin.Context) {
	var req GameRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed param request")
		return
	}
	game, exists := server.GetGame(req.GameId)

	if exists == false {
		ctx.JSON(http.StatusNotFound, "No game with this id exists.")
		return
	}

	var scoreMap map[string]int32

	for s := range game.PlayerMap {
		player := game.PlayerMap[s]
		scoreMap[player.Id] = player.Score
	}
	ctx.JSON(http.StatusOK, scoreMap)
}

func (server *Server) PostGameDeath(ctx *gin.Context) {
	var req GamePostRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed param request")
		return
	}
	if req.Died == nil {
		ctx.JSON(http.StatusBadRequest, "No death query-param provided.")
	}

	game, exists := server.GetGame(req.GameId)

	if exists == false {
		ctx.JSON(http.StatusNotFound, "No game with this id exists.")
		return
	}

	player, found := game.PlayerMap[req.Player]

	if found == false {
		ctx.JSON(http.StatusNotFound, "No player with that ID in the game.")
		return
	}

	player.Alive = !(*req.Died) // Alive is negated value of died.

	game.PlayerMap[req.Player] = player

	server.SetGame(req.GameId, game)

	ctx.JSON(http.StatusOK, "request accepted")
}

func (server *Server) PostGameScore(ctx *gin.Context) {
	var req GamePostRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed param request")
		return
	}
	if req.Score == nil {
		ctx.JSON(http.StatusBadRequest, "No score query-param provided.")
	}

	game, exists := server.GetGame(req.GameId)

	if exists == false {
		ctx.JSON(http.StatusNotFound, "No game with this id exists.")
		return
	}

	player, found := game.PlayerMap[req.Player]

	if found == false {
		ctx.JSON(http.StatusNotFound, "No player with that ID in the game.")
		return
	}

	player.Score = *req.Score

	game.PlayerMap[req.Player] = player

	server.SetGame(req.GameId, game)

	ctx.JSON(http.StatusOK, "request accepted")
}
