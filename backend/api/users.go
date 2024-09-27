package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	"integrasjon/service"
	"net/http"
	"strings"
)

type User struct {
	UserID     string `bson:"userId"`
	Balance    int32  `bson:"balance"`
	Highscore  int64  `bson:"highscore"`
	WeeklyBest int64  `bson:"weeklyBest"`
	Skins      []int8 `bson:"skins"`
}

type UsersRequestParam struct {
	IDs *string `form:"ids"`
}

func GetUsers(ctx *gin.Context) {
	var req UsersRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		println("Invalid ")
		return
	}
	var users []User

	if req.IDs != nil {
		ids, err := parseIds(*req.IDs)

		if err != nil {
			return
		}
		for i := range ids {
			userId := ids[i]
			user, err := service.FetchTypeFromKeyValue[User]("userId", userId, "users") // Temporary hardcoded collection

			if err != nil || user == nil {
				continue
			}

			users = append(users, *user)
		}
	}

	ctx.JSON(http.StatusOK, users)
}

func parseIds(ids string) ([]string, error) {
	trimmed := strings.TrimSpace(ids)

	if trimmed == "" {
		return nil, errors.New("input string is empty")
	}
	idList := strings.Split(trimmed, ",")

	var result []string
	for _, id := range idList {
		trimmedId := strings.TrimSpace(id)
		if trimmedId != "" {
			result = append(result, trimmedId)
		}
	}
	return result, nil
}
