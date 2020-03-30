package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	//"github.com/vova/m2019/backend/models"
	//"google.golang.org/grpc"
	//"log"
	"net/http"
	//"time"
	//
	//"context"
	//pb "google.golang.org/grpc/examples/helloworld/helloworld"
	//dbpkg "github.com/vova/m2019/backend/db"
)

const (
	address = "localhost:50051"
)

func GetPlayer(context *gin.Context) {

	id := context.Params.ByName("id")
	link := fmt.Sprintf("intennis_player_%s", id)
	fmt.Println(link)

	c, _ := redis.Dial("tcp", ":6379")

	defer c.Close()
	s, _ := redis.Bytes(c.Do("GET", link))

	context.Data(http.StatusOK, "text/html; charset=windows-1251", s)

}

func GetChamp(context *gin.Context) {

	id := context.Params.ByName("id")
	link := fmt.Sprintf("intennis_champ_%s", id)
	fmt.Println(link)

	c, _ := redis.Dial("tcp", ":6379")

	defer c.Close()
	s, _ := redis.Bytes(c.Do("GET", link))

	context.Data(http.StatusOK, "text/html; charset=windows-1251", s)

}

//func PostPhoto(gContext *gin.Context)  {
//	file, _ := gContext.FormFile("file")
//
//	uploadTo := "/Users/mac/go/src/github.com/vova/m2019/backend/bUPL.jpg"
//	outputFile := "/Users/mac/go/src/github.com/vova/m2019/backend/bUPL_500x500.jpg"
//	gContext.SaveUploadedFile(file, uploadTo)
//
//
//	// Set up a connection to the server.
//	conn, err := grpc.Dial(address, grpc.WithInsecure())
//	if err != nil {
//		log.Fatalf("did not connect: %v", err)
//	}
//	defer conn.Close()
//	c := pb.NewImgageResizerClient(conn)
//
//	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
//	defer cancel()
//	r, err := c.Resize(ctx, &pb.ResizeRequest{
//		Width: 500,
//		Height:500,
//		Format:"jpg",
//		Input:uploadTo,
//		Output:outputFile,
//		Resize: true,
//	})
//	if err != nil {
//		log.Fatalf("could not greet: %v", err)
//	}
//	log.Printf("Greeting: %s", r)
//
//	db := dbpkg.DBInstance(gContext)
//	photo := models.Photo{
//		Path:outputFile,
//		Date:time.Now(),
//	}
//	if err := db.Create(&photo).Error; err != nil {
//		gContext.JSON(400, gin.H{"error": err.Error()})
//		return
//	}
//
//
//
//	gContext.JSON(201, photo)
//}
