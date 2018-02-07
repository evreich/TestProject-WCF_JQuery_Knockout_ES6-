using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace TestWCFService.Models
{
    public class Genre
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public virtual ICollection<Book> Books { get; set; }

        public Genre()
        {
            Books = new List<Book>();
        }
    }
}