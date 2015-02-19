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
          "credits": 2
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
      },
      {
        "course": {
          "name": "Thingy",
          "subject": "CSCI",
          "courseNumber": 2234,
          "credits": 6
        },
        "grade": "F"
      }]};
    expect(scope.GPACalc(student1)).toEqual(1.0);
  });

  it('testing getCreditYear', function(){
    expect(scope.getCreditYear(-5)).toEqual("unknown");
    expect(scope.getCreditYear(0)).toEqual("freshman");
    expect(scope.getCreditYear(29)).toEqual("freshman");
    expect(scope.getCreditYear(30)).toEqual("sophomore");
    expect(scope.getCreditYear(59)).toEqual("sophomore");
    expect(scope.getCreditYear(60)).toEqual("junior");
    expect(scope.getCreditYear(89)).toEqual("junior");
    expect(scope.getCreditYear(90)).toEqual("senior");
    expect(scope.getCreditYear(119)).toEqual("senior");
    expect(scope.getCreditYear(120)).toEqual("senior");
    expect(scope.getCreditYear(300)).toEqual("senior");
  });

  it('testing addInformation', function(){
    var student =
    {
      // "creditYear": "freshman"
      // "gpa": "4.0"
      // "successfullyCompletedCredits": "100"
      "firstName": "Bob",
      "courses": [
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
            "name": "Software Design and Development",
            "subject": "CSCI",
            "courseNumber": 3601,
            "credits": 5
          },
          "grade": "C"
        },
        {
          "course": {
            "name": "PreCalculus I: Functions",
            "subject": "MATH",
            "courseNumber": 1012,
            "credits": 5
          },
          "grade": "F"
        },
        {
          "course": {
            "name": "Beginning Ceramics",
            "subject": "ARTS",
            "courseNumber": 1050,
            "credits": 3
          },
          "grade": "IP"
        }
      ]
    };

    /*
     This should add these fields to the student object:
     creditYear: "freshman"
     gpa: "2.0"
     successfullyCompletedCredits: "10"
     */
    scope.addInformation(student);

    expect(student.creditYear).toEqual("freshman");
    expect(student.gpa).toEqual(2.0);
    expect(student.completedCreditsForList).toEqual(10);
  });

  it('testing compareCredits on identical credits', function(){
    var student1 = {"completedCreditsForList": 20};
    var student2 = {"completedCreditsForList": 20};
    expect(scope.compareCredits(student1, student2)).toEqual(0);
  });

  it('testing compareCredits on different credits', function(){
    var student1 = {"completedCreditsForList": 15};
    var student2 = {"completedCreditsForList": 20};
    expect(scope.compareCredits(student1, student2)).toEqual(-1);
  });

  it('testing compareCredits on different credits', function(){
    var student1 = {"completedCreditsForList": 27};
    var student2 = {"completedCreditsForList": 20};
    expect(scope.compareCredits(student1, student2)).toEqual(1);
  });
  it('testing compareGPA on different grades', function(){
    var student1 = {"gpa": 3.5};
    var student2 = {"gpa": 3.2};
    expect(scope.compareGPA(student1, student2)).toEqual(1);
  });
  it('testing compareGPA on different grades', function(){
    var student1 = {"gpa": 1.4};
    var student2 = {"gpa": 3.2};
    expect(scope.compareGPA(student1, student2)).toEqual(-1);
  });
  it('testing compareGPA on identical', function(){
    var student1 = {"gpa": 2.5};
    var student2 = {"gpa": 2.5};
    expect(scope.compareGPA(student1, student2)).toEqual(0);
  });
  //it('testing compareMajors', function(){
  //  var student1 = {"major1": "ENGLISH", "major2": null};
  //  var student2 = {"major1": "MATH", "major2": null};
  //  expect(scope.compareMajors(student1, student2)).toEqual(-1);
  //});
  //
  //it('testing compareMajors', function(){
  //  var student1 = {"major1": "ZEN", "major2": null};
  //  var student2 = {"major1": "MATH", "major2": null};
  //  expect(scope.compareMajors(student1, student2)).toEqual(1);
  //});
  //
  //it('testing compareMajors', function(){
  //  var student1 = {"major1": null, "major2": null};
  //  var student2 = {"major1": "MATH", "major2": null};
  //  expect(scope.compareMajors(student1, student2)).toEqual(-1); //Maybe?
  //});
  //
  //it('testing compareMajors', function(){
  //  var student1 = {"major1": "MATH", "major2": null};
  //  var student2 = {"major1": null, "major2": null};
  //  expect(scope.compareMajors(student1, student2)).toEqual(1); //Maybe?
  //});
  //
  //it('testing compareMajors', function(){
  //  var student1 = {"major1": "ENGLISH", "major2": null};
  //  var student2 = {"major1": "ENGLISH", "major2": null};
  //  expect(scope.compareMajors(student1, student2)).toEqual(0);
  //});
  //
  //it('testing compareMajors', function(){
  //  var student1 = {"major1": "ENGLISH", "major2": "MATH"};
  //  var student2 = {"major1": "ENGLISH", "major2": "ZEN"};
  //  expect(scope.compareMajors(student1, student2)).toEqual(-1);
  //});
  //
  //it('testing compareMajors', function(){
  //  var student1 = {"major1": "ENGLISH", "major2": "ZEN"};
  //  var student2 = {"major1": "ENGLISH", "major2": "MATH"};
  //  expect(scope.compareMajors(student1, student2)).toEqual(1);
  //});
  //
  //it('testing compareMajors', function(){
  //  var student1 = {"major1": "ENGLISH", "major2": null};
  //  var student2 = {"major1": "ENGLISH", "major2": "ZEN"};
  //  expect(scope.compareMajors(student1, student2)).toEqual(-1);
  //});
  //
  //it('testing compareMajors', function(){
  //  var student1 = {"major1": "ENGLISH", "major2": "MATH"};
  //  var student2 = {"major1": "ENGLISH", "major2": null};
  //  expect(scope.compareMajors(student1, student2)).toEqual(1);
  //});
});
