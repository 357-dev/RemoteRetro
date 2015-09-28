using System;
using System.Collections.Generic;

namespace RemoteRetro.Model
{
    public class TeamDto
    {
        public TeamDto()
        {
            this.TeamId = Guid.NewGuid().ToString();
            this.Sprints = new List<SprintDto>();
        }

        public string TeamId { get; set; }
        public string Name { get; set; }
        public virtual IList<SprintDto> Sprints { get; set; }
    }
}