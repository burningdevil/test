//支持post mock数据
const express = require('express');
//启动expressServer
const expressServer = express();
expressServer.disable("x-powered-by");

const normalizedPath = require("path").join(__dirname, "mock");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  const item = require("./mock/" + file);
  Object.keys(item.default).forEach(key => {
    const keys = key.split(' ');
    const method = keys[0]
    const url = '/api' + keys[1]
    const call = item.default[key]

    if (method === 'GET') {
      expressServer.get(url, call)
    } else if (method === 'POST') {
      expressServer.post(url, call)
    } else if (method === 'DELETE') {
      expressServer.delete(url, call)
    }
  })
});

expressServer.listen('3005', function () {
  console.log('mock app listening at http://localhost:3005');
});