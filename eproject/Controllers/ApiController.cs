using Microsoft.AspNetCore.Mvc;

namespace eproject.Controllers
{
    public class ApiController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
