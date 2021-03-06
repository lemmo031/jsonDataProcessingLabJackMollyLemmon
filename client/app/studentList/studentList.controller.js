/**
 * Created by lynch446 on 2/10/15.
 */

//need to make for js.

'use strict';

angular.module('jsonDataProcessingLabJackMollyLemmonApp')
  .controller('StudentListCtrl', function ($scope, $http, socket) {

    $scope.awesomeStudents = [];

    //unique student for detailed information.
    $scope.ourUniqueStudent = $scope.awesomeStudents[0];

    //function for changing our unique student
    $scope.changeUnique = function(student){
      $scope.ourUniqueStudent = student;
    };

    //counting credits different ways
    $scope.notInProgress = function(grade) {
      return grade != "IP";
    };

    $scope.isSuccessfullyCompleted = function(grade) {
      return grade != "F" && grade != "IP";
    };

    $scope.countCredits = function(student, testingFunction) {
      var totalCredits = 0;
      for (var i = 0; i < student.courses.length; i++){
        var currentCourse = student.courses[i];
        if (testingFunction(currentCourse.grade)) {
          totalCredits += currentCourse.course.credits;
        }
      }
      return totalCredits;
    };

    $scope.attemptedCredits = function(student) {
      return($scope.countCredits(student, $scope.notInProgress));
    };

    $scope.successfullyCompletedCredits = function(student) {
      return($scope.countCredits(student, $scope.isSuccessfullyCompleted));
    };


    //GPA Calculator
    $scope.GPACalc = function(student) {
      var gpa = 0;
      var totalCredits = $scope.attemptedCredits(student);
      var totalGradePoint = 0;
      for (var i = 0; i < student.courses.length; i++){
        if ($scope.notInProgress(student.courses[i].grade)) {
          var thisGradeNumber = $scope.convertToGradeNumber(student.courses[i].grade);
          var theseCredits = student.courses[i].course.credits;
          var addedGradePoint = (thisGradeNumber * theseCredits);
          totalGradePoint += addedGradePoint;
        }
      }
      gpa = totalGradePoint / totalCredits;
      return gpa;
    };

    $scope.convertToGradeNumber = function(grade) {
      grade.toString();
      switch (grade){
        case "A":
          return 4.0;
        case "A-":
          return 3.667;
          break;
        case "B+":
          return 3.333;
        case "B":
          return 3.0;
        case "B-":
          return 2.667;
        case "C+":
          return 2.333;
        case "C":
          return 2.0;
        case "C-":
          return 1.667;
        case "D+":
          return 1.333;
        case "D":
          return 1.0;
        default:
          return 0;
      }
    };

    //sorting calls
    $scope.sortName = function() {
      console.log("Sorting by name.");
      $scope.awesomeStudents.sort($scope.compareName);
    };

    $scope.sortBirth = function() {
      console.log("Sorting by date of birth.");
      $scope.awesomeStudents.sort($scope.compareDateOfBirth);
    };

    $scope.sortCredits = function() {
      console.log("Sorting by credits.");
      $scope.awesomeStudents.sort($scope.compareCredits);
    };

    $scope.sortGPA = function() {
      console.log("Sorting by GPA");
      $scope.awesomeStudents.sort($scope.compareGPA);
    };

    $scope.sortMajor = function() {
      console.log("Sorting by major.");
      $scope.awesomeStudents.sort($scope.compareMajors);
    };

    $scope.displayMajor1 = function(student) {
      if (student.major1 == null){
        return "UNDECIDED";
      }
      return student.major1;
    };

    $scope.displayMajor2 = function(student) {
      if (student.major2 == null){
        return "";
      }
      return "Major 2: " + student.major2 + ".";
    };

    //made alphabetical standard from opening page.
    $http.get('/api/students').success(function(awesomeStudents) {
      $scope.awesomeStudents = awesomeStudents;
      $scope.addAllInformation();
      $scope.sortName();
      console.log("Getting information from database.");
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

    //comparisons for sorts
    $scope.compareName = function(student1, student2) {
      var lastNameComparison = $scope.compareStrings(student1.lastName, student2.lastName);
      if (lastNameComparison == 0) {
        return $scope.compareStrings(student1.firstName, student2.firstName);
      }
      return lastNameComparison;
    };

    $scope.compareDateOfBirth = function(student1, student2) {
      var student1DateOfBirth = new Date(student1.dateOfBirth);
      var student2DateOfBirth = new Date(student2.dateOfBirth);
      if (student1DateOfBirth < student2DateOfBirth) {
        return -1;
      } else if (student1DateOfBirth > student2DateOfBirth) {
        return 1;
      } else {
        return 0;
      }
    };

    $scope.compareMajors = function(student1, student2) {
      var major1Comparison = $scope.compareStrings(student1.major1, student2.major1);
      if (major1Comparison == 0) {
        return $scope.compareStrings(student1.major2, student2.major2);
      }
      return major1Comparison;
    };

    $scope.compareStrings = function(string1, string2) {
      if (string1 == null && string2 == null) {
        return 0;
      } else if (string1 == null && string2 != null) {
        return 1;
      } else if (string1 != null && string2 == null){
        return -1;
      } else if (string1 < string2) {
        return -1;
      } else if (string1 > string2) {
        return 1;
      } else {
        return 0;
      }
    };

    $scope.compareCredits = function(student1, student2) {
      var student1Credits = student1.completedCreditsForList;
      var student2Credits = student2.completedCreditsForList;
      if (student1Credits < student2Credits) {
        return -1;
      } else if (student1Credits > student2Credits) {
        return 1;
      } else {
        return 0;
      }
    };

    $scope.compareGPA = function(student1, student2) {
      var student1GPA = student1.gpa;
      var student2GPA = student2.gpa;
      if (student1GPA < student2GPA) {
        return -1;
      } else if (student1GPA > student2GPA) {
        return 1;
      } else {
        return 0;
      }
    };

    $scope.getCreditYear = function(successfulCredits) {
      if (successfulCredits < 0) {
        return "unknown";
      } else if (0 <= successfulCredits && successfulCredits < 30) {
        return "freshman";
      } else if (30 <= successfulCredits && successfulCredits < 60) {
        return "sophomore";
      } else if (60 <= successfulCredits && successfulCredits < 90) {
        return "junior";
      } else if (90 <= successfulCredits) {
        return "senior";
      }
    };

    $scope.addInformation = function(student) {
      student.gpa = $scope.GPACalc(student);
      student.completedCreditsForList = $scope.successfullyCompletedCredits(student);
      student.creditYear = $scope.getCreditYear(student.completedCreditsForList);
    };

    $scope.addAllInformation = function() {
      for (var i = 0; i < $scope.awesomeStudents.length; i++){
        $scope.addInformation($scope.awesomeStudents[i]);
      }
      console.log("Updating student information.");
    }
  });
