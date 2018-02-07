using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Threading.Tasks;
using TestWCFService.DataContracts;

namespace TestWCFService
{
    [ServiceContract]
    public interface IServiceForGenres
    {
        [OperationContract]
        [WebInvoke(
            UriTemplate = "/",
            Method = "GET",
            BodyStyle = WebMessageBodyStyle.WrappedResponse,
            ResponseFormat = WebMessageFormat.Json)
        ]
        [return: MessageParameter(Name = "Genres")]
        List<GenreContract> GetGenres();

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/{id}",
            Method = "GET",
            BodyStyle = WebMessageBodyStyle.WrappedResponse,
            ResponseFormat = WebMessageFormat.Json)
        ]
        [return: MessageParameter(Name = "Genre")]
        GenreContract GetGenre(string id);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/add",
            Method = "POST",
            BodyStyle = WebMessageBodyStyle.Bare,
            RequestFormat = WebMessageFormat.Json)
        ]
        void AddGenre(GenreContract genre);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/edit",
            Method = "PUT",
            BodyStyle = WebMessageBodyStyle.Bare,
            RequestFormat = WebMessageFormat.Json)
        ]
        void EditGenre(GenreContract genre);

        [OperationContract]
        [WebInvoke(
            UriTemplate = "/delete/{id}",
            Method = "DELETE")
        ]
        void DeleteGenre(string id);
    }
}
