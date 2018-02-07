using System;
using System.Collections.Generic;

namespace TestWCFService.Models
{
    public class Author
    {
        public int Id           { get; set; }
        public string FirstName { get; set; }
        public string LastName  { get; set; }

        public virtual ICollection<Book> Books { get; set; }

        public Author()
        {
            Books = new List<Book>();
        }
    }
}