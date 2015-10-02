/* global angular: true, location: true, window: true, document: true */
angular.module('retro.team')
    .controller('TeamController', ['TeamService', '$q', function (teamService, $q) {
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

        ctrl.selectSprint = function (sprint) {
            ctrl.activeSprint = sprint;
            activeSprintId = sprint.SprintId;
        };

        var addPostIt = function (activeSprintId, userName, postitcomment, type) {
            teamService.addPostIt(activeSprintId, userName, postitcomment, type)
                .then(function (response) {
                    ctrl.activeSprint.PostIts.push(response.data);
                    ctrl.postitcomment = '';
                });
        };

        ctrl.removePostIt = function (postItId) {
            var i, indexToRemove;

            return teamService.removePostIt(postItId).then(function () {

                for (i = 0; i < ctrl.activeSprint.PostIts.length; i += 1) {
                    if (ctrl.activeSprint.PostIts[i].PostItId === postItId) {
                        indexToRemove = i;
                        break;
                    }
                }

                ctrl.activeSprint.PostIts.splice(indexToRemove, 1);
            });

        };

        ctrl.addGoodPostIt = function () {
            addPostIt(activeSprintId, ctrl.userName, ctrl.postitcomment, 'good');
        };

        ctrl.addCommentPostIt = function () {
            addPostIt(activeSprintId, ctrl.userName, ctrl.postitcomment, 'comment');
        };

        ctrl.addBadPostIt = function () {
            addPostIt(activeSprintId, ctrl.userName, ctrl.postitcomment, 'bad');
        };

        ctrl.createSprint = function () {
            teamService.createSprint(teamId, ctrl.newsprint).then(function (response) {
                ctrl.sprints = [response.data].concat(ctrl.sprints);
                ctrl.activeSprint = response.data;
                activeSprintId = ctrl.activeSprint.SprintId;
                ctrl.newsprint = '';
            });
        };

        ctrl.toggleGroupMode = function () {
            ctrl.groupMode = !ctrl.groupMode;
        };

        var groupAs = function(type) {
            var i, postIt, postItIds = [], promises = [], finalComment = '', finalMembers = '';

            for (i = 0; i < ctrl.activeSprint.PostIts.length; i += 1) {
                postIt = ctrl.activeSprint.PostIts[i];

                if (postIt.groupSelected) {
                    postItIds.push(postIt.PostItId);

                    finalComment += postIt.Comment + '. ';
                    //finalVotes += postIt.Votes;
                    if (finalMembers.indexOf(postIt.Member) === -1) {
                        finalMembers += postIt.Member + ' ';
                    } 
                }
            }

            for (i = 0; i < postItIds.length; i += 1) {
                promises.push(ctrl.removePostIt(postItIds[i]));
            }

            $q.all(promises).then(function () {
                addPostIt(activeSprintId, finalMembers, finalComment, type);
            });

            ctrl.groupMode = false;
        };

        ctrl.groupAsGood = function () {
            groupAs('good');
        };

        ctrl.groupAsComment = function () {
            groupAs('comment');
        };

        ctrl.groupAsBad = function () {
            groupAs('bad');
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