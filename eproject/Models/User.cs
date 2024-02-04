using System.ComponentModel.DataAnnotations;
namespace eproject.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string PhoneNumber { get; set; }

        [Required]
        public required string Gender { get; set;}

        [Required] 
        public required string Role { get; set; }

        [Required]
        public required bool EmailConfirmed { get; set; }

        [Required]
        public required string LogStatus { get; set; }

        [Required]
        public required string RegisteredOn { get; set; }
    }
}
