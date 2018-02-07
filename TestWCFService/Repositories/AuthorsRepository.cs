using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TestWCFService.EF;
using TestWCFService.DataContracts;
using TestWCFService.Models;

namespace TestWCFService.Repositories
{
    public class AuthorsRepository
    {
        private readonly DbContext _context;

        public AuthorsRepository()
        {
            _context = new DbContext();
        }

        public List<AuthorContract> GetAuthors()
        {
            List<AuthorContract> authors = new List<AuthorContract>();
            _context.Authors.ToList().ForEach(x =>
               authors.Add(new AuthorContract
               {
                   Id = x.Id,
                   FirstName = x.FirstName,
                   LastName = x.LastName
               }
             )
            );

            return authors;
        }

        public AuthorContract GetAuthor(int id)
        {
            Author author = _context.Authors.Single(x => x.Id == id);
            return new AuthorContract
            {
                Id = author.Id,
                FirstName = author.FirstName,
                LastName = author.LastName
            };
        }

        public void AddAuthor(AuthorContract author)
        {
            Author res_author = new Author
            {
                FirstName = author.FirstName,
                LastName = author.LastName
            };

            _context.Authors.Add(res_author);
            _context.SaveChanges();
        }

        public void DeleteAuthor(int id)
        {
            var author = _context.Authors.Single(x => x.Id == id);
            _context.Books.RemoveRange(author.Books);
            _context.Authors.Remove(author);
            _context.SaveChanges();
        }

        public void EditAuthor(AuthorContract author)
        {
            var editable_author = _context.Authors.Single(x => x.Id == author.Id);

            editable_author.FirstName = author.FirstName;
            editable_author.LastName = author.LastName;

            _context.Entry(editable_author).State = System.Data.Entity.EntityState.Modified;
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