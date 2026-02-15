using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.ProcessMaster
{
    public class ProcessMaster_AddModel
    {
        public long ProcessID { get; set; }
        public string ProcessName { get; set; }
        public string Remarks { get; set; }
    }
    public class ProcessMaster_ViewModel
    {
        public long ProcessID { get; set; }
        public string ProcessName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
