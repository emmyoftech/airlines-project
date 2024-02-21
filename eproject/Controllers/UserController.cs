using eproject.Data;
using eproject.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using Newtonsoft.Json;
using System.Text;

namespace eproject.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _db;

        public UserController(ApplicationDbContext db)
        {
            _db = db;
        }
        [HttpGet]
        public IActionResult Index(bool all)
        {
            List<User> users = _db.Users.ToList<User>();
           
            if(users.Count > 0 && all == true)
            {
                return Json(users);
            }
            else
            {
                return new ContentResult { ContentType= "text/plain", StatusCode= 200, Content= "there are no users"};
            }
        }

        [HttpPost]
        public IActionResult Index()
        {
            var res = new ContentResult{ContentType= "text/plain"};
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                string json = Task<string>.Run(() => reader.ReadToEndAsync()).Result;

                var user = JsonConvert.DeserializeObject<User>(json);
                 
                if(user != null)
                {
                   _db.Users.Add(user);
                   _db.SaveChanges();
                   res.Content = "success";
                }
                else
                {
                    res.Content = "failed";
                }
            }
                return res;
        }

        [HttpPut]
        public IActionResult ChangePwd(string email)
        {
            var res = new ContentResult { ContentType = "text/plain", StatusCode = 200 };

            User? user = _db.Users.FirstOrDefault<User>(m => m.Email == email);

            if(user != null)
            {
                using(var reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    string json = Task<string>.Run(() => reader.ReadToEndAsync()).Result;


                    var passObj = JsonConvert.DeserializeObject <User>(json);

                    if (passObj != null)
                    {
                        string pass = passObj.Password;
                        user.Password = pass;
                        _db.SaveChanges();
                        res.Content = "success";
                    }
                    else
                    {
                        res.Content = "nothing was passed to the server";
                    }

                }
            }
            else
            {
                res.Content = $"User with {email} cannot be found";
            }

            return res;
        }

        [HttpGet]
        public IActionResult VerifyMail(string email)
        {
            Random random = new Random();

            var res = new ContentResult {ContentType = "text/plain", StatusCode = 200 };

            string OTP = "";

            for(int i = 0; i < 6; i++)
            {
                OTP += random.Next(1, 9);
            }

            try
            {
                var mailMessage = new MailMessage();
                mailMessage.From = new MailAddress("OTP <emmanuelcod90@gmail.com>");
                mailMessage.To.Add(email);
                mailMessage.Subject = "Email verification OTP";
                mailMessage.Body = "Your one time password is: " + OTP;

                var smtpClient = new SmtpClient("smtp.gmail.com");
                smtpClient.Port = 587;
                smtpClient.Credentials = new NetworkCredential("cecilia.corridor@gmail.com", "cdoodjdwnlzfazjf");
                smtpClient.EnableSsl = true;

                smtpClient.Send(mailMessage);

                res.Content = OTP;

            }
            catch (Exception e)
            {
                res.Content = e.Message;
                res.StatusCode = 500;
            }

            return res;
        }
    }
}
