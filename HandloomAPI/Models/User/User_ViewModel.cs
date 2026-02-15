using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.User
{
    public class User_ViewModel
    {
        public long UserID { get; set; }
        public long UserTypeID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public string EmailID { get; set; }
        public string PhoneNo { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string ClientCode { get; set; }
        public string PANNo { get; set; }
        public string AadharCardNo { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public long? ParentUserID { get; set; }
        public string Relation { get; set; }
        public bool IsLocked { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
