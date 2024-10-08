package main

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"integrasjon/api"
	"integrasjon/service"
	"log"
	"os"
	"path/filepath"
)

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
	redis, err := service.InitRedis()
	if err != nil {
		return
	}

	pong, err := redis.Ping(context.Background()).Result()
	if err != nil {
		println("no response")
	}
	fmt.Println("Redis PING Response:", pong)

	setup := service.SetupMongoStore()

	if setup == false {
		log.Fatalf("Failed to setup mongodb store.")
		return
	}
	var server = api.CreateServer()
	err = server.InitServer()

	if err != nil {
		log.Printf("Failed to initialize server with environment variables: %s", err.Error())
		return
	}
	server.StartServer()
}
