using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace TestWCFService.DataContracts
{
    [DataContract]
    public class GenreContract
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Title { get; set; }
    }
}