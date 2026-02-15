using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models
{
    public class Client_AddModel
    {
        public long ClientID { get; set; }
        public string ClientCode { get; set; }
        public string ClientName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string ContactPerson { get; set; }
        public string ContactPersonPhoneNo { get; set; }
        public string PhoneNo { get; set; }
        public string EmailID { get; set; }
        public bool IsActive { get; set; }
    }
}
