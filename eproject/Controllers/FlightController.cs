using eproject.Data;
using eproject.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace eproject.Controllers
{
    public class FlightController(ApplicationDbContext db) : Controller
    {
        [HttpGet]
        public IActionResult Index(bool all)
        {
            List<Flight> flights = [.. db.Flights];

            if (flights.Count > 0 && all)            
            {
                return Json(flights);
            }
            else 
            {
                return Ok("no flights available");
            }
        }

        [HttpPost]
        public IActionResult Index()
        {
            string res = "";

            using(var reader = new StreamReader(Request.Body, Encoding.UTF8)) 
            {
                string json = Task<string>.Run(() => reader.ReadToEndAsync()).Result;

                Flight? flight = JsonConvert.DeserializeObject<Flight>(json);

                if(flight != null)
                {
                    db.Flights.Add(flight);
                    db.SaveChanges();
                    res = "success";
                }
                else
                {
                    res = "flight data was corrupted or incomplete";
                }
            }
            return Ok(res);
        }
    }
}
