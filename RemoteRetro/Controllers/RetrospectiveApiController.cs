using System;
using System.Web.Http;
using RemoteRetro.Model;
using RemoteRetro.Repository;

namespace RemoteRetro.Controllers
{
    public class RetrospectiveApiController : ApiController
    {
        private RemoteRetroRepo _repository;

        public RetrospectiveApiController()
        {
            _repository = new RemoteRetroRepo();
        }

        [HttpPost]
        public TeamDto JoinTeam(string teamname)
        {
            return _repository.JoinTeam(teamname);
        }

        [HttpPost]
        public SprintDto CreateSprint([FromUri] string teamId, [FromBody] SprintDto sprint)
        {
            sprint.CreatedDateTime = DateTime.UtcNow;
            _repository.CreateSprint(teamId, sprint);
            return sprint;
        }

        [HttpPost]
        public PostItDto AddPostIt([FromUri] string activeSprintId, [FromBody] PostItDto postIt)
        {
            _repository.AddPostIt(activeSprintId, postIt);
            return postIt;
        }

        [HttpPost]
        public bool RemovePostIt([FromUri] string postItId)
        {
            _repository.RemovePostIt(postItId);
            return true;
        }

        [HttpPost]
        public string VotePostItUp([FromUri] string postItId, [FromUri] string member)
        {
            return _repository.VotePostItUp(postItId, member);
        }

        [HttpPost]
        public string VotePostItDown([FromUri] string postItId, [FromUri] string member)
        {
            return _repository.VotePostItDown(postItId, member);
        }

        [HttpPost]
        public string AddAction([FromUri] string postItId, [FromUri] string action)
        {
            return _repository.AddAction(postItId, action);
        }
    }
}