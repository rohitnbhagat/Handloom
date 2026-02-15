using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Controllers
{
    public class BaseController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public BaseController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public BaseController() { 
        
        }

        protected IConfiguration GetConfiguration
        {
            get {
                return _configuration;
            }
        }
    }
}
