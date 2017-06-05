var routes = require('express').Router()
var globals = require('./../globals.js')


routes.get('/getAllGroups', function (req, res) {
  console.log(globals.allGroups);
  res.send({groups: globals.allGroups});
})

module.exports = routes;