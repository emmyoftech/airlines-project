 namespace eproject.Models
{
    public class BuisnessClassSeat
    {
        public int Id { get; set; }

        public required int PlaneId { get; set; }

        public required int SeatNumber { get; set; }

        public required bool Occupied { get; set; }
    }
}
