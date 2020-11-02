const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

require("greenlock-express")
  .init({
    // where to find .greenlockrc and set default paths
    packageRoot: __dirname,

    // where config and certificate stuff go
    configDir: "./greenlock.d",

    // contact for security and critical bug notices
    maintainerEmail: "anastasiya1155@gmail.com",

    // name & version for ACME client user agent
    //packageAgent: pkg.name + "/" + pkg.version,

    // whether or not to run at cloudscale
    cluster: false
  })
  .serve(app);
