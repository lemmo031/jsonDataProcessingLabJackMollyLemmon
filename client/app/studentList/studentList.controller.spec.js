/**
 * Created by lynch446 on 2/10/15.
 */

'use strict';

//=== Testing StudentListCtrl =============================================
describe('Testing controller: StudentListCtrl', function(){

  // load the controller's module
 beforeEach(module('jsonDataProcessingLabJackMollyLemmonApp'));
 beforeEach(module('socketMock'));

 var StudentListCtrl, scope, $httpBackend;

 // Initialize the controller and mock scope.
 beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {
   $httpBackend = _$httpBackend_;
   $httpBackend.expectGET('/api/students')
     .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    scope = $rootScope.$new();
    StudentListCtrl = $controller('StudentListCtrl', {
      $scope: scope
    });
 }));

  it('testing compareName on people with identical last names', function(){
    var student1 = {"firstName": "Love",
      "lastName": "Roberts"};
    var student2 = {"firstName": "Olaf",
      "lastName": "Roberts"};
    expect(scope.compareName(student1, student2)).toEqual(-1);
  });

  it('testing compareName on people with identical names', function(){
    var student1 = {"firstName": "Love",
      "lastName": "Roberts"};
    var student2 = {"firstName": "Love",
      "lastName": "Roberts"};
    expect(scope.compareName(student1, student2)).toEqual(0);
  });

  it('testing compareDateOfBirth on identical dates', function(){
    var student1 = {"dateOfBirth": "1989-01-18"};
    var student2 = {"dateOfBirth": "1989-01-18"};
    expect(scope.compareDateOfBirth(student1, student2)).toEqual(0);
  });

  it('testing compareDateOfBirth when first argument is lesser than the second', function(){
    var student1 = {"dateOfBirth": "1920-01-18"};
    var student2 = {"dateOfBirth": "1989-12-31"};
    expect(scope.compareDateOfBirth(student1, student2)).toEqual(-1);
  });

  it('testing compareDateOfBirth when first argument is greater than the second', function(){
    var student1 = {"dateOfBirth": "1989-12-31"};
    var student2 = {"dateOfBirth": "1920-01-18"};
    expect(scope.compareDateOfBirth(student1, student2)).toEqual(1);
  });

  it('testing convertToGradeNumber', function(){
    expect(scope.convertToGradeNumber("A")).toEqual(4.0);
    expect(scope.convertToGradeNumber("A-")).toEqual(3.667);
    expect(scope.convertToGradeNumber("B+")).toEqual(3.333);
    expect(scope.convertToGradeNumber("B")).toEqual(3.0);
    expect(scope.convertToGradeNumber("B-")).toEqual(2.667);
    expect(scope.convertToGradeNumber("C+")).toEqual(2.333);
    expect(scope.convertToGradeNumber("C")).toEqual(2.0);
    expect(scope.convertToGradeNumber("C-")).toEqual(1.667);
    expect(scope.convertToGradeNumber("D+")).toEqual(1.333);
    expect(scope.convertToGradeNumber("D")).toEqual(1.0);
    expect(scope.convertToGradeNumber("F")).toEqual(0);
    expect(scope.convertToGradeNumber("IP")).toEqual(0);

    // Just returns 0 for unknown values or lowercase grades
    expect(scope.convertToGradeNumber("WooHoo")).toEqual(0);
    expect(scope.convertToGradeNumber("a")).toEqual(0);
  });

  it('testing successfullyCompletedCredits', function(){
    var student1 =
    {"courses": [
      {
        "course": {
          "name": "Models of Computing Systems",
          "subject": "CSCI",
          "courseNumber": 3401,
          "credits": 5
        },
        "grade": "A"
      }]};
    expect(scope.successfullyCompletedCredits(student1)).toEqual(5);
  });

  it('testing successfullyCompletedCredits with IP', function(){
    var student1 =
    {"courses": [
      {
        "course": {
          "name": "Models of Computing Systems",
          "subject": "CSCI",
          "courseNumber": 3401,
          "credits": 5
        },
        "grade": "A"
      },
      {
        "course": {
          "name": "Other",
          "subject": "CSCI",
          "courseNumber": 3434,
          "credits": 8
        },
        "grade": "IP"
      }]};
    expect(scope.successfullyCompletedCredits(student1)).toEqual(5);
  });

  it('testing successfullyCompletedCredits with F', function(){
    var student1 =
    {"courses": [
      {
        "course": {
          "name": "Models of Computing Systems",
          "subject": "CSCI",
          "courseNumber": 3401,
          "credits": 3
        },
        "grade": "A"
      },
      {
        "course": {
          "name": "Other",
          "subject": "CSCI",
          "courseNumber": 3434,
          "credits": 8
        },
        "grade": "F"
      }]};
    expect(scope.successfullyCompletedCredits(student1)).toEqual(3);
  });

  it('testing attemptedCredits with F', function(){
    var student1 =
    {"courses": [
      {
        "course": {
          "name": "Models of Computing Systems",
          "subject": "CSCI",
          "courseNumber": 3401,
          "credits": 3
        },
        "grade": "A"
      },
      {
        "course": {
          "name": "Other",
          "subject": "CSCI",
          "courseNumber": 3434,
          "credits": 8
        },
        "grade": "F"
      }]};
    expect(scope.attemptedCredits(student1)).toEqual(11);
  });

  it('testing attemptedCredits with IP', function(){
    var student1 =
    {"courses": [
      {
        "course": {
          "name": "Models of Computing Systems",
          "subject": "CSCI",
          "courseNumber": 3401,
          "credits": 4
        },
        "grade": "A"
      },
      {
        "course": {
          "name": "Other",
          "subject": "CSCI",
          "courseNumber": 3434,
          "credits": 2
        },
        "grade": "IP"
      }]};
    expect(scope.attemptedCredits(student1)).toEqual(4);
  });

  it('testing notInProgress', function(){
    expect(scope.notInProgress("A")).toEqual(true);
    expect(scope.notInProgress("F")).toEqual(true);
    expect(scope.notInProgress("IP")).toEqual(false);
  });

  it('testing isSuccessfullyCompleted', function(){
    expect(scope.isSuccessfullyCompleted("B")).toEqual(true);
    expect(scope.isSuccessfullyCompleted("F")).toEqual(false);
    expect(scope.isSuccessfullyCompleted("IP")).toEqual(false);
  });

  it('testing countCredits with IP and notInProgress', function(){
    var student1 =
    {"courses": [
      {
        "course": {
          "name": "Models of Computing Systems",
          "subject": "CSCI",
          "courseNumber": 3401,
          "credits": 4
        },
        "grade": "A"
      },
      {
        "course": {
          "name": "Other",
          "subject": "CSCI",
          "courseNumber": 3434,
          "credits": 2
        },
        "grade": "IP"
      }]};
    expect(scope.countCredits(student1, scope.notInProgress)).toEqual(4);
  });


  it('testing GPACalc', function(){
    var student1 =
    {"courses": [
      {
        "course": {
          "name": "Models of Computing Systems",
          "subject": "CSCI",
          "courseNumber": 3401,
          "credits": 4
        },
        "grade": "A"
      },
      {
        "course": {
          "name": "Other",
          "subject": "CSCI",
          "courseNumber": 3434,
          "credits": 2
        },
        "grade": "IP"
      }]};
    expect(scope.GPACalc(student1)).toEqual(4.0);
  });

});
