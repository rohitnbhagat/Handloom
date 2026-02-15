using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.User
{
    public class UserGroup_ViewModel
    {
        public long GroupID { get; set; }
        public string GroupName { get; set; }
        public string Remarks { get; set; }
        public bool IsActive { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
