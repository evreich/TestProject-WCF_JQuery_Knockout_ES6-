using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using TestWCFService.DataContracts;
using TestWCFService.Repositories;

namespace TestWCFService
{
    public class ServiceForBooks : IServiceForBooks
    {
        private readonly BooksRepository _repository;

        public ServiceForBooks()
        {
            _repository = new BooksRepository();
        }

        public void AddBook(BookContract book)
        {
            //TODO: Error handling
            _repository.AddBook(book);
        }

        public void DeleteBook(string id)
        {
            //TODO: Error handling
            _repository.DeleteBook(int.Parse(id));
        }

        public void EditBook(BookContract book)
        {
            //TODO: Error handling
            _repository.EditBook(book);
        }

        public BookContract GetBook(string id)
        {
            //TODO: Error handling
            return _repository.GetBook(int.Parse(id));
        }

        public List<BookContract> GetBooks()
        {
            //TODO: Error handling
            return _repository.GetBooks();
        }
    }
}
