using eproject.Data;
using eproject.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace eproject.Controllers
{
    public class MessageController(ApplicationDbContext db) : Controller
    {
        [HttpGet]
        public IActionResult Index(bool all)
        {
            List<Message> messages = [.. db.Messages];

            if(messages.Count > 0)
            {
                return Json(messages);
            }
            else
            {
                return Ok("no messages");
            }
        }

        [HttpPost]
        public IActionResult Index() 
        {
            string res = "";

            using(var reader = new StreamReader(Request.Body, Encoding.UTF8)) 
            {
                string json = Task<string>.Run(() => reader.ReadToEndAsync()).Result;

                Message? message = JsonConvert.DeserializeObject<Message>(json);

                if (message != null)
                {
                    db.Messages.Add(message);
                    db.SaveChanges();
                    res = "success";
                }
                else
                {
                    res = "data sent to server was incomplete or corrupted";
                }
            }

            return Ok(res);
        }
    }
}
