'use strict'
angular.module('app')
.service('connectionService', ['$rootScope', '$location', '$http', function ($rootScope, $location, $http) {
  var socket = io();

  var service = {
    getAllGroups: function (obj, cb) {
      $http.get('api/getAllGroups').then(function (response) {
        console.log(response.data.groups);
        cb(obj, response.data.groups);
      });
    },
    on: function (eventName, callback, scope) {
      if(!scope) scope = $rootScope;
      socket.on(eventName, function () {
        var args = arguments;
        scope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }

  }

  return service;
}])