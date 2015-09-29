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