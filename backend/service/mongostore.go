package service

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"time"
)

var database mongo.Database
var ctx context.Context

func SetupMongoStore() bool {
	uri := os.Getenv("URI")
	databaseName := os.Getenv("MONGO")

	ctx, _ = context.WithTimeout(context.Background(), 30*time.Second)

	client, clientErr := mongo.NewClient(options.Client().ApplyURI(uri))

	if clientErr != nil {
		log.Fatalf("failed to client %v", clientErr)
		return false
	}

	err := client.Connect(ctx)

	if err != nil {
		log.Fatalf("failed to connect, %v", err)
		return false
	}
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Could not connect to the MongoDB server: ", err)
	}

	println(client.NumberSessionsInProgress())
	database = *client.Database(databaseName, &options.DatabaseOptions{})
	return true
}

func ReplaceWithKeyValue(key string, value string, doc any, collection string) bool {
	col := database.Collection(collection)

	_, err := col.ReplaceOne(ctx, bson.D{{key, value}}, doc)
	if err != nil {
		return false
	}
	return true
}

func InsertDocument(doc any, collection string) error {
	col := database.Collection(collection)

	_, err := col.InsertOne(ctx, doc)

	if err != nil {
		return err
	}
	return nil
}

func FetchTypeFromKeyValue[T any](key string, value string, collection string) (*T, error) {
	col := database.Collection(collection)

	find := col.FindOne(ctx, bson.D{{key, value}})

	if find.Err() != nil {
		return nil, nil
	}
	var fetch T

	err := find.Decode(&fetch)
	if err != nil {
		log.Fatalf("Failed to decode mongo document")
		return nil, nil
	}

	return &fetch, nil
}
