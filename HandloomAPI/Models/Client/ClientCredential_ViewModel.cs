using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.Client
{
    public class ClientCredential_ViewModel
    {
        public long ID { get; set; }
        public long ClientID { get; set; }
        public string ClientCode { get; set; }
        public string ClientName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string APIKey { get; set; }
        public bool IsActive { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }

    public class ClientCredetial
    {
        private readonly IConfiguration _configuration;
        public ClientCredetial(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void RefreshCredential()
        {
            TrabullsAPI.Models.DBOperation.DBOperation dBConnection = new TrabullsAPI.Models.DBOperation.DBOperation(_configuration);
            TrabullsAPI.Models.DBOperation.clsResult result = dBConnection.execute("dbo.ClientMasterCredential_Get");
            if (!result.HasError && result.HasData)
            {
                Data.lstUsers = result.GetDataList<ClientCredential_ViewModel>();
            }

        }
    }
}
