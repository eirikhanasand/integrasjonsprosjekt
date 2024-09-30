package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/ravener/discord-oauth2"
	"golang.org/x/oauth2"
	"os"
)

type Server struct {
	UserCollection string
	// TODO add more fields.
	GameMap      map[string]Game
	Oauth2Config oauth2.Config
}

func (server *Server) InitServer() error {
	if _, found := os.LookupEnv("USER_COLLECTION"); found != false {
		server.UserCollection = os.Getenv("USER_COLLECTION")
	} else {
		return errors.New("no user-collection in the .env file")
	}

	server.Oauth2Config = oauth2.Config{
		RedirectURL:  os.Getenv("LOGIN_REDIRECT"),
		ClientID:     os.Getenv("CLIENT_ID"),
		ClientSecret: os.Getenv("CLIENT_SECRET"),
		Scopes:       []string{discord.ScopeIdentify},
		Endpoint:     discord.Endpoint,
	}

	return nil
}

func (server *Server) StartServer() {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/login", server.DiscordLogin)
		api.GET("/callback", server.DiscordCallback)
		api.GET("/user", server.GetDiscordInfo)

		users := api.Group("/users")
		{
			users.GET("/", server.GetUsers)
			users.POST("/", server.PostUser)
		}

		game := api.Group("/game")
		{
			game.GET("/deaths", server.GetGameDeaths)
			game.GET("/scores", server.GetGameScores)
		}
	}
	err := r.Run()

	if err != nil {
		return
	}
}
