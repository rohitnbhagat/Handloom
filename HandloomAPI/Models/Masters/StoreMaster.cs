using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.StoreMaster
{
    public class StoreMaster_AddModel
    {
        public long StoreID { get; set; }
        public string StoreName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Postcode { get; set; }
        public string Country { get; set; }
        public string EmailID { get; set; }
        public string PhoneNo { get; set; }
        public string ContactPerson { get; set; }
        public List<StoreLocationMaster_AddModel> Locations { get; set; }
    }
    public class StoreLocationMaster_AddModel
    {
        public long StoreLocationID { get; set; }
        public string LocationCode { get; set; }
        public string LocationName { get; set; }
    }
    public class StoreMaster_ViewModel
    {
        public long StoreID { get; set; }
        public string StoreName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Postcode { get; set; }
        public string Country { get; set; }
        public string EmailID { get; set; }
        public string PhoneNo { get; set; }
        public string ContactPerson { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class StoreLocationMaster_ViewModel
    {
        public long StoreLocationID { get; set; }
        public string LocationCode { get; set; }
        public string LocationName { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
