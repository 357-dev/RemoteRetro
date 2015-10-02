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
            action: "=",
            groupMode: "=",
            groupSelected: "="
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
                b.removePostIt(b.postItId);
            }, b.voteUp = function() {
                a.votePostItUp(b.postItId, b.myName).then(function(a) {
                    b.votes = a.data;
                });
            }, b.voteDown = function() {
                a.votePostItDown(b.postItId, b.myName).then(function(a) {
                    b.votes = a.data;
                });
            }, b.toggleGroupSelect = function() {
                b.groupSelected = !b.groupSelected;
            };
        }
    };
} ]), angular.module("retro.postit").service("PostItService", [ "$http", "retroapi", function(a, b) {
    var c = function(c, d) {
        return a.post(b.votePostItUp + "?postItId=" + c + "&member=" + d);
    }, d = function(c, d) {
        return a.post(b.votePostItDown + "?postItId=" + c + "&member=" + d);
    }, e = function(c, d) {
        return a.post(b.addAction + "?postItId=" + c + "&action=" + d);
    };
    return {
        addAction: e,
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
} ]), angular.module("retro.team").controller("TeamController", [ "TeamService", "$q", function(a, b) {
    var c, d, e = this;
    e.loading = !0, e.groupMode = !1;
    var f = function(a) {
        a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var b = new RegExp("[\\?&]" + a + "=([^&#]*)"), c = b.exec(location.search);
        return null === c ? "" : decodeURIComponent(c[1].replace(/\+/g, " "));
    };
    e.userName = f("u");
    var g = f("t");
    e.selectSprint = function(a) {
        e.activeSprint = a, d = a.SprintId;
    };
    var h = function(b, c, d, f) {
        a.addPostIt(b, c, d, f).then(function(a) {
            e.activeSprint.PostIts.push(a.data), e.postitcomment = "";
        });
    };
    e.removePostIt = function(b) {
        var c, d;
        return a.removePostIt(b).then(function() {
            for (c = 0; c < e.activeSprint.PostIts.length; c += 1) if (e.activeSprint.PostIts[c].PostItId === b) {
                d = c;
                break;
            }
            e.activeSprint.PostIts.splice(d, 1);
        });
    }, e.addGoodPostIt = function() {
        h(d, e.userName, e.postitcomment, "good");
    }, e.addCommentPostIt = function() {
        h(d, e.userName, e.postitcomment, "comment");
    }, e.addBadPostIt = function() {
        h(d, e.userName, e.postitcomment, "bad");
    }, e.createSprint = function() {
        a.createSprint(c, e.newsprint).then(function(a) {
            e.sprints = [ a.data ].concat(e.sprints), e.activeSprint = a.data, d = e.activeSprint.SprintId, 
            e.newsprint = "";
        });
    }, e.toggleGroupMode = function() {
        e.groupMode = !e.groupMode;
    };
    var i = function(a) {
        var c, f, g = [], i = [], j = "", k = "";
        for (c = 0; c < e.activeSprint.PostIts.length; c += 1) f = e.activeSprint.PostIts[c], 
        f.groupSelected && (g.push(f.PostItId), j += f.Comment + ". ", -1 === k.indexOf(f.Member) && (k += f.Member + " "));
        for (c = 0; c < g.length; c += 1) i.push(e.removePostIt(g[c]));
        b.all(i).then(function() {
            h(d, k, j, a);
        }), e.groupMode = !1;
    };
    e.groupAsGood = function() {
        i("good");
    }, e.groupAsComment = function() {
        i("comment");
    }, e.groupAsBad = function() {
        i("bad");
    }, a.joinTeam(g).then(function(a) {
        c = a.data.TeamId, e.teamname = a.data.Name, e.sprints = a.data.Sprints, a.data.Sprints.length > 0 && (e.activeSprint = a.data.Sprints[0], 
        d = a.data.Sprints[0].SprintId), e.loading = !1;
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
    }, f = function(c) {
        return a.post(b.removePostIt + "?postItId=" + c);
    };
    return {
        joinTeam: e,
        createSprint: d,
        addPostIt: c,
        removePostIt: f
    };
} ]);