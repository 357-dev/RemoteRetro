using System.Collections.Generic;

namespace RemoteRetro.Models
{
    public class Team
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Member> Members { get; set; }
        public virtual ICollection<PostIt> PostIts { get; set; } 
    }
}