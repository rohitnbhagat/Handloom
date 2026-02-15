using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.SalesLocationMaster
{
    public class SalesLocationMaster_AddModel
    {
        public long SalesLocationID { get; set; }
        public string SalesLocationName { get; set; }
        public string Remarks { get; set; }
    }
    public class SalesLocationMaster_ViewModel
    {
        public long SalesLocationID { get; set; }
        public string SalesLocationName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
