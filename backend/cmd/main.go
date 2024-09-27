package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"integrasjon/api"
	"integrasjon/service"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type Struktern struct {
	Name         string
	RestaurantId string `bson:"restaurant_id,omitempty"`
	Cuisine      string `bson:"cuisine,omitempty"`
	Borough      string `bson:"borough,omitempty"`
}

func main() {
	pwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	//use ../.env because main.go inside /cmd
	if err = godotenv.Load(filepath.Join(pwd, ".env")); err != nil {
		println(".env dir : " + filepath.Join(pwd, ".env"))
		log.Println("No .env file found")
		return
	}
	setup := service.SetupMongoStore()

	if setup == false {
		log.Fatalf("Failed to setup mongodb store.")
		return
	}

	r := gin.Default()
	r.GET("/", root)
	r.GET("users", api.GetUsers)

	r.Run()
}

func root(ctx *gin.Context) {
	fetch, _ := service.FetchTypeFromKeyValue[Struktern]("restaurant_id", "2", "gubb")

	ctx.JSON(http.StatusOK, fetch.Name)
}
