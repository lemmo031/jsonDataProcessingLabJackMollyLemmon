/**
 * Created by lynch446 on 2/10/15.
 */
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
