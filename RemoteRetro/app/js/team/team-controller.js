/* global angular: true, location: true, window: true, document: true */
angular.module('retro.team')
    .controller('TeamController', ['TeamService', function (teamService) {
        var teamId, activeSprintId;
        var ctrl = this;
        ctrl.loading = true;
        ctrl.groupMode = false;

        var getParameterByName = function (name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };
     
        ctrl.userName = getParameterByName('u');
        var teamname = getParameterByName('t');

        ctrl.selectSprint = function(sprint) {
            ctrl.activeSprint = sprint;
            activeSprintId = sprint.SprintId;
        };

        var addPostIt = function (type) {
            teamService.addPostIt(activeSprintId, ctrl.userName, ctrl.postitcomment, type)
                .then(function (response) {
                    ctrl.activeSprint.PostIts.push(response.data);
                    ctrl.postitcomment = '';
                });
        };

        ctrl.removePostIt = function (postItId) {
            var i, indexToRemove;

            for (i = 0; i < ctrl.activeSprint.PostIts.length; i += 1) {
                if (ctrl.activeSprint.PostIts[i].PostItId === postItId) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove) {
                ctrl.activeSprint.PostIts.splice(indexToRemove, 1);
            }
        };

        ctrl.addGoodPostIt = function () {
            addPostIt('good');
        };

        ctrl.addCommentPostIt = function () {
            addPostIt('comment');
        };

        ctrl.addBadPostIt = function () {
            addPostIt('bad');
        };

        ctrl.createSprint = function () {
            teamService.createSprint(teamId, ctrl.newsprint).then(function (response) {
                ctrl.sprints = [response.data].concat(ctrl.sprints);
                ctrl.activeSprint = response.data;
                activeSprintId = ctrl.activeSprint.SprintId;
                ctrl.newsprint = '';
            });
        };
       
        teamService.joinTeam(teamname)
            .then(function (response) {
                teamId = response.data.TeamId;
                ctrl.teamname = response.data.Name;
                ctrl.sprints = response.data.Sprints;
                if (response.data.Sprints.length > 0) {
                    ctrl.activeSprint = response.data.Sprints[0];
                    activeSprintId = response.data.Sprints[0].SprintId;
                }
                ctrl.loading = false;
            });
    }]);


    /*
    ['$scope', 'signalr', '$rootScope', '$sce', function (scope, signalr, rootScope, sce) {
        var getParameterByName = function (name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        var saveToStorage = function () {
            var i = 0;
            if (window.sessionStorage) {
                for (i = 0; i < scope.postits.length; i++) {
                    if (scope.postits[i].$$hashKey) {
                        delete scope.postits[i].$$hashKey;
                    }
                }
                window.sessionStorage.postits = JSON.stringify(scope.postits);
            }
        };

        var getFromStorage = function () {
            return window.sessionStorage && window.sessionStorage.postits ?
                JSON.parse(window.sessionStorage.postits) :
                [];
        };

        scope.postits = getFromStorage();
        scope.username = getParameterByName('u');
        scope.teamname = getParameterByName('t');
        scope.selectedType = 'comment';
        scope.teammates = [scope.username];
        scope.canFlush = function () {
            return scope.postits.length > 0;
        };

        scope.flush = function () {
            window.sessionStorage.removeItem('postits');
            location.reload();
        };

        scope.stickit = function () {
            signalr.addPostIt(scope.teamname, scope.username, scope.selectedType, scope.postitcomment);
            scope.postitcomment = '';
            document.getElementById('postitcomment').focus();
        };

        scope.redorerPostIts = function (fromHash, toHash) {
            if (fromHash !== toHash) {
                scope.$apply(function () {
                    var i, fromPostIt, toPostIt, mergedComment;

                    for (i = 0; i < scope.postits.length; i++) {
                        if (scope.postits[i].hash === fromHash) {
                            fromPostIt = scope.postits[i];
                        }
                        if (scope.postits[i].hash === toHash) {
                            toPostIt = scope.postits[i];
                        }
                    }
                    
                    mergedComment = toPostIt.comment +
                        '<br/><br/>' +
                        '[' + fromPostIt.memberName + '] ' + fromPostIt.comment;
                    
                    signalr.addPostIt(scope.teamname, toPostIt.memberName, toPostIt.type, mergedComment);
                    signalr.removePostIt(scope.teamname, fromHash);
                    signalr.removePostIt(scope.teamname, toHash);
                });
            }
        };
    
        scope.removePostIt = function (hash) {
            signalr.removePostIt(scope.teamname, hash);
        };

        scope.voteUp = function (hash) {
            signalr.voteUp(scope.teamname, hash);
        };

        scope.voteDown = function (hash) {
            signalr.voteDown(scope.teamname, hash);
        };

        signalr.joinRoom(scope.teamname, scope.username);

        rootScope.$on('memberJoined', function (event, data) {
            scope.$apply(function () {
                scope.teammates.push(data);
            });
        });

        rootScope.$on('addPostIt', function (event, data) {
            scope.$apply(function () {
                data.comment = sce.trustAsHtml(data.comment);
                scope.postits.push(data);
                saveToStorage();
            });
        });

        rootScope.$on('removePostIt', function (event, data) {
            scope.$apply(function () {
                var i;

                for (i = 0; i < scope.postits.length; i++) {
                    if (scope.postits[i].hash === data.hash) {
                        scope.postits.splice(i, 1);
                        saveToStorage();
                        break;
                    }
                }
            });
        });

        rootScope.$on('voteUp', function (event, data) {
            scope.$apply(function () {
                var i;
                
                for (i = 0; i < scope.postits.length; i++) {
                    if (scope.postits[i].hash === data.hash) {
                        scope.postits[i].votes++;
                        saveToStorage();
                        break;
                    }
                }
            });
        });

        rootScope.$on('voteDown', function (event, data) {
            scope.$apply(function () {
                var i;

                for (i = 0; i < scope.postits.length; i++) {
                    if (scope.postits[i].hash === data.hash) {
                        scope.postits[i].votes--;
                        saveToStorage();
                        break;
                    }
                }
            });
        });
    }
    ]
    );*/