using System.ComponentModel.DataAnnotations;

namespace eproject.Models
{
    public class Airport
    {
        public int Id { get; set; }

       [Required] public required string Name { get; set; }

       [Required] public required string Location { get; set; }

       [Required] public required int NumberOfRunways { get; set; }

       [Required] public required bool Closed { get; set; }

       [Required] public required int AvailableRunways { get; set; }
    }
}