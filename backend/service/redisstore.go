package service

import (
	"errors"
	"github.com/redis/go-redis/v9"
)

func InitRedis() (*redis.Client, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // Redis address
		Password: "",               // No password by default
		DB:       0,                // Default DB
	})

	if rdb == nil {
		return nil, errors.New("failed to instatiate redis server")
	}
	return rdb, nil
}
