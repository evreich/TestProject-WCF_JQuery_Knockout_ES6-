using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using TestWCFService.DataContracts;

namespace TestWCFService
{
    [ServiceContract]
    public interface IServiceForBooks
    {
        [OperationContract]
        [WebInvoke(
            UriTemplate = "/count",
            Method = "GET",
            BodyStyle = WebMessageBodyStyle.WrappedResponse,
            ResponseFormat = WebMessageFormat.Json)
        ]
        [return: MessageParameter(Name = "Count")]
        int GetCountBooks();

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/{page}/{countItemOnPage}",
            Method = "GET",
            BodyStyle = WebMessageBodyStyle.WrappedResponse,
            ResponseFormat = WebMessageFormat.Json)
        ]
        [return: MessageParameter(Name = "Books")]
        List<BookContract> GetBooks(string page, string countItemOnPage);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/", 
            Method = "GET",
            BodyStyle = WebMessageBodyStyle.WrappedResponse,
            ResponseFormat = WebMessageFormat.Json)
        ]
        [return: MessageParameter(Name = "Books")]
        List<BookContract> GetAllBooks();

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/{id}", 
            Method = "GET",
            BodyStyle = WebMessageBodyStyle.WrappedResponse,
            ResponseFormat = WebMessageFormat.Json)
        ]
        [return: MessageParameter(Name = "Book")]
        BookContract GetBook(string id);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/add", 
            Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            RequestFormat = WebMessageFormat.Json)
        ]
        void AddBook(BookContract book);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/edit", 
            Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            RequestFormat = WebMessageFormat.Json)
        ]
        void EditBook(BookContract book);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/delete/{id}", 
            Method = "DELETE")
        ]
        void DeleteBook(string id);
    }
}
