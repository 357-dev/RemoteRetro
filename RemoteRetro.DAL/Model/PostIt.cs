using System.Collections.Generic;

namespace RemoteRetro.DAL.Model
{
    public class PostIt
    {
        public enum Types
        {
            good,
            bad,
            comment
        };
        public string PostItId { get; set; }
        public string Comment { get; set; }
        public string Votes { get; set; }
        public string Member { get; set; }
        public Types Type { get; set; }
        public string Action { get; set; }
    }
}