namespace eproject.Models
{
    public class Plane
    {
        public int Id { get; set; }

        public required int AirportId { get; set; }

        public required string Model { get; set; }

        public required int Code { get; set; }

        public required string Manufacturer  { get; set; }

        public required int YearOfManufacture { get; set;}

        public required int SeatCapacity { get; set; }

        public required string Status { get; set; }
    }
}
