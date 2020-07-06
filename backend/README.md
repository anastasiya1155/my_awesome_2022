# API Server

LOCAL=1 PORT=8822 go run main.go

для постмана спочатку логін
потім реквести з токеном



Simple Rest API using gin(framework) & gorm(orm)

## Endpoint list

### Comments Resource

```
GET    /comments
GET    /comments/:id
POST   /comments
PUT    /comments/:id
DELETE /comments/:id
```

### Labels Resource

```
GET    /labels
GET    /labels/:id
POST   /labels
PUT    /labels/:id
DELETE /labels/:id
```

### Pins Resource

```
GET    /pins
GET    /pins/:id
POST   /pins
PUT    /pins/:id
DELETE /pins/:id
```

### Posts Resource

```
GET    /posts
GET    /posts/:id
POST   /posts
PUT    /posts/:id
DELETE /posts/:id
```

### Tasks Resource

```
GET    /tasks
GET    /tasks/:id
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

server runs at http://localhost:8080
