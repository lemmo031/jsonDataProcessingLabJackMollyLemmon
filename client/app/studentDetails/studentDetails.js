/**
 * Created by grove266 on 2/12/15.
 */

'use strict';

angular.module('jsonDataProcessingLabJackMollyLemmonApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('studentDetails', {
        url: '/studentDetails',
        templateUrl: 'app/studentDetails/studentDetails.html',
        controller: 'StudentDetailsCtrl'
      });
  });
