angular.module("retro.common", []), function() {
    "use strict";
    var a = angular.module("retro.common");
    a.constant("retroapi", {
        joinTeam: "/api/retrospectiveapi/jointeam/",
        createSprint: "/api/retrospectiveapi/createsprint/",
        addPostIt: "/api/retrospectiveapi/addPostIt/",
        removePostIt: "/api/retrospectiveapi/removePostIt/",
        votePostItUp: "/api/retrospectiveapi/votePostItUp/",
        votePostItDown: "/api/retrospectiveapi/votePostItDown/",
        addAction: "/api/retrospectiveapi/addAction/"
    });
}(), angular.module("retro.home", [ "retro.common" ]), angular.module("retro.home").controller("HomeController", function() {
}), angular.module("retro.home").controller("HomeService", [ "$http", function() {
    return {};
} ]), angular.module("retro.postit", [ "retro.common" ]);

var module = angular.module("retro.postit");

module.directive("postit", [ "PostItService", function(a) {
    return {
        restrict: "EA",
        scope: {
            postItId: "=",
            comment: "=",
            type: "=",
            memberName: "=",
            myName: "=",
            votes: "=",
            removePostIt: "=",
            action: "="
        },
        templateUrl: "/app/js/post-it/postit-template.html",
        replace: !0,
        link: function(b) {
            b.actionFormVisible = b.action, b.isMyPostIt = b.memberName === b.myName, b.numberOfVotes = function() {
                return b.votes && b.votes.split("|").length - 1;
            }, b.IHaveVotedUp = function() {
                return b.votes && b.votes.indexOf(b.myName) > 0;
            }, b.toggleAction = function() {
                b.actionFormVisible = !b.actionFormVisible, b.actionFormVisible || (b.action = "", 
                a.addAction(b.postItId, b.action));
            }, b.addAction = function() {
                a.addAction(b.postItId, b.action).then(function(a) {
                    b.action = a.data;
                });
            }, b.tryRemovePostIt = function() {
                a.removePostIt(b.postItId).then(function(a) {
                    a.data && b.removePostIt(b.postItId);
                });
            }, b.voteUp = function() {
                a.votePostItUp(b.postItId, b.myName).then(function(a) {
                    b.votes = a.data;
                });
            }, b.voteDown = function() {
                a.votePostItDown(b.postItId, b.myName).then(function(a) {
                    b.votes = a.data;
                });
            };
        }
    };
} ]), angular.module("retro.postit").service("PostItService", [ "$http", "retroapi", function(a, b) {
    var c = function(c, d) {
        return a.post(b.votePostItUp + "?postItId=" + c + "&member=" + d);
    }, d = function(c, d) {
        return a.post(b.votePostItDown + "?postItId=" + c + "&member=" + d);
    }, e = function(c) {
        return a.post(b.removePostIt + "?postItId=" + c);
    }, f = function(c, d) {
        return a.post(b.addAction + "?postItId=" + c + "&action=" + d);
    };
    return {
        addAction: f,
        removePostIt: e,
        votePostItUp: c,
        votePostItDown: d
    };
} ]), angular.module("retro.team", [ "retro.postit", "retro.common" ]), angular.module("retro.team").service("signalr", [ "$rootScope", function(a) {
    var b = $.connection.retroHub;
    b.client.memberJoined = function(b) {
        a.$broadcast("memberJoined", {
            memberName: b
        });
    };
    var c = function(a, c) {
        $.connection.hub.start().done(function() {
            b.server.joinRoom(a, c);
        });
    }, d = function(a, c, d, e) {
        b.server.addPostIt(a, c, d, e);
    }, e = function(a, c) {
        b.server.removePostIt(a, c);
    }, f = function(a, c) {
        b.server.voteUp(a, c);
    }, g = function(a, c) {
        b.server.voteDown(a, c);
    };
    return b.client.addPostIt = function(b, c, d, e) {
        a.$broadcast("addPostIt", {
            hash: b,
            type: c,
            comment: d,
            memberName: e,
            votes: 0
        });
    }, b.client.removePostIt = function(b) {
        a.$broadcast("removePostIt", {
            hash: b
        });
    }, b.client.voteUp = function(b) {
        a.$broadcast("voteUp", {
            hash: b
        });
    }, b.client.voteDown = function(b) {
        a.$broadcast("voteDown", {
            hash: b
        });
    }, {
        joinRoom: c,
        addPostIt: d,
        removePostIt: e,
        voteUp: f,
        voteDown: g
    };
} ]), angular.module("retro.team").controller("TeamController", [ "TeamService", function(a) {
    var b, c, d = this;
    d.loading = !0;
    var e = function(a) {
        a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var b = new RegExp("[\\?&]" + a + "=([^&#]*)"), c = b.exec(location.search);
        return null === c ? "" : decodeURIComponent(c[1].replace(/\+/g, " "));
    };
    d.userName = e("u");
    var f = e("t");
    d.selectSprint = function(a) {
        d.activeSprint = a, c = a.SprintId;
    };
    var g = function(b) {
        a.addPostIt(c, d.userName, d.postitcomment, b).then(function(a) {
            d.activeSprint.PostIts.push(a.data), d.postitcomment = "";
        });
    };
    d.removePostIt = function(a) {
        var b, c;
        for (b = 0; b < d.activeSprint.PostIts.length; b += 1) if (d.activeSprint.PostIts[b].PostItId === a) {
            c = b;
            break;
        }
        c && d.activeSprint.PostIts.splice(c, 1);
    }, d.addGoodPostIt = function() {
        g("good");
    }, d.addCommentPostIt = function() {
        g("comment");
    }, d.addBadPostIt = function() {
        g("bad");
    }, d.createSprint = function() {
        a.createSprint(b, d.newsprint).then(function(a) {
            d.sprints = [ a.data ].concat(d.sprints), d.activeSprint = a.data, c = d.activeSprint.SprintId, 
            d.newsprint = "";
        });
    }, a.joinTeam(f).then(function(a) {
        b = a.data.TeamId, d.teamname = a.data.Name, d.sprints = a.data.Sprints, a.data.Sprints.length > 0 && (d.activeSprint = a.data.Sprints[0], 
        c = a.data.Sprints[0].SprintId), d.loading = !1;
    });
} ]), angular.module("retro.team").service("TeamService", [ "$http", "retroapi", function(a, b) {
    var c = function(c, d, e, f) {
        return a.post(b.addPostIt + "?activeSprintId=" + c, {
            comment: e,
            type: f,
            member: d
        });
    }, d = function(c, d) {
        return a.post(b.createSprint + "?teamId=" + c, {
            SprintName: d
        });
    }, e = function(c) {
        return a.post(b.joinTeam + "?teamname=" + c);
    };
    return {
        joinTeam: e,
        createSprint: d,
        addPostIt: c
    };
} ]);