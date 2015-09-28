using System.Web.Mvc;

namespace RemoteRetro.Controllers
{
    public class RetrospectiveController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ViewResult Team()
        {
            return View();
        }
    }
}