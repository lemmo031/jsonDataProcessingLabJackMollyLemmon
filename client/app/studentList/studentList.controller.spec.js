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

});
