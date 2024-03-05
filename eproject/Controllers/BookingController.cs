using eproject.Data;
using eproject.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace eproject.Controllers
{
    public class BookingController (ApplicationDbContext db): Controller
    {
        [HttpGet]
        public IActionResult Index(bool all)
        {
            List<Booking> bookings = [.. db.Bookings];

            if(bookings.Count > 0)
            {
                return Json(bookings);
            }
            else
            {
                return Ok("no bookings available");
            }
        }

        [HttpPost]
        public IActionResult Index() 
        {
            string res = "";

            using (var reader = new StreamReader(Request.Body, Encoding.UTF8)) 
            {
                var json = Task<string>.Run(() => reader.ReadToEndAsync()).Result;

                Booking? booking = JsonConvert.DeserializeObject<Booking>(json);

                if(booking != null) 
                {
                    db.Add(booking);
                    db.SaveChanges();
                    res = "success";
                }
                else 
                {
                    res = "data sent to server is incomplete or corrupted";
                }
            }

            return Ok(res);
        }
    }
}
