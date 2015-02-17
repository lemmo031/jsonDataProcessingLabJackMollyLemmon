/**
 * Created by lynch446 on 2/10/15.
 */

//need to make for js.

'use strict';

angular.module('jsonDataProcessingLabJackMollyLemmonApp')
  .controller('StudentListCtrl', function ($scope, $http, socket) {

    $scope.awesomeStudents = [];

    $scope.lastNameSort = function(){
      var newAwesomeArray = [];
      var i = 0;
      var j = 0;
      var stud = $scope.awesomeStudents[0].lastName;
      for(i = 0; i < $scope.awesomeStudents.length; i++){
        if ($scope.awesomeStudents[i].lastName < stud){
          stud = $scope.awesomeStudents[i].lastName
        }
      }
      return stud;
    };


    $scope.convertToGradeNumber = function(grade){
      grade.toString();
      switch (grade){
        case "A":
              return 4.0;
        case "A-":
              return 3.7;
            break;
        case "B+":
              return 3.33;
        case "B":
              return 3.0;
        case "B-":
              return 2.7;
        case "C+":
              return 2.3;
        case "C":
              return 2.0;
        case "C-":
              return 1.7;
        case "D+":
              return 1.3;
        case "D":
              return 1.0;
        case "D-":
              return 0.7;
        default:
              return 0;
      }
    };
    $scope.GPACalc = function(student){
      var gpa = 0;
      var i = 0;
      var totalCredits = 0;
      var totalGradePoint = 0;
      for (i = 0; i < student.courses.length; i++){
        totalCredits =  totalCredits + student.courses[i].course.credits;
        totalGradePoint = totalGradePoint + (student.courses[i].course.credits * $scope.convertToGradeNumber(student.courses[i].grade));
      }
      gpa = totalGradePoint / totalCredits;
      return gpa;
    };

    $scope.successCompletedCredits = function(student){
      var totalCredits = 0;
      var i = 0;
      for (i = 0; i < student.courses.length; i++){
        if (student.courses[i].grade != "F" || student.courses[i].grade != "IP") {
          totalCredits = totalCredits + student.courses[i].course.credits;
        }
      }
      return totalCredits;
    };

    $http.get('/api/students').success(function(awesomeStudents) {
      $scope.awesomeStudents = awesomeStudents;
      $scope.awesomeStudents.sort($scope.compareName);
      console.log("Hello There");
      socket.syncUpdates('student', $scope.awesomeStudents);
    });

    //$scope.addThing = function() {
    //  if($scope.newStudent === '') {
    //    return;
    //  }
    //  $http.post('/api/students', { firstName: $scope.newStudent });
    //  $scope.newStudent = '';
    //};
    //
    //$scope.deleteThing = function(student) {
    //  $http.delete('/api/students/' + student._id);
    //};

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('student');
    });


    $scope.compareName = function(student1, student2) {
      var lastNameComparison = student1.lastName.localeCompare(student2.lastName);
      if (lastNameComparison == 0) {
        return student1.firstName.localeCompare(student2.firstName);
      }
      return lastNameComparison;
    }

    // Implement this soon.
    //$scope.compareLastNameThenFirstName = function(student1, student2) {
    //  var lastNameComparison
    //  return student1.lastName.localeCompare(student2.lastName);
    //}
  });
