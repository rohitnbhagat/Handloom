using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.ComponentMaster
{
    public class ComponentMaster_AddModel
    {
        public long ComponentID { get; set; }
        public string ComponentName { get; set; }
        public string Remarks { get; set; }
    }
    public class ComponentMaster_ViewModel
    {
        public long ComponentID { get; set; }
        public string ComponentName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
