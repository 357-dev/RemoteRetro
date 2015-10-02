/* global angular: true */
angular.module('retro.postit').service('PostItService',
['$http', 'retroapi', function (http, retroapi) {

    var votePostItUp = function (postItId, memberName) {
        return http.post(retroapi.votePostItUp + '?postItId=' + postItId + '&member=' + memberName);
    };

    var votePostItDown = function (postItId, memberName) {
        return http.post(retroapi.votePostItDown + '?postItId=' + postItId + '&member=' +  memberName);
    };

    var addAction = function (postItId, action) {
        return http.post(retroapi.addAction + '?postItId=' + postItId + '&action=' + action);
    };

    return {
        addAction: addAction,
        votePostItUp: votePostItUp,
        votePostItDown: votePostItDown
    };
}
]);