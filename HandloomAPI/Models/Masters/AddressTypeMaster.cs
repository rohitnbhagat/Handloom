using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.AddressTypeMaster
{
    public class AddressTypeMaster_AddModel
    {
        public long AddressTypeID { get; set; }
        public string AddressTypeName { get; set; }
        public string Remarks { get; set; }
    }
    public class AddressTypeMaster_ViewModel
    {
        public long AddressTypeID { get; set; }
        public string AddressTypeName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
