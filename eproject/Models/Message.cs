namespace eproject.Models
{
    public class Message
    {
        public required int Id { get; set; }

        public required bool IsMember { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required string Email { get; set; }

        public required string Text { get; set; }
    }
}
