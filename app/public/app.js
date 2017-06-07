'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('app', ['ngRoute', 'ngMaterial']);

app.run(['$rootScope', function($rootScope) {
    $rootScope.loggedIn = false;
}]);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.when('/home', {
    templateUrl: 'public/pages/home.html',
    resolve: {
      'check': function ($location, $rootScope) {
        if (!$rootScope.loggedIn) {
          $location.path('/login')
        }
      }
    }
  })
  .when('/login', {
    templateUrl: 'public/pages/login.html'
  }).otherwise({redirectTo: '/home'});

}]);

app.factory('appManager', ['$rootScope', function ($rootScope) {
  return {
    update: function () {
      console.log('Updating!');
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    }
  };
}]);
