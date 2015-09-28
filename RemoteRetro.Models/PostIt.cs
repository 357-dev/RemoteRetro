namespace RemoteRetro.Models
{
    public class PostIt
    {
        public enum Types
        {
            Good,
            Bad,
            Comments
        };
        public string ID { get; set; }
        public string Comment { get; set; }
        public string MemberID { get; set; }
        public Member Member { get; set; }
        public Types Type { get; set; }
    }
}