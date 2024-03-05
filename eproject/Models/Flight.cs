namespace eproject.Models
{
    public class Flight
    {
        public int Id { get; set; }

        public required int DepartureAirportId { get; set; }

        public required int ArrivalAirportId { get; set; }

        public required int PlaneId { get; set; }

        public required int PricePerSeat { get; set; }

        public required string DepartureTime { get; set; }

        public required string ArrivalTime { get; set; }

        public required string DepartureDate { get; set; }

        public required int Capacity { get; set; }

        public required int RemainingSeats { get; set; }
    }
}
