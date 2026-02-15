using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.Client
{
    public class ClientMaster_AddModel
    {
        public long ClientID { get; set; }
        public string ClientCode { get; set; }
        public string TOTP { get; set; }
        public string Password { get; set; }
        public bool IsActive { get; set; }
    }
}
