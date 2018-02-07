using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace TestWCFService.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? GenreId { get; set; }
        public virtual Genre Genre { get; set; }
        public int? AuthorId { get; set; }
        public virtual Author Author { get; set; }
        public DateTime DateRealise { get; set; }

        public Book()
        {
        }
    }
}