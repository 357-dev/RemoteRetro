using System;
using System.Collections.Generic;

namespace RemoteRetro.DAL.Model
{
    public class Team
    {
        public string TeamId { get; set; }
        public string Name { get; set; }
        public virtual IList<Sprint> Sprints { get; set; } 
    }
}