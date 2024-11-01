package api

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/url"
)

type DiscordInfo struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	State    string `json:"state"`
}

type DiscordRequest struct {
	Id    string `form:"id"`
	State string `form:"state"`
}

var stateMap = make(map[string]string)
var DiscordMap = make(map[string]DiscordInfo)

func (server *Server) DiscordLogin(ctx *gin.Context) {
	var req DiscordRequest

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed req request")
		return
	}
	stateMap[req.State] = ""

	ctx.JSON(http.StatusOK, server.Oauth2Config.AuthCodeURL(req.State))
}

func (server *Server) DiscordCallback(ctx *gin.Context) {
	value := ctx.Query("state")

	id, found := stateMap[value]

	if value == "" || found == false {
		ctx.String(http.StatusBadRequest, "State mismatch")
		return
	}
	defer delete(stateMap, value)

	token, err := server.Oauth2Config.Exchange(context.Background(), ctx.Query("code"))

	if err != nil {
		ctx.String(http.StatusBadRequest, fmt.Sprintf("token error: %s", err.Error()))
		return
	}

	res, err := server.Oauth2Config.Client(context.Background(), token).Get("https://discord.com/api/users/@me")

	if err != nil || res.StatusCode < 200 || res.StatusCode > 200 {
		if err != nil {
			ctx.String(http.StatusInternalServerError, fmt.Sprintf("client error: %s", err.Error()))
		} else {
			ctx.String(res.StatusCode, "Discord error")
		}
		return
	}

	defer res.Body.Close()

	var discordInfo DiscordInfo

	err = json.NewDecoder(res.Body).Decode(&discordInfo)

	if err != nil {
		ctx.String(http.StatusInternalServerError, fmt.Sprintf("body error: %s", err.Error()))
		return
	}

	// exchange tokens

	DiscordMap[id] = discordInfo

	parsedURL, err := url.Parse(server.FrontendAuthRedirect)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to parse URL"})
		return
	}

	queryParams := parsedURL.Query()
	queryParams.Set("user_id", discordInfo.Id)
	queryParams.Set("state", discordInfo.State)
	queryParams.Set("username", discordInfo.Username)
	parsedURL.RawQuery = queryParams.Encode()

	// Print or use the constructed URL
	finalURL := parsedURL.String()

	ctx.Redirect(http.StatusPermanentRedirect, finalURL)
}

func (server *Server) GetDiscordInfo(ctx *gin.Context) {
	var req DiscordRequest

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, "Malformed query request")
		return
	}
	if req.Id == "" {
		ctx.JSON(http.StatusBadRequest, "missing id in query.")
		return
	}
	info, found := DiscordMap[req.Id]

	if found == false {
		ctx.JSON(http.StatusBadRequest, "Faulty id.")
		return
	}
	ctx.JSON(http.StatusOK, info)
}
