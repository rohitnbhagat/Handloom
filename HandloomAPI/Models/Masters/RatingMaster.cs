using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.RatingMaster
{
    public class RatingMaster_AddModel
    {
        public long RatingID { get; set; }
        public string RatingName { get; set; }
        public string Remarks { get; set; }
    }
    public class RatingMaster_ViewModel
    {
        public long RatingID { get; set; }
        public string RatingName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
