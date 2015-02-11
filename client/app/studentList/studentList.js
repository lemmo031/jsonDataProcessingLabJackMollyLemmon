/**
 * Created by lynch446 on 2/10/15.
 */

//get rid of main and eventually convert to studentList.

'use strict';

angular.module('jsonDataProcessingLabJackMollyLemmonApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });
