package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"integrasjon/service"
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
	UserId string `form:"userId" binding:"required"`
	Died   *bool  `form:"died"`
	Score  *int32 `form:"score"`
}

type GameCreationRequest struct {
	UserId string `form:"userId" binding:"required"`
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
		LobbyLeader: req.UserId,
	}

	playerMap := make(map[string]Player)

	playerMap[req.UserId] = Player{
		Id:    req.UserId,
		Alive: true,
		Score: 0,
	}
	game.PlayerMap = playerMap
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

	game, found := server.GetGameWithLock(req.GameId)
	defer server.ReleaseGameMapLock()

	if found == false {
		ctx.String(http.StatusNotFound, "game does not exist")
		return
	}

	user, err := service.FetchTypeFromKeyValue[User]("userId", req.UserId, server.UserCollection)

	if err != nil {
		ctx.String(http.StatusInternalServerError, fmt.Sprintf("database error: %s", err.Error()))
		return
	}

	if user == nil {
		ctx.String(http.StatusExpectationFailed, "user does not exist")
		return
	}

	game.PlayerMap[user.UserID] = Player{
		Id:    user.UserID,
		Alive: true,
		Score: 0,
	}
	server.SetGame(req.GameId, game)
}

func (server *Server) LeaveGame(ctx *gin.Context) {
	var req GameJoinLeaveRequest

	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed uri")
		return
	}

	game, found := server.GetGameWithLock(req.GameId)
	defer server.ReleaseGameMapLock()

	if found == false {
		ctx.String(http.StatusNotFound, "game does not exist")
		return
	}
	player, exists := game.PlayerMap[req.UserId]

	if exists == false {
		ctx.String(http.StatusNotFound, "this player is not in this game")
		return
	}
	delete(game.PlayerMap, player.Id)

	server.SetGame(req.GameId, game)
}

func (server *Server) StartGame(ctx *gin.Context) {
	var req GameRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed param request")
		return
	}

	game, found := server.GetGameWithLock(req.GameId)
	defer server.ReleaseGameMapLock()

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
	game, found := server.GetGameWithLock(req.GameId)
	server.ReleaseGameMapLock()

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

	var scoreMap = make(map[string]int32)

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

	game, exists := server.GetGameWithLock(req.GameId)
	defer server.ReleaseGameMapLock()

	if exists == false {
		ctx.JSON(http.StatusNotFound, "No game with this id exists.")
		return
	}

	player, found := game.PlayerMap[req.UserId]

	if found == false {
		ctx.JSON(http.StatusNotFound, "No player with that ID in the game.")
		return
	}

	player.Alive = !(*req.Died) // Alive is negated value of died.

	game.PlayerMap[req.UserId] = player

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

	game, exists := server.GetGameWithLock(req.GameId)
	defer server.ReleaseGameMapLock()

	if exists == false {
		ctx.JSON(http.StatusNotFound, "No game with this id exists.")
		return
	}

	player, found := game.PlayerMap[req.UserId]

	if found == false {
		ctx.JSON(http.StatusNotFound, "No player with that ID in the game.")
		return
	}

	player.Score = *req.Score

	game.PlayerMap[req.UserId] = player

	server.SetGame(req.GameId, game)

	ctx.JSON(http.StatusOK, "request accepted")
}
