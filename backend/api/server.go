package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/ravener/discord-oauth2"
	"golang.org/x/oauth2"
	"os"
	"sync"
)

type Server struct {
	UserCollection string
	gameMap        map[string]Game
	GameMapLock    sync.RWMutex
	Oauth2Config   oauth2.Config
	// TODO add more fields.
}

func CreateServer() Server {
	return Server{
		gameMap: make(map[string]Game),
	}
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
			game.HEAD("/status", server.GameStatus)
			game.POST("/create", server.CreateGame)
			game.PUT("/start/", server.StartGame)
		}
	}
	err := r.Run()

	if err != nil {
		return
	}
}

func (s *Server) GetGame(gameID string) (Game, bool) {
	s.GameMapLock.RLock()         // Acquire read lock
	defer s.GameMapLock.RUnlock() // Ensure unlocking after read operation

	game, ok := s.gameMap[gameID] // Safely read from the map
	return game, ok
}

func (s *Server) SetGame(gameID string, game Game) {
	s.GameMapLock.Lock()         // Acquire write lock
	defer s.GameMapLock.Unlock() // Ensure unlocking after write operation

	s.gameMap[gameID] = game // Safely write to the map
}
