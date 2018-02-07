using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace TestWCFService.DataContracts
{
    [DataContract]
    public class BookContract
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public string Genre { get; set; }
        [DataMember]
        public string Author { get; set; }
        [DataMember]
        public DateTime DateRealise { get; set; }
    }
}