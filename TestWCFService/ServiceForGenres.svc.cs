using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using TestWCFService.DataContracts;
using TestWCFService.Repositories;

namespace TestWCFService
{
    public class ServiceForGenres:IServiceForGenres
    {
        private readonly GenresRepository _repository;

        public ServiceForGenres()
        {
            _repository = new GenresRepository();
        }

        public void AddGenre(GenreContract genre)
        {
            _repository.AddGenre(genre);
        }

        public void DeleteGenre(string id)
        {
            _repository.DeleteGenre(int.Parse(id));
        }

        public void EditGenre(GenreContract genre)
        {
            _repository.EditGenre(genre);
        }

        [return: MessageParameter(Name = "Genre")]
        public GenreContract GetGenre(string id)
        {
            return _repository.GetGenre(int.Parse(id));
        }

        [return: MessageParameter(Name = "Genres")]
        public List<GenreContract> GetGenres()
        {
            return _repository.GetGenres();
        }
    }
}
