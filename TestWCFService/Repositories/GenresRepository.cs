using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TestWCFService.DataContracts;
using TestWCFService.EF;
using TestWCFService.Models;

namespace TestWCFService.Repositories
{
    public class GenresRepository
    {
        private readonly DbContext _context;

        public GenresRepository()
        {
            _context = new DbContext();
        }

        public List<GenreContract> GetGenres()
        {
            List<GenreContract> genres = new List<GenreContract>();
            _context.Genres.ToList().ForEach(x =>
               genres.Add(new GenreContract
               {
                   Id = x.Id,
                   Title = x.Title
               }
             )
            );

            return genres;
        }

        public GenreContract GetGenre(int id)
        {
            Genre genre = _context.Genres.Single(x => x.Id == id);
            return new GenreContract
            {
                Id = genre.Id,
                Title = genre.Title
            };
        }

        public void AddGenre(GenreContract genre)
        {
            Genre res_genre = new Genre
            {
                Title = genre.Title
            };

            _context.Genres.Add(res_genre);
            _context.SaveChanges();
        }

        public void DeleteGenre(int id)
        {
            var genre = _context.Genres.Single(x => x.Id == id);
            _context.Books.RemoveRange(genre.Books);
            _context.Genres.Remove(genre);
            _context.SaveChanges();

        }

        public void EditGenre(GenreContract genre)
        {
            var editable_genre = _context.Genres.Single(x => x.Id == genre.Id);

            editable_genre.Title = genre.Title;

            _context.Entry(editable_genre).State = System.Data.Entity.EntityState.Modified;
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