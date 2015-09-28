using RemoteRetro.DAL.Model;
using System;
using System.Collections.Generic;

namespace RemoteRetro.DAL
{
    public class RemoteRetroSeeder : System.Data.Entity.DropCreateDatabaseAlways<RemoteRetroContext>
    {
        protected override void Seed(RemoteRetroContext context)
        {
            context.SaveChanges();

            var postits1 = new List<PostIt>
            {
                new PostIt { PostItId = Guid.NewGuid().ToString(), Votes = "memberA", Comment = "Comment A", Member = "memberA", Type = PostIt.Types.bad },
                new PostIt { PostItId = Guid.NewGuid().ToString(), Votes = "memberA", Comment = "Comment B", Member = "memberA", Type = PostIt.Types.comment },
                new PostIt { PostItId = Guid.NewGuid().ToString(), Votes = "memberA", Comment = "Comment C", Member = "memberB", Type = PostIt.Types.good }
            };


            var postits2 = new List<PostIt>
            {
                new PostIt { PostItId = Guid.NewGuid().ToString(), Votes = null, Comment = "Comment A", Member = "memberA", Type = PostIt.Types.bad, Action = "Need to fix this asap" },
                new PostIt { PostItId = Guid.NewGuid().ToString(), Votes = null, Comment = "Comment B", Member = "memberB", Type = PostIt.Types.bad },
                new PostIt { PostItId = Guid.NewGuid().ToString(), Votes = null, Comment = "Comment C", Member = "memberA", Type = PostIt.Types.bad },
                new PostIt { PostItId = Guid.NewGuid().ToString(), Votes = null, Comment = "Comment D", Member = "memberA", Type = PostIt.Types.bad },
                new PostIt { PostItId = Guid.NewGuid().ToString(), Votes = null, Comment = "Comment E", Member = "memberA", Type = PostIt.Types.comment },
                new PostIt { PostItId = Guid.NewGuid().ToString(), Votes = null, Comment = "Comment F", Member = "memberB", Type = PostIt.Types.good }
            };

            context.PostIts.AddRange(postits1);
            context.PostIts.AddRange(postits2);
            context.SaveChanges();

            var sprints = new List<Sprint>
            {
                new Sprint
                {
                     SprintId = Guid.NewGuid().ToString(),
                     SprintName = "Sprint 1",
                     CreatedDateTime = DateTime.UtcNow.AddHours(-1),
                     PostIts = postits1
                },
                new Sprint
                {
                     SprintId = Guid.NewGuid().ToString(),
                     SprintName = "Sprint 2",
                     CreatedDateTime = DateTime.UtcNow,
                     PostIts = postits2
                }
            };

            context.Sprints.AddRange(sprints);
            context.SaveChanges();

            var team = new Team
            {
                TeamId = Guid.NewGuid().ToString(),
                Name = "Team",
                Sprints = sprints
            };
 
            context.Teams.Add(team);
            context.SaveChanges();
        }
    }
}
