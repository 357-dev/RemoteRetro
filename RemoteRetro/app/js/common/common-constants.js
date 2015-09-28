/* global angular:true */
(function () {
    'use strict';

    var app = angular.module('retro.common');
    app.constant('retroapi', {
        'joinTeam': '/api/retrospectiveapi/jointeam/',
        'createSprint': '/api/retrospectiveapi/createsprint/',
        'addPostIt': '/api/retrospectiveapi/addPostIt/',
        'removePostIt': '/api/retrospectiveapi/removePostIt/',
        'votePostItUp': '/api/retrospectiveapi/votePostItUp/',
        'votePostItDown': '/api/retrospectiveapi/votePostItDown/',
        'addAction': '/api/retrospectiveapi/addAction/'
    });
})();