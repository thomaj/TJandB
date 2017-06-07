'use strict'
angular.module('app')
.service('connectionService', ['$location', '$http', 'appManager', function ($location, $http, appManager) {
  var socket = io();

  var service = {
    getAllGroups: function (obj, cb) {
      $http.get('api/getAllGroups').then(function (response) {
        console.log(response.data.groups);
        cb(obj, response.data.groups);
      });
    },
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        callback.apply(socket, args);
        appManager.update();
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        if (callback) {
          callback.apply(socket, args);
        }
        appManager.update();
      });
    }

  }

  return service;
}])