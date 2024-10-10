package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"integrasjon/service"
	"log"
	"net/http"
)

type LeaderboardRequest struct {
	Page uint8 `form:"page" binding:"required"`
}

func (server *Server) GetLeaderboardPage(ctx *gin.Context) {
	var req LeaderboardRequest

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed query")
		return
	}

	bottom := uint64(UintSubtractionClamp(req.Page)) * uint64(server.LeaderboardPageLength)
	top := req.Page * server.LeaderboardPageLength

	leaderboard, err := service.GetWithRange("subway", int64(bottom), int64(top))
	if err != nil {
		ctx.String(http.StatusInternalServerError, "error in fetching leaderboard range: %s", err.Error())
		return
	}
	ctx.JSON(http.StatusOK, leaderboard)
}

func (server *Server) GetLeaderboardStats(ctx *gin.Context) {
	type LeaderboardStats struct {
		Size       int64 `json:"size"`
		PageLength uint8 `json:"pageLength"`
	}

	size, err := service.GetLeaderboardSize("subway")

	if err != nil {
		ctx.String(http.StatusInternalServerError, fmt.Sprintf("failed to fetch stats: %s", err.Error()))
		return
	}

	stats := LeaderboardStats{
		Size:       size,
		PageLength: server.LeaderboardPageLength,
	}
	ctx.JSON(http.StatusOK, stats)
}

func (server *Server) PopulateLeaderboard() {
	documents, err := service.FetchDocuments[User](server.UserCollection)

	if err != nil {
		log.Fatal("Failed to fetch documents")
	} else {
		for i := range documents {
			user := documents[i]

			err := service.SetScore("subway", user.UserID, float64(user.Highscore))
			if err != nil {
				log.Fatal("failed to set score for user: %s", user.UserID)
				return
			}
		}
	}
}

func UintSubtractionClamp(value uint8) uint8 {
	if value == 0 {
		return 0 // Prevent underflow by returning 0 if value is already 0
	}
	return value - 1 // Safe to subtract 1
}
