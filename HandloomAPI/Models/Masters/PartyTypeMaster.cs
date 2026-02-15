using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.PartyTypeMaster
{
    public class PartyTypeMaster_AddModel
    {
        public long PartyTypeID { get; set; }
        public string PartyTypeName { get; set; }
        public string Remarks { get; set; }
    }
    public class PartyTypeMaster_ViewModel
    {
        public long PartyTypeID { get; set; }
        public string PartyTypeName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
