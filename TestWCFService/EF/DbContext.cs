using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TestWCFService.Models;

namespace TestWCFService.EF
{
    public class DbContext : System.Data.Entity.DbContext
    {
        static DbContext()
        {
            Database.SetInitializer(new MyContextInitializer());
        }

        public DbContext() : base("BookContext")
        {
        }

        public DbSet<Genre> Genres { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Book> Books { get; set; }
    }

    class MyContextInitializer : DropCreateDatabaseAlways<DbContext>
    {
        protected override void Seed(DbContext db)
        {
            Genre genre1 = new Genre { Title = "Detective" };
            Genre genre2 = new Genre { Title = "Novel" };
            Genre genre3 = new Genre { Title = "Fantastic" };
            db.Genres.AddRange(new List<Genre>() { genre1, genre2, genre3 });
            db.SaveChanges();

            Author auth1 = new Author { FirstName = "Arthur Conan", LastName = "Doyle" };
            Author auth2 = new Author { FirstName = "Stephen", LastName = "King" };
            Author auth3 = new Author { FirstName = "Nora", LastName = "Roberts" };
            db.Authors.AddRange(new List<Author>() { auth1, auth2, auth3 });
            db.SaveChanges();

            Book book1 = new Book { Title = "It", Author = auth2, Genre = genre3, DateRealise = new DateTime(1986, 1, 1) };
            Book book2 = new Book { Title = "Sherlock Holms", Author = auth1, Genre = genre1, DateRealise = new DateTime(1887, 1, 1) };
            Book book3 = new Book { Title = "Glory in death", Author = auth3, Genre = genre2, DateRealise = new DateTime(1995, 1, 1) };
            db.Books.AddRange(new List<Book>() { book1, book2, book3 });
            db.SaveChanges();
        }
    }
}