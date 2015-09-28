/* global angular: true, $:true */
angular.module('retro.team').service('signalr',
[
    '$rootScope', function (rootScope) {
        var chat = $.connection.retroHub;

        chat.client.memberJoined = function (memberName) {
            rootScope.$broadcast('memberJoined', {
                memberName: memberName
            });
        };

        var joinRoom = function (teamName, memberName) {
            $.connection.hub.start().done(function () {
                chat.server.joinRoom(teamName, memberName);
            });
        };

        var addPostIt = function (teamName, memberName, type, comment) {
            chat.server.addPostIt(teamName, memberName, type, comment);
        };

        var removePostIt = function (teamName, hash) {
            chat.server.removePostIt(teamName, hash);
        };

        var voteUp = function (teamName, hash) {
            chat.server.voteUp(teamName, hash);
        };

        var voteDown = function (teamName, hash) {
            chat.server.voteDown(teamName, hash);
        };

        chat.client.addPostIt = function (hash, type, comment, memberName) {
            rootScope.$broadcast('addPostIt', {
                hash: hash,
                type: type,
                comment: comment,
                memberName: memberName,
                votes: 0
            });
        };

        chat.client.removePostIt = function (hash) {
            rootScope.$broadcast('removePostIt', {
                hash: hash
            });
        };

        chat.client.voteUp = function (hash) {
            rootScope.$broadcast('voteUp', {
                hash: hash
            });
        };

        chat.client.voteDown = function (hash) {
            rootScope.$broadcast('voteDown', {
                hash: hash
            });
        };

        return {
            joinRoom: joinRoom,
            addPostIt: addPostIt,
            removePostIt: removePostIt,
            voteUp: voteUp,
            voteDown: voteDown
        };
    }
]);