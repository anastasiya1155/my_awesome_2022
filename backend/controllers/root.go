package controllers

import (
	"fmt"
	"backend/middleware"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	dbpkg "backend/db"
	"backend/models"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("my_awsome_key")

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
type HashSalt struct {
	Hash string
	Salt string
}

func APIEndpoints(c *gin.Context) {
	reqScheme := "http"

	if c.Request.TLS != nil {
		reqScheme = "https"
	}

	reqHost := c.Request.Host
	baseURL := fmt.Sprintf("%s://%s", reqScheme, reqHost)

	resources := map[string]string{
		"pins_url": baseURL + "/pins",
		"pin_url":  baseURL + "/pins/{id}",
	}

	c.IndentedJSON(http.StatusOK, resources)
}

func Sandbox(c *gin.Context) {

	type Inc struct {
		Description string
		Picture     string
		Raiting     int
		Abv         float32
		Og          float32
	}

	in := []Inc{}

	if err := c.Bind(&in); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	dbstr := "vova:vova@tcp(localhost:3306)/beer?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open("mysql", dbstr)
	if err != nil {
		log.Fatalf("Got error when connect database, the error is '%v'", err)
	}

	db.LogMode(true)

	for _, rev := range in {
		raiting := 0
		for j := 0; j < 11; j++ {
			if strings.Contains(rev.Description, fmt.Sprintf("%d/10", j)) {
				raiting = j
				break
			}
		}

		query := "INSERT INTO `beer`.`review` (`description`, `picture`, `rating`) VALUES (?, ?, ?);"
		db.Exec(query, rev.Description, rev.Picture, raiting)
	}

	c.JSON(201, in)
}
func Login(c *gin.Context) {
	type Request struct {
		Email    string
		Password string
	}

	var request Request

	if err := c.Bind(&request); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	db := dbpkg.DBInstance(c)
	var user models.User
	db.Where("email = ?", request.Email).First(&user)

	passwordMatch := comparePasswords(user.Password, []byte(request.Password))

	if !passwordMatch {
		c.JSON(401, gin.H{"error": "incorrect login or password"})
		return
	}
	tokenString := createJwtToken(user.Email)
	c.JSON(201, gin.H{"Result": "Login successful", "Token": tokenString})

}

func Reset(c *gin.Context) {
	return
}

func Resister(c *gin.Context) {
	var user models.User

	if err := c.Bind(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	hashAndSalt := hashAndSalt([]byte(user.Password))
	user.Password = hashAndSalt
	db := dbpkg.DBInstance(c)
	if err := db.Create(&user).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	tokenString := createJwtToken(user.Email)
	c.JSON(201, gin.H{"Result": "User created", "Token": tokenString})
}
func hashAndSalt(pwd []byte) string {

	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}
func comparePasswords(hashedPwd string, plainPwd []byte) bool {
	byteHash := []byte(hashedPwd)

	err := bcrypt.CompareHashAndPassword(byteHash, plainPwd)
	if err != nil {
		log.Println(err)
		return false
	}

	return true
}
func createJwtToken(email string) string {
	expirationTime := time.Now().Add(30 * 24 * time.Hour)
	claims := &Claims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// TODO: return err
	// Create the JWT string
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return ""
	}
	return tokenString
}

func vote(c *gin.Context, entity models.EntityWithUser) bool {
	user := middleware.UserInstance(c)
	return user.ID == entity.GetUserId(dbpkg.DBInstance(c))
}
