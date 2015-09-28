using AutoMapper;
using RemoteRetro.DAL;
using RemoteRetro.DAL.Model;
using RemoteRetro.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;

namespace RemoteRetro.Repository
{
    public class RemoteRetroRepo
    {
        public RemoteRetroRepo()
        {
            Mapper.CreateMap<Team, TeamDto>();
            Mapper.CreateMap<TeamDto, Team>();

            Mapper.CreateMap<PostIt, PostItDto>();
            Mapper.CreateMap<PostItDto, PostIt>();

            Mapper.CreateMap<Sprint, SprintDto>();
            Mapper.CreateMap<SprintDto, Sprint>();
        }

        public Team CreateTeam(string teamName)
        {
            Team newTeam = new Team
            {
                TeamId = Guid.NewGuid().ToString(),
                Name = teamName,
                Sprints = new List<Sprint>()
            };

            using (var db = new RemoteRetroContext())
            {
                db.Teams.Add(newTeam);
                db.SaveChanges();
            }

            return newTeam;
        }

        public TeamDto JoinTeam(string teamName)
        {
            var teamNameUpper = teamName.ToUpper();

            using (var db = new RemoteRetroContext())
            {
                var team = db.Teams.SingleOrDefault(t => t.Name.ToUpper() == teamNameUpper) ?? CreateTeam(teamName);
                team.Sprints = team.Sprints.OrderByDescending(s => s.CreatedDateTime).ToList();

                return Mapper.Map<Team, TeamDto>(team);
            }
        }

        public void CreateSprint(string teamId, SprintDto sprint)
        {
            var newSprint = Mapper.Map<Sprint>(sprint);
            using (var db = new RemoteRetroContext())
            {
                var team = db.Teams.Find(teamId);
                team.Sprints.Add(newSprint);

                db.SaveChanges();
            }
        }

        #region Post It

        public void AddPostIt(string activeSprintId, PostItDto postIt)
        {
            var newPostIt = Mapper.Map<PostItDto, PostIt>(postIt);
            using (var db = new RemoteRetroContext())
            {
                var sprint = db.Sprints.Find(activeSprintId);
                sprint.PostIts.Add(newPostIt);
                db.SaveChanges();
            }
        }

        public void RemovePostIt(string postItId)
        {
            using (var db = new RemoteRetroContext())
            {
                var postIt = db.PostIts.Find(postItId);
                db.PostIts.Remove(postIt);
                db.SaveChanges();
            }
        }

        public string VotePostItUp(string postItId, string member)
        {
            using (var db = new RemoteRetroContext())
            {
                var postIt = db.PostIts.Find(postItId);
                postIt.Votes += "|" + member;
                db.SaveChanges();

                return postIt.Votes;
            }
        }

        public string VotePostItDown(string postItId, string member)
        {
            using (var db = new RemoteRetroContext())
            {
                var postIt = db.PostIts.Find(postItId);
                postIt.Votes = postIt.Votes.Replace("|" + member, string.Empty);
                db.SaveChanges();

                return postIt.Votes;
            }
        }

        public string AddAction(string postItId, string action)
        {
            using (var db = new RemoteRetroContext())
            {
                var postIt = db.PostIts.Find(postItId);
                postIt.Action = action;
                db.SaveChanges();

                return action;
            }
        }

        #endregion
    }
}
