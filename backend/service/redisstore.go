package service

import (
	"errors"
	"github.com/redis/go-redis/v9"
	"os"
	"strconv"
)

var client *redis.Client

func InitRedis() error {
	addr, found := os.LookupEnv("REDIS_ADDR")

	if found == false {
		return errors.New("no REDIS_ADDR environment variable")
	}

	password, found := os.LookupEnv("REDIS_PASS")

	if found == false {
		return errors.New("no REDIS_PASS environment variable")
	}

	id, found := os.LookupEnv("REDIS_DB_ID")

	if found == false {
		return errors.New("no REDIS_DB_ID environment variable")
	}

	db, err := strconv.Atoi(id)

	if err != nil {
		return errors.New("REDIS_DB_ID should be an integer")
	}

	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})
	client = rdb

	return nil
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
