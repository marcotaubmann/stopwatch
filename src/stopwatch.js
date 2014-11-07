angular.module('stopwatchApp', [])
  .controller('StopwatchController', function($scope, $interval) {
    $scope.reverse = false;
    $scope.predicate = 'start';
    $scope.order = 'start';

    $scope.reset = function () {
      $scope.isRunning = false;
      $scope.starttime = null;
      $scope.currentLap = null;
      $scope.laps = [];
      $scope.displaytime = 0;
    }

    $scope.start = function () {
      $scope.reset ();
      $scope.starttime = new Date ();
      $scope.isRunning = true;
      $scope.currentLap = {
        id: 1,
        start: $scope.starttime,
        stop: $scope.starttime
      };
      $scope.laps.push($scope.currentLap);

      $scope.updateDisplaytime ();
      $interval (function () {
        $scope.updateDisplaytime ();
      }, 100);
    };

    $scope.lap = function () {
      var lapstop = new Date ();
      $scope.currentLap.stop = lapstop;
      $scope.currentLap =  {
        id: $scope.laps.length + 1,
        start: lapstop,
        stop: lapstop
      };
      $scope.laps.push($scope.currentLap);
    }

    $scope.stop = function () {
      var lapstop = new Date ();
      $scope.currentLap.stop = lapstop;

      $scope.isRunning = false;
      clearInterval ($scope.interval);
      $scope.updateDisplaytime ();
    };

    $scope.updateDisplaytime = function () {
      if ($scope.isRunning) {
        $scope.displaytime = new Date () ;
        $scope.currentLap.stop = $scope.displaytime;
      } else {
        $scope.displaytime = $scope.currentLap.stop;
      }
    };

    $scope.orderBy = function (order) {
      if (order == $scope.order) {
        $scope.reverse = ! $scope.reverse;
      } else {
        $scope.order = order;
        switch (order) {
          case 'lap':
            $scope.predicate = 'stop-start';
            break;
          default :
            $scope.reverse = false;
            $scope.predicate = 'start';
            break;
        }
      }
    }
 
    $scope.reset ();
  });