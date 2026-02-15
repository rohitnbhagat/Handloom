using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrabullsAPI.Models.DBOperation;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using TrabullsAPI.Models;
using System.Collections;
using System.Reflection;

namespace TrabullsAPI.Controllers
{
    [Route("api/User/")]
    [ApiController]
    public class UserTypeController : BaseController
    {
        private readonly IConfiguration _configuration;
        public UserTypeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// This API Return List of User Types
        /// </summary>
        /// <returns>List of User Types</returns>
        [HttpGet("GetUserTypes")]
        public IActionResult GetUserTypes()
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                clsResult result = dBConnection.execute("dbo.UserTypeMaster_Get");
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new APIResult() { success = true, message = null, data = result.GetDataList<UserType_ViewModel>() }
                    );
            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        /// <summary>
        /// This API Return User Type detail
        /// </summary>
        /// <returns>List of User Type detail</returns>
        [HttpGet("GetUserType")]
        public IActionResult GetUserType(int UserTypeID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);

                if (UserTypeID == 0)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = "Please Enter UserTypeID.", data = null });
                }
                DBOperation dBConnection = new DBOperation(_configuration,  contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserTypeID", UserTypeID));
                clsResult result = dBConnection.execute("dbo.UserTypeMaster_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new APIResult() { success = true, message = null, data = result.GetData<UserType_ViewModel>() }
                    );
            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }
    }
}
