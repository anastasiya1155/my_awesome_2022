package controllers

import (
	"github.com/vova/pa2020/backend/middleware"
	"net/http"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/models"

	_ "github.com/go-sql-driver/mysql"
)

type FormPostLabel struct {
	Post  string `form:"post_id"`
	Label string `form:"label_id"`
}

func GetPosts(c *gin.Context) {

	type Post struct {
		ID         int
		PeriodId   int
		PeriodName string
	}

	db := dbpkg.DBInstance(c)

	var modelPosts []models.Post

	if err := db.
		Select("*").
		Where("user_id = ?", middleware.UserInstance(c).ID).
		Preload("Comments").
		Preload("Labels").
		Order("date DESC").
		Limit(25).
		Find(&modelPosts).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	tochedPosts := make(map[int]models.Post)

	for _, p := range modelPosts {
		tochedPosts[p.ID] = p
	}

	var periodPosts []Post

	if err := db.
		Select("posts.id as id, periods.id as period_id,periods.name as period_name").
		Where("posts.user_id = ? ", middleware.UserInstance(c).ID).
		Joins("LEFT JOIN periods ON posts.date BETWEEN periods.start AND IFNULL(periods.end, NOW())").
		Order("date DESC").
		Limit(25).
		Find(&periodPosts).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	for _, post := range periodPosts {
		period := models.Period{}
		period.ID = post.PeriodId
		period.Name = post.PeriodName

		if postExist, ok := tochedPosts[post.ID]; ok {
			postExist.Periods = append(postExist.Periods, period)
			tochedPosts[post.ID] = postExist
		}
	}

	s := make([]models.Post, 0)

	for _, mapElement := range tochedPosts {
		s = append(s, mapElement)
	}
	sort.Slice(s, func(i, j int) bool {
		return s[i].Date.Unix() > s[j].Date.Unix()
	})
	c.IndentedJSON(200, s)
}

// voted
func CreatePost(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	post := models.Post{}

	if err := c.Bind(&post); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	post.UserId = middleware.UserInstance(c).ID
	if err := db.Create(&post).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, post)
}

// voted
func UpdatePost(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	post := models.Post{}

	if db.First(&post, id).Error != nil {
		content := gin.H{"error": "post with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&post); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if !vote(c, post) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&post).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, post)
}

// voted
func DeletePost(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	post := models.Post{}

	if db.First(&post, id).Error != nil {
		content := gin.H{"error": "post with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}
	if !vote(c, post) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Delete(&post).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}

func GetThisDayInHistory(c *gin.Context) {
	GetPostsByFilter(c, "DATE_FORMAT(date, '%m-%d') = ? and posts.user_id = ?", time.Now().Format("01-02"), middleware.UserInstance(c).ID)
}

func SearchPosts(c *gin.Context) {
	q := c.DefaultQuery("q", "java")
	GetPostsByFilter(c, "body LIKE ? AND posts.user_id = ?", "%"+q+"%", middleware.UserInstance(c).ID)
}

// voted
func AddPostLabel(c *gin.Context) {
	db := dbpkg.DBInstance(c)

	var form FormPostLabel

	err := c.ShouldBindQuery(&form)
	if err != nil {
		c.JSON(400, err.Error())
	}

	var post models.Post
	db.Raw("select * from posts where id =?", form.Post).Scan(&post)
	if !vote(c, post) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	var label models.Label
	db.Raw("select * from labels where id =?", form.Label).Scan(&label)
	if !vote(c, label) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	query := "INSERT INTO `posts_labels` (`post_id`,`label_id`)  values( ?, ?)"
	db.Exec(query, form.Post, form.Label)
	c.JSON(200, "success")

}

// voted
func DeletePostLabel(c *gin.Context) {
	db := dbpkg.DBInstance(c)

	var form FormPostLabel

	err := c.ShouldBindQuery(&form)
	if err != nil {
		c.JSON(400, err.Error())
	}

	var post models.Post
	db.Raw("select * from posts where id =?", form.Post).Scan(&post)
	if !vote(c, post) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	var label models.Label
	db.Raw("select * from labels where id =?", form.Label).Scan(&label)
	if !vote(c, label) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	query := "Delete from `posts_labels`  WHERE `post_id`=? and`label_id`= ?;"
	db.Exec(query, form.Post, form.Label)
	c.JSON(200, "success")
}

// це шоб отримати менюху з місяцями
// voted
func GetPostMonths(c *gin.Context) {

	db := dbpkg.DBInstance(c)

	type Result struct {
		YM  string
		M   string
		Y   string
		Cnt int
	}

	var result []Result

	sqlquery := `SELECT 
		DATE_FORMAT(date, '%y-%m') ym,
		DATE_FORMAT(date, '%M') m,
		DATE_FORMAT(date, '%Y') y,
		COUNT(id) cnt
	FROM
		posts
	Where user_id = ?
	GROUP BY 
		DATE_FORMAT(date, '%y-%m'),
		DATE_FORMAT(date, '%M'),
		DATE_FORMAT(date, '%Y')	
	;`

	db.Raw(sqlquery, middleware.UserInstance(c).ID).Scan(&result)

	byYears := make(map[string][]Result)
	for _, month := range result {
		y := month.Y
		byYears[y] = append(byYears[y], month)
	}

	c.JSON(200, byYears)
}
func GetPostByMonth(c *gin.Context) {
	ym := c.DefaultQuery("ym", "10-10")
	GetPostsByFilter(c, "DATE_FORMAT(date, '%y-%m') = ? and posts.user_id = ?", ym, middleware.UserInstance(c).ID)
}
func GetPostsByFilter(c *gin.Context, query interface{}, args ...interface{}) {

	type Post struct {
		ID         int
		PeriodId   int
		PeriodName string
	}

	db := dbpkg.DBInstance(c)

	var modelPosts []models.Post

	if err := db.
		Select("*").
		Where(query, args[0], args[1]).
		Preload("Comments").
		Preload("Labels").
		Find(&modelPosts).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	tochedPosts := make(map[int]models.Post)

	for _, p := range modelPosts {
		tochedPosts[p.ID] = p
	}

	var periodPosts []Post

	if err := db.
		Select("posts.id as id, periods.id as period_id, periods.name as period_name").
		Joins("LEFT JOIN periods ON posts.date BETWEEN periods.start AND IFNULL(periods.end, NOW())").
		Where(query, args[0], args[1]).
		Find(&periodPosts).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	for _, post := range periodPosts {
		period := models.Period{}
		period.ID = post.PeriodId
		period.Name = post.PeriodName

		if postExist, ok := tochedPosts[post.ID]; ok {
			postExist.Periods = append(postExist.Periods, period)
			tochedPosts[post.ID] = postExist
		}
	}

	s := make([]models.Post, 0)

	for _, mapElement := range tochedPosts {
		s = append(s, mapElement)
	}
	sort.Slice(s, func(i, j int) bool {
		return s[i].Date.Unix() < s[j].Date.Unix()
	})
	c.IndentedJSON(200, s)
}
