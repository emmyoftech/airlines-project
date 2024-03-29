﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using eproject.Data;

#nullable disable

namespace eproject.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240201161857_SeedUserTable")]
    partial class SeedUserTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("eproject.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LogStatus")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RegisteredOn")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Email = "emmanuelbowofoluwa@gmail.com",
                            EmailConfirmed = false,
                            FirstName = "emmanuel",
                            LastName = "lasisi",
                            LogStatus = "loggedin",
                            Password = "dustbin40",
                            RegisteredOn = "1/1/2024"
                        },
                        new
                        {
                            Id = 2,
                            Email = "josephbowofoluwa@gmail.com",
                            EmailConfirmed = false,
                            FirstName = "joseph",
                            LastName = "lasisi",
                            LogStatus = "loggedin",
                            Password = "dustbin40",
                            RegisteredOn = "1/1/2024"
                        },
                        new
                        {
                            Id = 3,
                            Email = "paulbowofoluwa@gmail.com",
                            EmailConfirmed = false,
                            FirstName = "paul",
                            LastName = "lasisi",
                            LogStatus = "loggedin",
                            Password = "dustbin40",
                            RegisteredOn = "1/1/2024"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
