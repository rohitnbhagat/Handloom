using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.HSNCodeMaster
{
    public class HSNCodeMaster_AddModel
    {
        public long HSNCodeID { get; set; }
        public string HSNCodeName { get; set; }
        public string Remarks { get; set; }
    }
    public class HSNCodeMaster_ViewModel
    {
        public long HSNCodeID { get; set; }
        public string HSNCodeName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
