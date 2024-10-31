package api

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"integrasjon/service"
	"integrasjon/util"
	"net/http"
	"strings"
)

type User struct {
	UserID     string `bson:"userId"`
	Balance    int32  `bson:"balance"`
	Highscore  int64  `bson:"highscore"`
	WeeklyBest int64  `bson:"weeklyBest"`
	Skins      []int8 `bson:"skins"`
	Language   string `bson:"language"`
}

type UsersRequestParam struct {
	IDs *string `form:"ids"`
}

type UserRequestParam struct {
	ID         string `form:"id" binding:"required"`
	Balance    *bool  `form:"balance"`
	Highscore  *bool  `form:"highscore"`
	Skins      *bool  `form:"skins"`
	WeeklyBest *bool  `form:"weeklyBest"`
	Language   *bool  `form:"language"`
}

type UserPatchRequest struct {
	Balance    *int32  `json:"balance"`
	Highscore  *int64  `json:"highscore"`
	WeeklyBest *int64  `json:"weeklyBest"`
	Skins      *[]int8 `json:"skins"`
	Language   *string `json:"language"`
}

type UserPostRequest struct {
	Id      string `json:"id"`
	Balance *int32 `json:"balance"`
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
				if err != nil {
					fmt.Printf("err: %s", err.Error())
				}
				if user == nil {
					fmt.Printf("user nil")
				}
				continue
			}

			users = append(users, *user)
		}
	}
	ctx.JSON(http.StatusOK, users)
}

func (server *Server) PostUser(ctx *gin.Context) {
	var req UserPostRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, fmt.Sprintf("Malformed JSON body: %s", err))
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
		"no",
	}
	err := service.InsertDocument(user, server.UserCollection)

	if err != nil {
		ctx.String(http.StatusInternalServerError, fmt.Sprintf("database error: %s", err.Error()))
	} else {
		ctx.Status(http.StatusOK)
	}
}

func (server *Server) GetUserField(ctx *gin.Context) {
	var req UserRequestParam

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed id query")
		return
	}
	user, err := service.FetchTypeFromKeyValue[User]("userId", req.ID, server.UserCollection)

	if err != nil {
		ctx.String(http.StatusInternalServerError, fmt.Sprintf("error in database request: %s", err.Error()))
		return
	}
	if user == nil {
		ctx.String(http.StatusNotFound, "user does not exist")
		return
	}
	if req.Balance == nil && req.Highscore == nil && req.WeeklyBest == nil && req.Skins == nil && req.Language == nil {
		ctx.JSON(http.StatusOK, user)
		return
	}

	type DummyUser struct {
		Balance    *int32  `json:"balance"`
		Highscore  *int64  `json:"highscore"`
		WeeklyBest *int64  `json:"weeklyBest"`
		Skins      *[]int8 `json:"skins"`
		Language   *string `json:"language"`
	}

	var dummyUser DummyUser

	if req.Balance != nil {
		dummyUser.Balance = &user.Balance
	}
	if req.WeeklyBest != nil {
		dummyUser.WeeklyBest = &user.WeeklyBest
	}
	if req.Highscore != nil {
		dummyUser.Highscore = &user.Highscore
	}
	if req.Language != nil {
		dummyUser.Language = &user.Language
	}
	if req.Skins != nil {
		dummyUser.Skins = &user.Skins
	}
	ctx.JSON(http.StatusOK, dummyUser)
}

func (server *Server) PatchUser(ctx *gin.Context) {
	var queryReq UserRequestParam

	if err := ctx.ShouldBindQuery(&queryReq); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed id query")
		return
	}

	var bodyReq UserPatchRequest

	if err := ctx.ShouldBindJSON(&bodyReq); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed json body")
		return
	}
	user, err := service.FetchTypeFromKeyValue[User]("userId", queryReq.ID, server.UserCollection)

	if err != nil {
		ctx.String(http.StatusInternalServerError, fmt.Sprintf("error in database request: %s", err.Error()))
		return
	}
	if user == nil {
		ctx.String(http.StatusNotFound, "user does not exist")
		return
	}

	util.UpdateIfNotNil(bodyReq.Highscore, &user.Highscore)
	util.UpdateIfNotNil(bodyReq.WeeklyBest, &user.WeeklyBest)
	util.UpdateIfNotNil(bodyReq.Language, &user.Language)
	util.UpdateIfNotNil(bodyReq.Skins, &user.Skins)
	util.UpdateIfNotNil(bodyReq.Balance, &user.Balance)

	inserted := service.ReplaceWithKeyValue("userId", user.UserID, user, server.UserCollection)

	if inserted == false {
		ctx.String(http.StatusInternalServerError, "unsuccessful insertion")
	} else {
		ctx.String(http.StatusOK, "successful insertion")
	}
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
