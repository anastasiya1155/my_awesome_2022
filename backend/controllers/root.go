package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func APIEndpoints(c *gin.Context) {
	reqScheme := "http"

	if c.Request.TLS != nil {
		reqScheme = "https"
	}

	reqHost := c.Request.Host
	baseURL := fmt.Sprintf("%s://%s", reqScheme, reqHost)

	resources := map[string]string{
		"comments_url": baseURL + "/comments",
		"comment_url":  baseURL + "/comments/{id}",
		"labels_url":   baseURL + "/labels",
		"label_url":    baseURL + "/labels/{id}",
		"pins_url":     baseURL + "/pins",
		"pin_url":      baseURL + "/pins/{id}",
		"posts_url":    baseURL + "/posts",
		"post_url":     baseURL + "/posts/{id}",
		"tasks_url":    baseURL + "/tasks",
		"task_url":     baseURL + "/tasks/{id}",
	}

	c.IndentedJSON(http.StatusOK, resources)
}
