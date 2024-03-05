using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace eproject.Migrations
{
    /// <inheritdoc />
    public partial class AddedProfileImageTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.CreateTable(
                name: "ProfileImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ext = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileImages", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfileImages");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "EmailConfirmed", "FirstName", "Gender", "LastName", "LogStatus", "Password", "PhoneNumber", "RegisteredOn", "Role" },
                values: new object[,]
                {
                    { 1, "emmanuelbowofoluwa@gmail.com", false, "emmanuel", "male", "lasisi", "loggedin", "dustbin40", "9066057393", "1/1/2024", "admin" },
                    { 2, "josephbowofoluwa@gmail.com", false, "joseph", "male", "lasisi", "loggedin", "dustbin40", "9066057393", "1/1/2024", "customer" },
                    { 3, "paulbowofoluwa@gmail.com", false, "paul", "male", "lasisi", "loggedin", "dustbin40", "9066057393", "1/1/2024", "customer" }
                });
        }
    }
}
