using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.CreditTypeMaster
{
    public class CreditTypeMaster_AddModel
    {
        public long CreditTypeID { get; set; }
        public string CreditTypeName { get; set; }
        public string Remarks { get; set; }
    }
    public class CreditTypeMaster_ViewModel
    {
        public long CreditTypeID { get; set; }
        public string CreditTypeName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
