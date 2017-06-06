'use strict'
var app = angular.module('app')
app.controller('LoginController', ['$rootScope', '$scope', '$location', 'connectionService', 'dataService', function ($rootScope, $scope, $location, concSvc, dataSvc) {
  concSvc.getAllGroups(this, function (obj, data) {
    var names = _.pluck(data, 'name');
    obj.allGroupNames = names;
  });

  concSvc.on('successful join', function (data) {
    $rootScope.loggedIn = true;
    console.log(data);
    dataSvc.loginSetData(data);
    $location.path('/home');
  });

  this.selectGroup = true;
  var steps = ['group', 'username'];
  var stepText = ['Create a username', 'Join!']

  this.groupName = null;
  this.createdGroupName = '';
  this.username = '';
  this.maxNumMembers = 10;

  this.checkPermission = function () {
    if(this.selectGroup) {
      this.canShowUsernameBtn = this.groupName != null;
    } else {
      this.canShowUsernameBtn = this.createdGroupName != '';
    }
  }

  // Need two watchers because either it's trash or I'm trash and I know I'm trash
  this.canShowUsernameBtn = false;
  $scope.$watch(function () {
    return this.groupName;
  }.bind(this), function () {
    if(this.selectGroup) {
      this.canShowUsernameBtn = this.groupName != null;
    }
  }.bind(this))

  $scope.$watch(function () {
    return this.createdGroupName;
  }.bind(this), function () {
    if(!this.selectGroup) {
      this.canShowUsernameBtn = this.createdGroupName != '';
    }
  }.bind(this))

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