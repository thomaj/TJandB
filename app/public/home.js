'use strict'
angular.module('app')
.controller('HomeController', ['$scope', '$mdDialog', 'connectionService', function ($scope, $mdDialog, concSvc) {
  $scope.playingAudio = false
  this.username = 'Sam';

  this.showConfirm = function (ev) {
    var confirm = $mdDialog.confirm()
      .title('Let your music be heard!')
      .textContent('Are you sure you want to play music through this computer?')
      .targetEvent(ev)
      .ok('Sure am!')
      .cancel('Nevermind')

    $mdDialog.show(confirm).then(function() {
      // Play music through speakers
      $scope.playingAudio = true;
    }, function () {

    });
  }


  this.toggleAudio = function (ev) {
    if (!$scope.playingAudio) {
      this.showConfirm(ev);
    } else {
      $scope.playingAudio = false
    }
  }
}])