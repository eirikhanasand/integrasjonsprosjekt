package api

import (
	"errors"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ravener/discord-oauth2"
	"golang.org/x/oauth2"
	"os"
	"strconv"
	"sync"
	"time"
)

type Server struct {
	UserCollection        string
	gameMap               map[string]Game
	GameMapLock           sync.Mutex
	Oauth2Config          oauth2.Config
	LeaderboardPageLength uint8
	FrontendAuthRedirect  string
	// TODO add more fields.
}

func CreateServer() Server {
	return Server{
		gameMap:               make(map[string]Game),
		LeaderboardPageLength: 10,
	}
}

func (server *Server) InitServer() error {
	userCollection, found := os.LookupEnv("USER_COLLECTION")

	if found == false {
		return errors.New("no USER-COLLECTION environment variable")
	}

	server.UserCollection = userCollection

	loginRedirect, found := os.LookupEnv("LOGIN_REDIRECT")

	if found == false {
		return errors.New("no LOGIN_REDIRECT environment variable")
	}

	frontendRedirect, found := os.LookupEnv("FRONTEND_AUTH_REDIRECT")

	if found == false {
		return errors.New("no FRONTEND_AUTH_REDIRECT environment variable")
	}

	server.FrontendAuthRedirect = frontendRedirect

	clientId, found := os.LookupEnv("CLIENT_ID")

	if found == false {
		return errors.New("no CLIENT_ID environment variable")
	}

	clientSecret, found := os.LookupEnv("CLIENT_SECRET")

	if found == false {
		return errors.New("no CLIENT_SECRET environment variable")
	}

	server.Oauth2Config = oauth2.Config{
		RedirectURL:  loginRedirect,
		ClientID:     clientId,
		ClientSecret: clientSecret,
		Scopes:       []string{discord.ScopeIdentify},
		Endpoint:     discord.Endpoint,
	}
	leaderboardPageLength, found := os.LookupEnv("LEADERBOARD_PAGE_LENGTH")

	if found == false {
		return errors.New("no LEADERBOARD_PAGE_LENGTH environment variable")
	}

	pageLength, err := strconv.Atoi(leaderboardPageLength)

	if err != nil {
		return err
	}
	server.LeaderboardPageLength = uint8(pageLength)
	return nil
}

func (server *Server) StartServer() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},  // Allows all origins
		AllowMethods:     []string{"*"},  // Allows all HTTP methods
		AllowHeaders:     []string{"*"},  // Allows all headers
		ExposeHeaders:    []string{"*"},  // Exposes all headers
		AllowCredentials: true,           // Allows cookies and credentials
		MaxAge:           12 * time.Hour, // Caches preflight request results for 12 hours
	}))

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
			game.GET("/chat/:gameId", server.GetChatMessages)
			game.POST("/chat/:gameId", server.PostChatMessage)
			game.GET("/deaths", server.GetGameDeaths)
			game.GET("/scores", server.GetGameScores)
			game.POST("/score", server.PostGameScore)
			game.POST("/death", server.PostGameDeath)
			game.HEAD("/status", server.GameStatus)
			game.POST("/create", server.CreateGame)
			game.PUT("/start", server.StartGame)
			game.PUT("/join/:gameId/:userId", server.JoinGame)
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
