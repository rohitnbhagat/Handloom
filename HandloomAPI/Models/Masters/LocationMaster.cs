using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.Location
{
    public class CountryMaster_AddModel
    {
        public long CountryID { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
    }
    public class CountryMaster_ViewModel
    {
        public long CountryID { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }

    public class StateMaster_AddModel
    {
        public long StateID { get; set; }
        public long CountryID { get; set; }
        public string StateCode { get; set; }
        public string StateName { get; set; }
    }
    public class StateMaster_ViewModel
    {
        public long StateID { get; set; }
        public long CountryID { get; set; }
        public string StateCode { get; set; }
        public string StateName { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }

    public class CityMaster_AddModel
    {
        public long CityID { get; set; }
        public long CountryID { get; set; }
        public long StateID { get; set; }
        public string CityName { get; set; }
    }
    public class CityMaster_ViewModel
    {
        public long CityID { get; set; }
        public long CountryID { get; set; }
        public long StateID { get; set; }
        public string CityName { get; set; }
        public string StateCode { get; set; }
        public string StateName { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
