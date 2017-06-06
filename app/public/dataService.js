'use strict'
angular.module('app')
.service('dataService', ['connectionService', function (concSvc) {
  this.user = {};
  this.group = [];
  this.playedSongs = [];
  this.queuedSongs = [];

  concSvc.on('user update', function (data) {
    this.user = data;
    this.service.onUserChange.fire(data);
  })

  // concSvc.on('group update', function (data) {
  //   console.log('Group updated')
  //   console.log(data)
  //   this.group = data;
  //   this.onGroupChange.fire(data);
  // })

  concSvc.on('track update', function (data) {
    this.queuedSongs = data
    service.onQueuedSongs.fire(data);
  })

  var service = {
    onUserChange: new eventHandler(),
    onGroupChange: new eventHandler(),
    onPlayedSongsChange: new eventHandler(),
    onQueuedSongsChange: new eventHandler(),
    loginSetData: function (data) {
      this.user = data.user;
      this.group = data.group;
      this.queuedSongs = data.group.musicQueue;
    },
    setUserInfo: function (data) {
      this.user = data;
    },
    userInfo: function () {
      return this.user
    },
    setGroupInfo: function (data) {
      this.group = data
    },
    groupInfo: function () {
      return this.group;
    }
  }

  return service;
}])