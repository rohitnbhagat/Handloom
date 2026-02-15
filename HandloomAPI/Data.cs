using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrabullsAPI.Models.Client;

namespace TrabullsAPI
{
    public class Data
    {
        public static List<ClientCredential_ViewModel> lstUsers = new List<ClientCredential_ViewModel>();

        public static Dictionary<string, string> Users = new Dictionary<string, string>() {
            { "rohit", "bhagat"},
            { "jayesh", "bhagat"}
        };
    }
}
