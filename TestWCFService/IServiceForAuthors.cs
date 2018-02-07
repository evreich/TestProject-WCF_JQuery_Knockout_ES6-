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
    // ПРИМЕЧАНИЕ. Команду "Переименовать" в меню "Рефакторинг" можно использовать для одновременного изменения имени интерфейса "IServiceForAuthors" в коде и файле конфигурации.
    [ServiceContract]
    public interface IServiceForAuthors
    {
        [OperationContract]
        [WebInvoke(
            UriTemplate = "/",
            Method = "GET",
            BodyStyle = WebMessageBodyStyle.WrappedResponse,
            ResponseFormat = WebMessageFormat.Json)
        ]
        [return: MessageParameter(Name = "Authors")]
        List<AuthorContract> GetAuthors();

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/{id}",
            Method = "GET",
            BodyStyle = WebMessageBodyStyle.WrappedResponse,
            ResponseFormat = WebMessageFormat.Json)
        ]
        [return: MessageParameter(Name = "Author")]
        AuthorContract GetAuthor(string id);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/add",
            Method = "POST",
            BodyStyle = WebMessageBodyStyle.Bare,
            RequestFormat = WebMessageFormat.Json)
        ]
        void AddAuthor(AuthorContract author);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/edit",
            Method = "PUT",
            BodyStyle = WebMessageBodyStyle.Bare,
            RequestFormat = WebMessageFormat.Json)
        ]
        void EditAuthor(AuthorContract author);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/delete/{id}",
            Method = "DELETE")
        ]
        void DeleteAuthor(string id);
    }
}
