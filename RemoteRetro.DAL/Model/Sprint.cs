using System;
using System.Collections.Generic;

namespace RemoteRetro.DAL.Model
{
    public class Sprint
    {
        public string SprintId { get; set; }
        public string SprintName { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public virtual IList<PostIt> PostIts { get; set; }
    }
}
