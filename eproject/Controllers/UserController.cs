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
        public IActionResult Index(int id)
        {
            var res = new ContentResult { ContentType= "text/plain" , StatusCode= 200};

            User? oldData = _db.Users.SingleOrDefault<User>(m => m.Id == id);

            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                var json = Task<string>.Run(() => reader.ReadToEndAsync()).Result;

                User? user = JsonConvert.DeserializeObject<User>(json);

                if (oldData != null && user != null)
                {
                    oldData.FirstName = user.FirstName;
                    oldData.LastName = user.LastName;
                    oldData.Email = user.Email;
                    oldData.PhoneNumber = user.PhoneNumber;

                    _db.SaveChanges();

                    res.Content= "success";
                }
                else if (user == null)
                {
                    res.Content = "Data sent was incomplete or corrupted";
                }
                else
                {
                    res.Content = "User was not found";
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
                mailMessage.From = new MailAddress("OTP <emmanuelbowofoluwa@gmail.com>");
                mailMessage.To.Add(email);
                mailMessage.Subject = "Email verification OTP";
                mailMessage.Body = "Your one time password is: " + OTP;

                var smtpClient = new SmtpClient("smtp.gmail.com");
                smtpClient.Port = 587;
                
                smtpClient.Credentials = new NetworkCredential("emmanuelbowofoluwa@gmail.com", "wbnirgyjzuuhrrlh");
                //smtpClient.Credentials = new NetworkCredential("emmanuelcod90@gmail.com", "nbeukqroobucmavg");
                //smtpClient.Credentials = new NetworkCredential("cecilia.corridor@gmail.com", "cdoodjdwnlzfazjf");
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

        [HttpPost]
        public IActionResult SendImage(IFormCollection form)
        {
            Random random = new();
            string randomnumbers = "";

            for (int i = 0; i < 6; i++)
            {
                randomnumbers += random.Next(1, 9);
            }

            ProfileImage newImage = new() { UserId= Convert.ToInt32(form["UserId"]), Name= $"profileimage{randomnumbers}", Ext= form["Ext"] };

            if(Request.Form.Files.Count > 0)
            {
                ProfileImage? db_image = _db.ProfileImages.FirstOrDefault(x => x.UserId == Convert.ToInt32(form["UserId"]));
                
                if (db_image != null)
                {
                    var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/lib/images/profileImage");
                    var filePath = Path.Combine(uploadDir, $"{db_image.Name}.{db_image.Ext}");

                    if (System.IO.File.Exists(filePath)){
                        System.IO.File.Delete(filePath);
                    }

                    _db.ProfileImages.Remove(db_image);
                }

                var file = Request.Form.Files[0];
                if (file != null && file.Length > 0)
                {
                    var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/lib/images/profileImage");

                    if (!Directory.Exists(uploadFolder))
                    {
                        Directory.CreateDirectory(uploadFolder);
                    }

                    var path = Path.Combine(uploadFolder, $"{newImage.Name}.{newImage.Ext}");

                    using (var fileStream = new FileStream(path, FileMode.Create))
                    {
                        file.CopyTo(fileStream);
                    }

                    _db.ProfileImages.Add(newImage);
                    _db.SaveChanges();

                    return Json(newImage);
                }
                else
                {
                    return BadRequest("no image file in first position");
                }
            }
            else
            {
                return BadRequest("no image files sent");
            }
        }

        [HttpGet]
        public IActionResult GetImage(string userId)
        {
            ProfileImage? image = _db.ProfileImages.FirstOrDefault(x => x.UserId == Convert.ToInt32(userId));

            if(image != null)
            {
                return Json(image);
            }
            else
            {
                return new ContentResult { Content = "no image" };
            }
        }
    }
}