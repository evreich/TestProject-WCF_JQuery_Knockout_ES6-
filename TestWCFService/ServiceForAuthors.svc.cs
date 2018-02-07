using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using TestWCFService.DataContracts;
using TestWCFService.Repositories;

namespace TestWCFService
{
    public class ServiceForAuthors : IServiceForAuthors
    {
        private readonly AuthorsRepository _repository;

        public ServiceForAuthors()
        {
            _repository = new AuthorsRepository();
        }

        public void AddAuthor(AuthorContract author)
        {
            _repository.AddAuthor(author);
        }

        public void DeleteAuthor(string id)
        {
            _repository.DeleteAuthor(int.Parse(id));
        }

        public void EditAuthor(AuthorContract author)
        {
            _repository.EditAuthor(author);
        }

        [return: MessageParameter(Name = "Author")]
        public AuthorContract GetAuthor(string id)
        {
            return _repository.GetAuthor(int.Parse(id));
        }

        [return: MessageParameter(Name = "Authors")]
        public List<AuthorContract> GetAuthors()
        {
            return _repository.GetAuthors();
        }
    }
}
