using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.DueDaysMaster
{
    public class DueDaysMaster_AddModel
    {
        public long DueDaysID { get; set; }
        public string DueDaysName { get; set; }
        public string Remarks { get; set; }
    }
    public class DueDaysMaster_ViewModel
    {
        public long DueDaysID { get; set; }
        public string DueDaysName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
