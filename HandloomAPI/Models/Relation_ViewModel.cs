using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models
{
    public class Relation_ViewModel
    {
        public long RelationID { get; set; }
        public string RelationName { get; set; }
        public int OrderNo { get; set; }
        public bool IsActive { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
