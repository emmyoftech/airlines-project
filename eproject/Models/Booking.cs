namespace eproject.Models
{
    public class Booking
    {
        public required int Id { get; set; }

        public required int userId { get; set; }

        public required int FlightId { get; set; }

        public required int SeatNumber {  get; set; }
        
        public required int Price { get; set; }

        public required bool PaymentVerfied { get; set;}
    }
}
 