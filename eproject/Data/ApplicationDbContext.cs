
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
            new User
            { 
                Id=1,
                FirstName="emmanuel",
                LastName="lasisi",
                Email="emmanuelbowofoluwa@gmail.com",
                EmailConfirmed=false,
                PhoneNumber="9066057393",
                Gender="male",
                Role="admin",
                LogStatus="loggedin",
                Password="dustbin40",
                RegisteredOn="1/1/2024"
            },
            new User
            {
                Id = 2,
                FirstName = "joseph",
                LastName = "lasisi",
                Email = "josephbowofoluwa@gmail.com",
                EmailConfirmed = false,
                PhoneNumber = "9066057393",
                Gender = "male",
                Role = "customer",
                LogStatus = "loggedin",
                Password = "dustbin40",
                RegisteredOn = "1/1/2024"
            },
            new User
            {
                Id = 3,
                FirstName = "paul",
                LastName = "lasisi",
                Email = "paulbowofoluwa@gmail.com",
                Role="customer",
                PhoneNumber = "9066057393",
                Gender = "male",
                EmailConfirmed = false,
                LogStatus = "loggedin",
                Password = "dustbin40",
                RegisteredOn = "1/1/2024"
            });
        }
    }
}
