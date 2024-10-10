package service

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"time"
)

var database mongo.Database
var ctx context.Context

func SetupMongoStore() error {
	uri, found := os.LookupEnv("URI")

	if found == false {
		return errors.New("missing URI environment variable")
	}

	databaseName, found := os.LookupEnv("MONGO")

	if found == false {
		return errors.New("missing MONGO environment variable")
	}

	ctx, _ = context.WithTimeout(context.Background(), 30*time.Second)

	client, clientErr := mongo.NewClient(options.Client().ApplyURI(uri))

	if clientErr != nil {
		return fmt.Errorf("failed to client %v", clientErr)
	}

	err := client.Connect(ctx)

	if err != nil {
		return fmt.Errorf("failed to connect, %v", err)
	}
	err = client.Ping(ctx, nil)
	if err != nil {
		return fmt.Errorf("could not connect to the MongoDB server: %v", err)
	}
	database = *client.Database(databaseName, &options.DatabaseOptions{})
	return nil
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

func FetchDocuments[T any](collection string) ([]T, error) {
	col := database.Collection(collection)

	filter := bson.D{}

	cursor, err := col.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var results []T

	if err := cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	return results, nil
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
