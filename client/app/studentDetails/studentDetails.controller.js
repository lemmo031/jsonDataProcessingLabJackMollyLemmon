/**
 * Created by grove266 on 2/12/15.
 */

'use strict';

angular.module('jsonDataProcessingLabJackMollyLemmonApp')
  .controller('StudentDetailsCtrl', function ($scope, $http, socket) {
    $scope.awesomeStudents = [];



    $http.get('/api/students').success(function(awesomeStudents) {
      $scope.awesomeStudents = awesomeStudents;
      socket.syncUpdates('student', $scope.awesomeStudents);
    });

    //$scope.addStudent = function() {
    //  if($scope.newStudent === '') {
    //    return;
    //  }
    //  $http.post('/api/students', { name: $scope.newStudent });
    //  $scope.newStudent = '';
    //};
    //
    //$scope.deleteStudent = function(student) {
    //  $http.delete('/api/students/' + student._id);
    //};

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('student');
    });
  });
