using eproject.Data;
using eproject.Models;
using Microsoft.AspNetCore.Mvc;

namespace eproject.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _db;

        public UserController(ApplicationDbContext db)
        {
            _db = db;
        }

        public IActionResult Index()
        {
            List<User> users = _db.Users.ToList<User>();
           
            return Json(users);
        }

        [HttpGet]
        public IActionResult verifyMail(string email)
        {

            return Json(new {message= 468464});
        }
    }
}
