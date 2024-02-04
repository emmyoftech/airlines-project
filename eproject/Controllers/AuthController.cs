using Microsoft.AspNetCore.Mvc;

namespace eproject.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Signup()
        {
            return View("signup");
        }
    }
}
