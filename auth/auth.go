package main

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
)

func main() {
	var jwtKey = []byte("my_awsome_key")
	type AuthResp struct {
		Error bool `json:"error"`
		Code int `json:"code"`
		ErrorMessage string `json:"message"`
		Email string `json:"email"`
	}
	type Claims struct {
		Email string `json:"email"`
		jwt.StandardClaims
	}

	http.HandleFunc("/auth", func(writer http.ResponseWriter, request *http.Request) {
		token := request.FormValue("token")
		var authResp AuthResp
		claims := &Claims{}

		tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil {
			authResp = AuthResp{true,401,"Signature Invalid",""}
			j, _ := json.Marshal(authResp)
			_ , _ = writer.Write(j)
			return
		}
		if !tkn.Valid {
			authResp = AuthResp{true,401,"token is not Valid",""}
			j, _ := json.Marshal(authResp)
			_ , _ = writer.Write(j)
			return
		}

		authResp = AuthResp{false,200,"",claims.Email}
		j, _ := json.Marshal(authResp)
		_ , _ = writer.Write(j)
		return
	})

	err := http.ListenAndServe(":18401", nil)
	if err != nil {
		fmt.Println(err)
	}
}
