using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.User
{
    public class UserGroupClient_ViewModel
    {
        public long GroupID { get; set; }
        public string GroupName { get; set; }
        public long UserID { get; set; }
        public string ClientCode { get; set; }
        public string UserName { get; set; }
        public bool IsActive { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
