using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.PartyMaster
{
    public class PartyMaster_AddModel
    {
        public long PartyID { get; set; }
        public long PartyTypeID { get; set; }
        public string PartyName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PartyCode { get; set; }
        public string Alias { get; set; }
        public string EmailID { get; set; }
        public string GSTNo { get; set; }
        public string PANNo { get; set; }
        public string StateCode { get; set; }
        public string ECCNo { get; set; }
        public string Website { get; set; }
        public string BankName { get; set; }
        public string BankAddress { get; set; }
        public string BankAccountNo { get; set; }
        public string BankIFSCCode { get; set; }
        public string Remarks { get; set; }
        public List<PartyAddress_AddModel> PartyAddress { get; set; }
    }
    public class PartyAddress_AddModel
    {
        public long PartyAddressID { get; set; }
        public long AddressTypeID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public long CityID { get; set; }
        public long StateID { get; set; }
        public string Postcode { get; set; }    
        public long CountryID { get; set; }
        public string EmailID { get; set; }
        public string PhoneNo { get; set; }
    }
    public class PartyMaster_ViewModel
    {
        public long PartyID { get; set; }
        public long PartyTypeID { get; set; }
        public string PartyTypeName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PartyName { get; set; }
        public string PartyCode { get; set; }
        public string Alias { get; set; }
        public string EmailID { get; set; }
        public string GSTNo { get; set; }
        public string PANNo { get; set; }
        public string StateCode { get; set; }
        public string ECCNo { get; set; }
        public string Website { get; set; }
        public string BankName { get; set; }
        public string BankAddress { get; set; }
        public string BankAccountNo { get; set; }
        public string BankIFSCCode { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class PartyAddress_ViewModel
    {
        public long PartyAddressID { get; set; }
        public long AddressTypeID { get; set; }
        public string AddressTypeName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public long CityID { get; set; }
        public string CityName { get; set; }
        public long StateID { get; set; }
        public string StateCode { get; set; }
        public string StateName { get; set; }
        public string Postcode { get; set; }
        public long CountryID { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public string EmailID { get; set; }
        public string PhoneNo { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
