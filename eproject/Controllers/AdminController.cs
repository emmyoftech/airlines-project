using Microsoft.AspNetCore.Mvc;

namespace eproject.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
