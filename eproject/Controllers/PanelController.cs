using Microsoft.AspNetCore.Mvc;

namespace eproject.Controllers
{
    public class PanelController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
