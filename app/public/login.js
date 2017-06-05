'use strict'
var app = angular.module('app')
app.controller('LoginController', ['$rootScope', '$location', 'connectionService', function ($rootScope, $location, concSvc) {
  concSvc.getAllGroups(this, function (obj, data) {
    var names = _.pluck(data, 'name');
    obj.allGroupNames = names;
  });

  concSvc.on('successful join', function () {
    $rootScope.loggedIn = true;
    $location.path('/home');
  });

  this.selectGroup = true;
  var steps = ['group', 'username'];
  var stepText = ['Create a username', 'Join!']

  this.groupName;
  this.createdGroupName;
  this.username;
  this.maxNumMembers = 10;

  this.currentStep = steps[0];
  this.currentStepText = stepText[0];

  this.nextStep = function () {
    var nextNum = steps.indexOf(this.currentStep) + 1;
    if (nextNum < steps.length) {
      this.currentStep = steps[nextNum];
      this.currentStepText = stepText[nextNum];
    } else {
      if (this.selectGroup){
        // Submit this client to join this group
        var data = {groupName: this.groupName, username: this.username};
        concSvc.emit('join group', data);
      } else {
        // Creating a new group
        var data = {groupName: this.createdGroupName, username: this.username, maxNumMembers: this.maxNumMembers};
        concSvc.emit('create group', data);
      }
    }
  }

}])