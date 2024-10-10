package service

import (
	"errors"
	"github.com/redis/go-redis/v9"
)

var client *redis.Client

func InitRedis() {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "10.212.168.213:6379", // Redis address
		Password: "gubb123gubb",         // No password by default
		DB:       0,                     // Default DB
	})

	client = rdb
}

func GetLeaderboardSize(leaderboard string) (int64, error) {
	if client == nil {
		return 0, errors.New("client not instantiated")
	}
	size, err := client.ZCard(ctx, leaderboard).Result()

	if err != nil {
		return 0, err
	}
	return size, nil
}

func SetScore(leaderboard string, user string, score float64) error {
	if client == nil {
		return errors.New("client not instantiated")
	}
	err := client.ZAdd(ctx, leaderboard, redis.Z{
		Score:  score,
		Member: user,
	}).Err()

	if err != nil {
		return err
	}
	return nil
}

func GetWithRange(leaderboard string, bottom int64, top int64) ([]redis.Z, error) {
	if client == nil {
		return nil, errors.New("client not instantiated")
	}
	result, err := client.ZRevRangeWithScores(ctx, leaderboard, bottom, top-1).Result()

	if err != nil {
		return nil, err
	}
	return result, nil
}
