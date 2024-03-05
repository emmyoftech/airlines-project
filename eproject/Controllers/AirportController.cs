using eproject.Data;
using eproject.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace eproject.Controllers
{
    public class AirportController : Controller
    {
        public readonly ApplicationDbContext _db;

        public AirportController(ApplicationDbContext db) {
        
            _db = db;
        }

        [HttpGet]
        public IActionResult Index(bool all)
        {
            List<Airport> airports = _db.Airports.ToList();

            if(airports.Count == 0 || !all) 
            {
                return Ok("no aiports available");
            } 
            else
            {
                return Json(airports);
            }
        } 

        [HttpPost]
        public IActionResult Index()
        {
            string res = "";

            try
            {
                using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    string json = Task<string>.Run(() => reader.ReadToEndAsync()).Result;

                    var airport = JsonConvert.DeserializeObject<Airport>(json);

                    if (airport == null)
                    {
                        res = "no data passed to server";
                    }
                    else
                    {
                        _db.Airports.Add(airport);
                        _db.SaveChanges();
                        res = "success";
                    }
                }
            }
            catch (Exception ex)
            {
                res = ex.Message;
            }
            return Ok(res);
        }


        [HttpDelete]
        public IActionResult Index(int id)
        {
            var res = "success";
            Airport? airport = _db.Airports.Find(id);

            if (airport == null)
            {
                res = "failed to find Airport data in sever";
            }
            else
            {
                _db.Remove(airport);
                _db.SaveChanges();
            }
            return Ok(res);
        }

        [HttpPut]
        public IActionResult Index(string id)
        {
            int Id = Convert.ToInt32(id);
            string res = "";

            Airport? airportDB = _db.Airports.Find(Id);

            if(airportDB != null)
            {
                using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    string json = Task<Airport>.Run(() => reader.ReadToEndAsync()).Result;

                    Airport? airport = JsonConvert.DeserializeObject<Airport>(json);

                    if(airport != null)
                    {
                        airportDB.Name = airport.Name;
                        airportDB.Location = airport.Location;
                        airportDB.NumberOfRunways = airport.NumberOfRunways;
                        _db.SaveChanges();

                        res = "success";
                    }
                }
            }
            else
            {
                res = "failed to find airport in database";
            }

            return Ok(res);
        }

        [HttpPost]
        public IActionResult DeleteMultiple(bool? all)
        {
            string res = "";
            
            if (all != null)
            {
                List<Airport> allAirports = _db.Airports.ToList();

                if(allAirports.Count > 0)
                {
                    _db.Airports.RemoveRange(allAirports);
                    _db.SaveChanges();
                    
                    res = "success";
                }
                else
                {
                    res = "airport data store is empty"; 
                }
            }
            else
            {
                using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    string json = Task<string>.Run(() => reader.ReadToEndAsync()).Result;

                    Airport[]? airports = JsonConvert.DeserializeObject<Airport[]>(json);

                    if (airports != null)
                    {
                        for (int i = 0; i < airports.Length; i++)
                        {
                            _db.Airports.Remove(airports[i]);
                        }
                        _db.SaveChanges();
                        res = "success";
                    }
                    else
                    {
                        res = "no data was sent to the server";
                    }
                }
            }
            return Ok(res);
        }
    }
}