using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.User
{
    public class LoginUser_ViewModel
    {
        public long UserID { get; set; }
        public long UserTypeID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public string EmailID { get; set; }
        public string Photo { get; set; }
    }
}
