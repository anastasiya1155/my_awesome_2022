package router

import (
	"github.com/gin-gonic/gin"
	"github.com/vova/pa2020/backend/controllers"
	"github.com/vova/pa2020/backend/middleware"
)

func Initialize(r *gin.Engine) {
	r.GET("/", controllers.APIEndpoints)

	r.POST("/login", controllers.Login)

	r.POST("/register", controllers.Resister)
	r.POST("/reset", controllers.Reset)

	api := r.Group("api")
	api.Use(middleware.CheckJwt())
	{
		api.POST("/sandbox", controllers.Sandbox)

		api.POST("/comments", controllers.CreateComment)
		api.PUT("/comments/:id", controllers.UpdateComment)
		api.DELETE("/comments/:id", controllers.DeleteComment)

		api.GET("/labels", controllers.GetLabels)
		api.GET("/labels/:id", controllers.GetLabel)
		api.POST("/labels", controllers.CreateLabel)
		api.PUT("/labels/:id", controllers.UpdateLabel)
		api.DELETE("/labels/:id", controllers.DeleteLabel)

		api.GET("/posts", controllers.GetPosts)
		api.POST("/posts", controllers.CreatePost)
		api.PUT("/posts/:id", controllers.UpdatePost)
		api.DELETE("/posts/:id", controllers.DeletePost)

		api.GET("/posts-history", controllers.GetThisDayInHistory)
		api.GET("/posts-add-label/", controllers.AddPostLabel)
		api.GET("/posts-delete-label/", controllers.DeletePostLabel)
		api.GET("/posts-months/", controllers.GetPostMonths)
		api.GET("/posts-by-month/", controllers.GetPostByMonth)
		api.GET("/posts-search/", controllers.SearchPosts)

		api.GET("/tasks-in-progress", controllers.GetTasksInprogressForUser)
		api.GET("/tasks/:id", controllers.GetTask)
		api.POST("/tasks", controllers.CreateTask)
		api.PUT("/tasks/:id", controllers.UpdateTask)
		api.DELETE("/tasks/:id", controllers.DeleteTask)

		api.GET("/projects", controllers.GetProjects)
		api.GET("/projects/:id", controllers.GetProject)
		api.GET("/projects/:id/tasks", controllers.GetTasksByProject)
		api.POST("/projects", controllers.CreateProject)
		api.PUT("/projects/:id", controllers.UpdateProject)
		api.DELETE("/projects/:id", controllers.DeleteProject)

		api.GET("/lts", controllers.GetLts)
		api.GET("/lts-expired", controllers.ExpiredLt)
		api.POST("/lt", controllers.CreateLt)
		api.PUT("/lt/:id", controllers.UpdateLt)
		api.DELETE("/lt/:id", controllers.DeleteLt)

		api.GET("/periods", controllers.GetPeriods)
		api.POST("/periods", controllers.CreatePeriod)
		api.PUT("/periods/:id", controllers.UpdatePeriod)
		api.DELETE("/periods/:id", controllers.DeletePeriod)

		api.GET("/wishes", controllers.GetWishes)
		api.POST("/wishes", controllers.CreateWish)
		api.PUT("/wishes/:id", controllers.UpdateWish)
		api.DELETE("/wishes/:id", controllers.DeleteWish)

		api.GET("/transactions", controllers.GetTransactions)
		api.POST("/transactions", controllers.CreateTransaction)
		api.PUT("/transactions/:id", controllers.UpdateTransaction)
		api.DELETE("/transactions/:id", controllers.DeleteTransaction)

		api.GET("/transaction-categories", controllers.GetTransactionCategories)
		api.POST("/transaction-categories", controllers.CreateTransactionCategory)
		api.PUT("/transaction-categories/:id", controllers.UpdateTransactionCategory)
		api.DELETE("/transaction-categories/:id", controllers.DeleteTransactionCategory)

	}
}
