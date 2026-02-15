using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.User
{
    public class UserGroupClient_AddModel
    {
        public long groupID { get; set; }
        public List<UserGroupClient> Clients { get; set; }
    }

    public class UserGroupClient
    { 
        public long UserID { get; set; }
    }
}
