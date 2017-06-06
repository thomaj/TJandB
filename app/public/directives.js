'use strict'

angular.module('app')
.directive('musicQueue', [function () {
  return {
    restrict: 'E',
    templateUrl: 'public/pages/musicQueue.html',
    controller: ['connectionService', 'dataService', function (concSvc, dataSvc) {
      this.currentSong = null;
      this.queuedSongs = [];

      // Set up event handlers --------------------
      concSvc.on('track added', function (data) {

      });

      concSvc.on('track removed', function (data) {

      });

      concSvc.on('track updated', function (data) {

      });

      dataSvc.onQueuedSongsChange.watch('musicQueue', function (data) {
        data.queuedSongs = data.group.musicQueue
      })

    }],
    controllerAs: 'music'
  }



}])
.directive('groupStats', [function () {
  return {
    restrict: 'E',
    templateUrl: 'public/pages/groupStats.html',
    controller: ['$scope', 'connectionService', 'dataService', function ($scope, concSvc, dataSvc) {
      this.group = 'Nothing';

      // Set up event handlers --------------------
      concSvc.on('group update', function (data) {
        this.group = data
        console.log('Group was updated')
        console.log(data)
      }, $scope);

    }],
    controllerAs: 'g'
  }
}])
.directive('musicStats', [function () {

}])