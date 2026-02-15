using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.ExhitionMaster
{
    public class ExhitionMaster_AddModel
    {
        public long ExhitionID { get; set; }
        public string ExhitionName { get; set; }
        public string Remarks { get; set; }
    }
    public class ExhitionMaster_ViewModel
    {
        public long ExhitionID { get; set; }
        public string ExhitionName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
