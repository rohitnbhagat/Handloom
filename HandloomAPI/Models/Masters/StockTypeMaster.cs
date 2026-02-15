using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.StockTypeMaster
{
    public class StockTypeMaster_AddModel
    {
        public long StockTypeID { get; set; }
        public string StockTypeName { get; set; }
        public string Remarks { get; set; }
    }
    public class StockTypeMaster_ViewModel
    {
        public long StockTypeID { get; set; }
        public string StockTypeName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
