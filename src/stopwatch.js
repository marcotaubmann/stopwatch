angular.module('stopwatchApp', [])

  .filter ('duration', ['dateFilter', function (dateFilter) {
    return function (input, format, timezone) {
      if (typeof input != 'number'){
        return input;
      }
      if (typeof format != 'string') {
        format = 'HH:mm:ss.sss';
      }
      var offsetHours = parseInt (dateFilter (input, 'Z'))/100;
      var offsetMs = offsetHours * 60 * 60 * 1000;
      var duration = input - offsetMs;
      var out = dateFilter (duration, format, timezone);

      return out;
    };
  }])

  .controller('StopwatchController', ['$scope', '$interval', function($scope, $interval) {
    $scope.reverse = false;
    $scope.predicate = 'start';
    $scope.order = 'start';

    ($scope.reset = function () {
      $scope.isRunning = false;
      $scope.starttime = null;
      $scope.currentLap = null;
      $scope.currentPause = null;
      $scope.laps = [];
      $scope.pauses = [];
      $scope.displaytime = 0;
      $scope.pauseDuration = 0;
      $scope.lapPauseDuration = 0;
    })();

    $scope.updateCurrentLap = function (stoptime) {
      $scope.currentLap.stop = stoptime;
      $scope.currentLap.lap = stoptime - $scope.currentLap.start - $scope.lapPauseDuration;
      $scope.currentLap.total = stoptime - $scope.starttime - $scope.pauseDuration;
    }

    $scope.startDisplayUpdate = function () {
      $scope.interval = $interval (function () {
        $scope.updateDisplaytime ();
      }, 100);
    }

    $scope.stopDisplayUpdate = function () {
      $interval.cancel ($scope.interval);
      $scope.updateDisplaytime ();
    }

    $scope.start = function () {
      $scope.starttime = new Date ();
      $scope.isRunning = true;
      $scope.currentLap = {
        id: 1,
        start: $scope.starttime,
        stop: $scope.starttime,
        lap: 0,
        total: 0
      };
      $scope.laps.push($scope.currentLap);

      $scope.startDisplayUpdate ();
    };

    $scope.resume = function () {
      var resumetime = new Date ();
      $scope.currentPause.stop = resumetime;
      var thisPauseDuration = $scope.currentPause.stop - $scope.currentPause.start;
      $scope.pauses.push ($scope.currentPause);
      $scope.pauseDuration += thisPauseDuration;
      $scope.lapPauseDuration += thisPauseDuration;

      $scope.startDisplayUpdate ();
      $scope.isRunning = true;
    }

    $scope.lap = function () {
      var lapstop = new Date ();
      $scope.updateCurrentLap (lapstop);
      $scope.currentLap =  {
        id: $scope.laps.length + 1,
        start: lapstop,
        stop: lapstop,
        lap: 0,
        total: lapstop - $scope.starttime - $scope.pauseDuration

      };
      $scope.lapPauseDuration = 0;
      $scope.laps.push($scope.currentLap);
    }

    $scope.stop = function () {
      var lapstop = new Date ();
      $scope.updateCurrentLap (lapstop);
      $scope.currentPause = {
        start: lapstop,
        stop: lapstop,
      };

      $scope.isRunning = false;
      $scope.stopDisplayUpdate ();
    };

    $scope.updateDisplaytime = function () {
      if ($scope.isRunning) {
        var updatetime = new Date ();
        $scope.displaytime = updatetime;
        $scope.updateCurrentLap (updatetime);
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

    $scope.keyup = function ($event) {
      if ($event.keyCode == '13') { // enter
        if ($scope.isRunning) {
          return $scope.stop ();
        } else if (! $scope.laps.length) {
          return $scope.start ();
        } else {
          return $scope.resume ();
        }
      } else if ($event.keyCode == '32') { //spacebar
        if ($scope.isRunning) {
          return $scope.lap ();
        } else if (! $scope.laps.length) {
          return $scope.start ();
        } else {
          return $scope.resume ();
        }
      } else if ($event.keyCode == '8') { //backspace
        if (! $scope.isRunning) {
          return $scope.reset ();
        }
      }
    }

  }]);

