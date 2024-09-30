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

type UserPostRequest struct {
	Id      string `form:"id"`
	Balance *int32 `form:"balance"`
}

func (server *Server) GetUsers(ctx *gin.Context) {
	var req UsersRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed param request")
		return
	}
	var users []User

	if req.IDs != nil {
		ids, err := parseIds(*req.IDs)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, "Malformed id-list")
			return
		}
		for i := range ids {
			userId := ids[i]
			user, err := service.FetchTypeFromKeyValue[User]("userId", userId, server.UserCollection)

			if err != nil || user == nil {
				continue
			}

			users = append(users, *user)
		}
	}

	ctx.JSON(http.StatusOK, users)
}

func (server *Server) PostUser(ctx *gin.Context) {
	var req UserPostRequest

	if err := ctx.ShouldBindJSON(req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed JSON body")
		return
	}
	var balance int32 = 0
	if req.Balance != nil {
		balance = *req.Balance
	}

	var user = User{
		req.Id,
		balance,
		0,
		0,
		make([]int8, 0),
	}

	service.InsertDocument(user, server.UserCollection)
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
