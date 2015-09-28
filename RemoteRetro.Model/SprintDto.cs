using System;
using System.Collections.Generic;

namespace RemoteRetro.Model
{
    public class SprintDto
    {
        public SprintDto()
        {
            this.SprintId = Guid.NewGuid().ToString();
            this.PostIts = new List<PostItDto>();
        }

        public string SprintId { get; set; }
        public string SprintName { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public virtual IList<PostItDto> PostIts { get; set; }
    }
}
