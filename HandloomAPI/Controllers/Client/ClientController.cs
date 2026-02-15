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

namespace TrabullsAPI.Controllers
{
    [Authorize]
    [Route("api/Client/")]
    [ApiController]
    public class ClientController : BaseController
    {
        private readonly IConfiguration _configuration;
        public ClientController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// This API Return List of Clients
        /// </summary>
        /// <returns>List of Clients</returns>
        [HttpGet("GetClients")]
        public IActionResult GetClients()
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                clsResult result = dBConnection.execute("dbo.ClientMaster_Get");
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new APIResult() { success = true, message = null, data = result.GetDataList<Client_ViewModel>() }
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
        /// This API Return Client detail
        /// </summary>
        /// <returns>Client detail</returns>
        [HttpGet("GetClient")]
        public IActionResult GetClient(int ClientID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);

                if (ClientID == 0)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = "Please Enter ClientID.", data = null });
                }
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ClientID", ClientID));
                clsResult result = dBConnection.execute("dbo.ClientMaster_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new APIResult() { success = true, message = null, data = result.GetData<Client_ViewModel>() }
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
        /// This API used for Saving Client
        /// </summary>
        [HttpPost("SaveClient")]
        public IActionResult SaveClient([FromBody]Client_AddModel model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ClientID", model.ClientID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ClientCode", model.ClientCode));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ClientName", model.ClientName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Address1", model.Address1));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Address2", model.Address2));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Country", model.Country));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@State", model.State));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@City", model.City));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ZipCode", model.ZipCode));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContactPerson", model.ContactPerson));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContactPersonPhoneNo", model.ContactPersonPhoneNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PhoneNo", model.PhoneNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@EmailID", model.EmailID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@IsActive", model.IsActive));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", contextData.UserID));
                clsResult result = dBConnection.execute("dbo.ClientMaster_Add", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                FormSaveModel obj = result.GetData<FormSaveModel>();
                if (obj.HasError)
                {
                    return new NotFoundObjectResult(new { success = obj.HasError, message = obj.Message, data = obj.ID });
                }
                return Ok(
                    new { success = obj.HasError, message = obj.Message, data = obj.ID}
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
        /// This API Used for Refresh Client Credential
        /// </summary>
        [HttpGet("RefreshClientCredential")]
        public IActionResult RefreshClientCredential()
        {
            try
            {
                TrabullsAPI.Models.Client.ClientCredetial objBL = new Models.Client.ClientCredetial(_configuration);
                objBL.RefreshCredential();

                return Ok(
                    new APIResult() { success = true, message = null, data = null}
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
