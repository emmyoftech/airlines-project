
using eproject.Models;
using Microsoft.EntityFrameworkCore;

namespace eproject.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }

        public DbSet<ProfileImage> ProfileImages { get; set; }

        public DbSet<Airport> Airports { get; set; }

        public DbSet<Plane> Planes { get; set; }

        public DbSet<BuisnessClassSeat> BuisnessClassSeats { get; set; }

        public DbSet<CommunitySeat> CommunitySeats { get; set; }    

        public DbSet<Flight> Flights { get; set; }

        public DbSet<Booking> Bookings { get; set; }

        public DbSet<Message> Messages { get; set; } 
    }
}

