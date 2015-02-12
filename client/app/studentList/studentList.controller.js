/**
 * Created by lynch446 on 2/10/15.
 */

//need to make for js.

'use strict';

angular.module('jsonDataProcessingLabJackMollyLemmonApp')
  .controller('StudentListCtrl', function ($scope, $http, socket) {
    $scope.awesomeStudents = [];

    $http.get('/api/students').success(function(awesomeStudents) {
      $scope.awesomeStudents = awesomeThings;
      socket.syncUpdates('student', $scope.awesomeStudents);
    });

    $scope.addThing = function() {
      if($scope.newStudent === '') {
        return;
      }
      $http.post('/api/students', { name: $scope.newStudent });
      $scope.newStudent = '';
    };

    $scope.deleteThing = function(student) {
      $http.delete('/api/students/' + student._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('student');
    });
  });
