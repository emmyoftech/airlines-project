using eproject.Data;
using eproject.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace eproject.Controllers
{
    public class PlanesController(ApplicationDbContext db) : Controller
    {
        [HttpGet]
        public IActionResult Index(bool all)
        {
            List<Plane> planes = [.. db.Planes];

            if(planes.Count > 0)
            {
                return Json(planes);
            }
            return Ok("no planes in server");
        }

        [HttpPost]
        public IActionResult Index()
        {
            string res = "success";

            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                string json = Task<Plane>.Run(() => reader.ReadToEndAsync()).Result;

                Plane? plane = JsonConvert.DeserializeObject<Plane>(json);

                if(plane != null)
                {
                    Airport? port = db.Airports.Find(plane.AirportId);

                    if(port != null)
                    {
                        port.AvailableRunways--;
                        db.Planes.Add(plane);
                        db.SaveChanges();

                        res += $"={plane.Code}";
                    }
                }
                else
                {
                    res = "no data or currupt data was sent to the server";
                }
            }

            return Ok(res);
        }

        [HttpGet]
        public IActionResult GenerateSeats(int planeCode)
        {
            string res = "success";

            Plane? plane = db.Planes.FirstOrDefault(x => x.Code == planeCode);

            if (plane != null)
            {
                List<BuisnessClassSeat> buisnessSeats = [];

                List<CommunitySeat> communitySeats = [];

                for (int i = 1; i <= 20; i++)
                {
                    var bu = new BuisnessClassSeat { PlaneId = plane.Id, SeatNumber = i, Occupied = false };

                    buisnessSeats.Add(bu);
                }

                for (int i = 21; i <= plane.SeatCapacity; i++)
                {
                    var com = new CommunitySeat { PlaneId = plane.Id, SeatNumber = i, Occupied = false };

                    communitySeats.Add(com);
                }

                db.BuisnessClassSeats.AddRange(buisnessSeats);
                db.CommunitySeats.AddRange(communitySeats);

                db.SaveChanges();
            }
            else
            {
                res = "failed to find plane";
            }

            return Ok(res);
        }

        [HttpDelete]
        public IActionResult Index(int planeId)
        {
            string res = "";

            Plane? planeDb = db.Planes.Find(planeId);

            if (planeDb != null)
            {
                Airport? airportDb = db.Airports.FirstOrDefault(x => x.Id == planeDb.AirportId);

                if(airportDb != null)
                {
                    airportDb.AvailableRunways--;
                }

                db.Planes.Remove(planeDb);
                db.SaveChanges();
                res = "success";
            }
            else
            {
                res = "plane could not be found in database";
            }
            return Ok(res);
        }

        [HttpDelete]
        public IActionResult DeleteSeats(int planeId) 
        {
            string res = "";

            List<BuisnessClassSeat> buisnessClassSeats = [.. db.BuisnessClassSeats];

            List<CommunitySeat> communitySeats = [.. db.CommunitySeats];

            if(buisnessClassSeats.Count < 1)
            {
                res = "buisness class seats are not available";
            }
            else if(communitySeats.Count < 1)
            {
                res = "community class seats are not available";
            }
            else
            {
                db.CommunitySeats.RemoveRange(communitySeats.FindAll(e => e.PlaneId == planeId)); 
                db.BuisnessClassSeats.RemoveRange(buisnessClassSeats.FindAll(e => e.PlaneId == planeId));
                db.SaveChanges();
                res = "success";
            }

            return Ok(res);
        }

        [HttpDelete]
        public IActionResult DeleteAll()
        {
            string res = "";

            List<Plane> planes = [.. db.Planes];
            List<BuisnessClassSeat> buisnessClassSeats = [.. db.BuisnessClassSeats];
            List<CommunitySeat> communitySeats = [.. db.CommunitySeats];
            List<Airport> airports = [.. db.Airports];

            if (planes.Count < 1)
            {
                res = "no planes to delete";
            }
            else
            {
                airports.ForEach(e =>
                {
                    e.AvailableRunways = e.NumberOfRunways;
                });
                db.Planes.RemoveRange(planes);
                db.BuisnessClassSeats.RemoveRange(buisnessClassSeats);
                db.CommunitySeats.RemoveRange(communitySeats);
                db.SaveChanges();
                res = "success";
            }

            return Ok(res);
        }

        [HttpGet] 
        public IActionResult GetBuisnessSeats(int planeId) 
        {
            List<BuisnessClassSeat> allBuisnessClassSeats = [.. db.BuisnessClassSeats];

            if(allBuisnessClassSeats.Count > 0)
            {
                List<BuisnessClassSeat> selectedSeats = allBuisnessClassSeats.FindAll(x => x.PlaneId == planeId);

                if (selectedSeats.Count > 0)
                    return Json(selectedSeats);
                else
                    return Ok("no buisness seats of required plane");
            }
            else
            {
                return Ok("no buisness seats at all");
            }

        }

        
        [HttpGet]
        public IActionResult GetCommunitySeats(int planeId)
        {
            List<CommunitySeat> allCommunitySeats = [.. db.CommunitySeats];

            if (allCommunitySeats.Count > 0)
            {
                List<CommunitySeat> selectedSeats = allCommunitySeats.FindAll(x => x.PlaneId == planeId);

                if (selectedSeats.Count > 0)
                    return Json(selectedSeats);
                else
                    return Ok("no community seats of required plane");
            }
            else
            {
                return Ok("no community seats at all");
            }

        }
    }
}
