package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/ravener/discord-oauth2"
	"golang.org/x/oauth2"
	"os"
	"strconv"
	"sync"
)

type Server struct {
	UserCollection        string
	gameMap               map[string]Game
	GameMapLock           sync.Mutex
	Oauth2Config          oauth2.Config
	LeaderboardPageLength uint8
	// TODO add more fields.
}

func CreateServer() Server {
	return Server{
		gameMap:               make(map[string]Game),
		LeaderboardPageLength: 10,
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
	pageLength, err := strconv.Atoi(os.Getenv("LEADERBOARD_PAGE_LENGTH"))

	if err != nil {
		return err
	}
	server.LeaderboardPageLength = uint8(pageLength)
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

		leaderboard := api.Group("/leaderboard")
		{
			leaderboard.GET("/", server.GetLeaderboardPage)
			leaderboard.GET("/stats", server.GetLeaderboardStats)
		}

		game := api.Group("/game")
		{
			game.GET("/deaths", server.GetGameDeaths)
			game.GET("/scores", server.GetGameScores)
			game.POST("/score", server.PostGameScore)
			game.POST("/death", server.PostGameDeath)
			game.HEAD("/status", server.GameStatus)
			game.POST("/create", server.CreateGame)
			game.PUT("/start", server.StartGame)
			game.HEAD("/join/:gameId/:userId", server.JoinGame)
			game.HEAD("/leave/:gameId/:userId", server.LeaveGame)
		}
	}
	server.PopulateLeaderboard()

	err := r.Run()

	if err != nil {
		return
	}
}

func (s *Server) GetGameWithLock(gameID string) (Game, bool) {
	s.GameMapLock.Lock() // Lock for exclusive access (read and subsequent write)

	game, ok := s.gameMap[gameID] // Safe read operation
	return game, ok               // Keep the lock; do not unlock yet
}

func (s *Server) GetGame(gameID string) (Game, bool) {
	s.GameMapLock.Lock() // Lock for exclusive access (read and subsequent write)
	defer s.GameMapLock.Unlock()

	game, ok := s.gameMap[gameID] // Safe read operation
	return game, ok               // Keep the lock; do not unlock yet
}

func (s *Server) SetGame(gameID string, game Game) {
	// Since the lock is already acquired, we do not need to lock again
	s.gameMap[gameID] = game // Safe write operation
}

func (s *Server) ReleaseGameMapLock() {
	s.GameMapLock.Unlock() // Release the lock manually after you're done
}
