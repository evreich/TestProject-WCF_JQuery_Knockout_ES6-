﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TestWCFService.Models;
using TestWCFService.EF;
using TestWCFService.DataContracts;

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
                        Id     = x.Id,
                        Title  = x.Title,
                        Author = x.Author.FirstName + ' ' + x.Author.LastName,
                        Genre  = x.Genre.Title,
                        DateRealise = x.DateRealise
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
                Author = book.Author.FirstName + ' ' + book.Author.LastName,
                Genre = book.Genre.Title,
                DateRealise = book.DateRealise
            };
        }

        public void AddBook(BookContract book)
        {
            Book res_book = new Book
            {
                Title = book.Title,
                DateRealise = book.DateRealise
            };

            var authorInfo = book.Author.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries);

            _context.Books.Add(res_book);
            _context.Authors.Single(x => x.FirstName == authorInfo[0] && x.LastName == authorInfo[1]).Books.Add(res_book);
            _context.Genres.Single(x => x.Title == book.Title).Books.Add(res_book);
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
            editable_book.DateRealise = book.DateRealise;

            var authorInfo = book.Author.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries);
            editable_book.Author = _context.Authors.Single(x => x.FirstName == authorInfo[0] && x.LastName == authorInfo[1]);
            editable_book.Genre = _context.Genres.Single(x => x.Title == book.Title);
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