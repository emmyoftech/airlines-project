using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace eproject.Migrations
{
    /// <inheritdoc />
    public partial class SeedUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "EmailConfirmed", "FirstName", "LastName", "LogStatus", "Password", "RegisteredOn" },
                values: new object[,]
                {
                    { 1, "emmanuelbowofoluwa@gmail.com", false, "emmanuel", "lasisi", "loggedin", "dustbin40", "1/1/2024" },
                    { 2, "josephbowofoluwa@gmail.com", false, "joseph", "lasisi", "loggedin", "dustbin40", "1/1/2024" },
                    { 3, "paulbowofoluwa@gmail.com", false, "paul", "lasisi", "loggedin", "dustbin40", "1/1/2024" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
        }
    }
}
