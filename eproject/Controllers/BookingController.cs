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
                    Flight? flight = db.Flights.FirstOrDefault(x => x.Id == booking.FlightId);
                    

                    if(flight != null) 
                    {
                        if (booking.SeatNumber > 20)
                        {
                            CommunitySeat? communitySeat = db.CommunitySeats.FirstOrDefault(x => x.PlaneId == flight.PlaneId && x.SeatNumber == booking.SeatNumber);
                            if (communitySeat != null)
                            {
                                communitySeat.Occupied = true;
                            }
                            else
                            {
                                res = "community seat problem";
                            }
                        }
                        else
                        {
                            BuisnessClassSeat? buisnessClassSeat = db.BuisnessClassSeats.FirstOrDefault(x => x.PlaneId == flight.PlaneId && x.SeatNumber == booking.SeatNumber);
                            if(buisnessClassSeat != null) 
                            {
                                buisnessClassSeat.Occupied = true;
                            }
                            else
                            {
                                res = "buisness class seat problem";
                            }
                        }
                        flight.RemainingSeats--;
                        db.Add(booking);
                        db.SaveChanges();
                        res = "success";
                    }
                    else
                    {
                        res = "no flight available for this booking";
                    }
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
