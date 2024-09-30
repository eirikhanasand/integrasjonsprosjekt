package main

import (
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
	setup := service.SetupMongoStore()

	if setup == false {
		log.Fatalf("Failed to setup mongodb store.")
		return
	}
	var server = api.Server{
		GameMap: make(map[string]api.Game),
	}
	err = server.InitServer()

	if err != nil {
		log.Printf("Failed to initialize server with environment variables: %s", err.Error())
		return
	}
	server.StartServer()
}
