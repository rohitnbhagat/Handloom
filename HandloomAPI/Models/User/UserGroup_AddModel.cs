using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.User
{
    public class UserGroup_AddModel
    {
        public long groupID { get; set; }
        public string groupName { get; set; }
        public string remarks { get; set; }
        public bool isActive { get; set; }
    }
}
