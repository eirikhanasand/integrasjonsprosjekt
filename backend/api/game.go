package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Game struct {
	PlayerMap map[string]Player
	Playing   bool
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

func (server *Server) GetGameDeaths(ctx *gin.Context) {
	var req GameRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed param request")
		return
	}

	game, exists := server.GameMap[req.GameId]

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
	game, exists := server.GameMap[req.GameId]

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

	game, exists := server.GameMap[req.GameId]

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

	server.GameMap[req.GameId] = game

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

	game, exists := server.GameMap[req.GameId]

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

	server.GameMap[req.GameId] = game

	ctx.JSON(http.StatusOK, "request accepted")
}
