using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TestWCFService.Models;
using TestWCFService.EF;
using TestWCFService.DataContracts;
using System.Globalization;

namespace TestWCFService.Repositories
{
    public class BooksRepository
    {
        private readonly DbContext _context;

        public BooksRepository()
        {
            _context = new DbContext();
        }

        public List<BookContract> GetBooks()
        {
            List<BookContract> books = new List<BookContract>();
            _context.Books.ToList().ForEach(x =>
               books.Add(new BookContract
               {
                   Id = x.Id,
                   Title = x.Title,
                   Author = x.Author.FirstName + " " + x.Author.LastName,
                   AuthorId = (int)x.AuthorId,
                   Genre = x.Genre.Title,
                   GenreId = (int)x.GenreId,
                   DateRealise = x.DateRealise.ToShortDateString()
               }
             )
            );

            return books;
        }

        public BookContract GetBook(int id)
        {
            Book book = _context.Books.Single(x => x.Id == id);
            return new BookContract
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author.FirstName + " " + book.Author.LastName,
                AuthorId = (int)book.AuthorId,
                Genre = book.Genre.Title,
                GenreId = (int)book.GenreId,
                DateRealise = book.DateRealise.ToShortDateString()
            };
        }

        public void AddBook(BookContract book)
        {
            Book res_book = new Book
            {
                Title = book.Title,
                DateRealise = DateTime.ParseExact(book.DateRealise, "yyyy/dd/MM", CultureInfo.InvariantCulture)
            };

            _context.Books.Add(res_book);
            _context.Authors.Single(x => x.Id == book.AuthorId).Books.Add(res_book);
            _context.Genres.Single(x => x.Id == book.GenreId).Books.Add(res_book);
            _context.SaveChanges(); 
        }

        public void DeleteBook(int id)
        {
            _context.Books.Remove(_context.Books.Single(x=>x.Id == id));
            _context.SaveChanges();

        }

        public void EditBook(BookContract book)
        {
            var editable_book = _context.Books.Single(x => x.Id == book.Id);

            editable_book.Title = book.Title;
            editable_book.DateRealise = DateTime.ParseExact(book.DateRealise, "yyyy/dd/MM", CultureInfo.InvariantCulture);

            editable_book.Author = _context.Authors.Single(x => x.Id == book.AuthorId);
            editable_book.Genre = _context.Genres.Single(x => x.Id == book.GenreId);
            _context.Entry(editable_book).State = System.Data.Entity.EntityState.Modified;
            _context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}