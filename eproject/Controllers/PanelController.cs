using eproject.Data;
using eproject.Models;
using Microsoft.AspNetCore.Mvc;

namespace eproject.Controllers
{
    public class PanelController : Controller
    {
        private readonly ApplicationDbContext _db;
        
        public PanelController(ApplicationDbContext db) 
        {
            _db = db;
        }
        public IActionResult Index(int id)
        {
            User? user = _db.Users.FirstOrDefault<User>(x => x.Id == id);

            if (user != null)
            {
                user.LogStatus = "logged in";

                _db.SaveChanges();

                return View();
            }
            else 
            {
                return RedirectToAction("signin", "Auth");
            }
        }
    }
}
