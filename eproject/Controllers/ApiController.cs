using eproject.Data;
using eproject.Models;
using Microsoft.AspNetCore.Mvc;

namespace eproject.Controllers
{
    public class ApiController : Controller
    {
        private readonly ApplicationDbContext _db;

        public ApiController(ApplicationDbContext db) {
            _db = db;
        }
        public IActionResult getUsers()
        {
            List<User> users = _db.Users.ToList();
            if(users.Count > 0)
            {
                return Json(users);
            }
            else
            {
                var message = new  { message = "nodata" };
                return Json(message);
            }
        }
    }
}
