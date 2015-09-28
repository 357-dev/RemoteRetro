using RemoteRetro.DAL.Model;
using System.Data.Entity;

namespace RemoteRetro.DAL
{
    public class RemoteRetroContext : DbContext
    {
        public RemoteRetroContext() : base("RemoteRetroContext")
        {
        }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Sprint> Sprints { get; set; }
        public DbSet<PostIt> PostIts { get; set; }
    }
}
