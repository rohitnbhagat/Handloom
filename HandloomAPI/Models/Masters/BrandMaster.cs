using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.BrandMaster
{
    public class BrandMaster_AddModel
    {
        public long BrandID { get; set; }
        public string BrandName { get; set; }
        public string BrandLogo { get; set; }
        public string Remarks { get; set; }
    }
    public class BrandMaster_ViewModel
    {
        public long BrandID { get; set; }
        public string BrandName { get; set; }
        public string BrandLogo { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
