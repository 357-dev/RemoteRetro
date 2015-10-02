/* global angular: true, console: true */
var module = angular.module('retro.postit');
module.directive('postit', ['PostItService',
    function (postItService) {
        return {
            restrict: 'EA',
            scope: {
                postItId: '=',
                comment: '=',
                type: '=',
                memberName: '=',
                myName: '=',
                votes: '=',
                removePostIt: '=',
                action: '=',
                groupMode: '=',
                groupSelected: '='
            },
            templateUrl: '/app/js/post-it/postit-template.html',
            replace: true,
            link: function (scope) {
                scope.actionFormVisible = scope.action;
                scope.isMyPostIt = scope.memberName === scope.myName;

                scope.numberOfVotes = function () {
                    return scope.votes && scope.votes.split('|').length - 1;
                };

                scope.IHaveVotedUp = function () {
                    return scope.votes && scope.votes.indexOf(scope.myName) > 0;
                };

                scope.toggleAction = function () {
                    scope.actionFormVisible = !scope.actionFormVisible;
                    if (!scope.actionFormVisible) {
                        scope.action = '';
                        postItService.addAction(scope.postItId, scope.action);
                    }
                };

                scope.addAction = function () {
                    postItService.addAction(scope.postItId, scope.action).then(function (response) {
                        scope.action = response.data;
                    });
                };

                scope.tryRemovePostIt = function () {
                    scope.removePostIt(scope.postItId);
                };

                scope.voteUp = function () {
                    postItService.votePostItUp(scope.postItId, scope.myName).then(function (response) {
                        scope.votes = response.data;
                    });
                };

                scope.voteDown = function () {
                    postItService.votePostItDown(scope.postItId, scope.myName).then(function (response) {
                        scope.votes = response.data;
                    });
                };

                scope.toggleGroupSelect = function () {
                    scope.groupSelected = !scope.groupSelected;
                };
            }
        };
    }
]);