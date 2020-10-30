const express = require('express');
const path = require('path');
// const https = require('https');
// const http = require('http');
// const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(
//   {
//     key: fs.readFileSync('./private.key'),
//     cert: fs.readFileSync('./certificate.crt'),
//   },
//   app,
// );
//
// httpServer.listen(80, () => {
//   console.log('HTTP Server running on port 80');
// });
//
// httpsServer.listen(443, () => {
//   console.log('HTTPS Server running on port 443');
// });

require("greenlock-express")
  .init({
    packageRoot: __dirname,
    configDir: "./greenlock.d",

    // contact for security and critical bug notices
    maintainerEmail: "anastasiya1155@gmail.com",

    // whether or not to run at cloudscale
    cluster: false
  })
  // Serves on 80 and 443
  // Get's SSL certificates magically!
  .serve(app);
