package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	"os"
)

type Server struct {
	UserCollection string
	// TODO add more fields.
	GameMap map[string]Game
}

func (server *Server) InitServer() error {
	if _, found := os.LookupEnv("user-collection"); found != false {
		server.UserCollection = os.Getenv("user-collection")
	} else {
		return errors.New("no user-collection in the .env file")
	}
	return nil
}

func (server *Server) StartServer() {
	r := gin.Default()

	users := r.Group("users")
	{
		users.GET("", server.GetUsers)
		users.POST("", server.PostUser)
	}

	game := r.Group("game")
	{
		game.GET("deaths", server.GetGameDeaths)
		game.GET("scores", server.GetGameScores)
	}

	err := r.Run()

	if err != nil {
		return
	}
}
