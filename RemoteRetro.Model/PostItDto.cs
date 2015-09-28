using System;

namespace RemoteRetro.Model
{
    public class PostItDto
    {
        public PostItDto()
        {
            this.PostItId = Guid.NewGuid().ToString();
        }

        public string PostItId { get; set; }
        public string Comment { get; set; }
        public string Votes { get; set; }
        public string Member { get; set; }
        public string Type { get; set; }
        public string Action { get; set; }
    }
}