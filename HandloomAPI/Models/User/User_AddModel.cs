using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.User
{
    public class User_AddModel
    {
        public long userID { get; set; }
        public long userTypeID { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string middleName { get; set; }
        public string clientCode { get; set; }
        public string userName { get; set; }
        public string password { get; set; }
    }
}
