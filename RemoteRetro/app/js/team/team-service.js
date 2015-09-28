/* global angular: true */
angular.module('retro.team').service('TeamService',
['$http', 'retroapi', function (http, retroapi) {

    var addPostIt = function (activeSprintId, userName, comment, type) {
        return http.post(retroapi.addPostIt + '?activeSprintId=' + activeSprintId, {
            comment: comment,
            type: type,
            member: userName
        });
    };

    var createSprint = function (teamId, sprintName) {
        return http.post(retroapi.createSprint + '?teamId=' + teamId, {
            SprintName: sprintName
        });
    };

    var joinTeam = function (teamname) {
        return http.post(retroapi.joinTeam + '?teamname=' + teamname);
    };

    return {
        joinTeam: joinTeam,
        createSprint: createSprint,
        addPostIt: addPostIt
    };
}
]);