using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using TrabullsAPI.Models;
using TrabullsAPI.Models.DBOperation;
using TrabullsAPI.Models.User;

namespace TrabullsAPI.Controllers.UserGroup
{
    [EnableCors]
    [Route("api/UserGroup/")]
    [ApiController]
    public class UserGroupController : BaseController
    {
        private readonly IConfiguration _configuration;
        public UserGroupController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        
        /// <summary>
        /// This API Used to get UserGroup info
        /// </summary>
        [HttpGet("Get")]
        public IActionResult Get(Int64 GroupID, string GroupName)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GroupID", GroupID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GroupName", GroupName));
                clsResult result = dBConnection.execute("dbo.ClientGroupMaster_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<UserGroup_ViewModel> obj = result.GetDataList<UserGroup_ViewModel>();
                    return Ok(new
                    {
                        success = true,
                        message = "success",
                        data = obj
                    });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        /// <summary>
        /// This API Used for Active and InActive
        /// </summary>
        [HttpPost("ActiveInActive")]
        public IActionResult ActiveInActive(long GroupID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GroupID", GroupID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.ClientGroupMaster_ActiveInActive", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully unlocked", data = GroupID }
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
        /// This API Used for Delete
        /// </summary>
        [HttpPost("Delete")]
        public IActionResult Delete(long GroupID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GroupID", GroupID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.ClientGroupMaster_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = GroupID }
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
        /// This API Used for Create
        /// </summary>
        [HttpPost("Create")]
        public IActionResult Create(UserGroup_AddModel UserGroup)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration,  contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GroupID", UserGroup.groupID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GroupName", UserGroup.groupName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", UserGroup.remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@IsActive", UserGroup.isActive));
                clsResult result = dBConnection.execute("dbo.ClientGroupMaster_Create", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                FormSaveModel obj = result.GetData<FormSaveModel>();
                if (obj.HasError)
                {
                    return Ok(new { success = !obj.HasError, message = obj.Message, data = obj.ID });
                }
                return Ok(
                    new { success = !obj.HasError, message = obj.Message, data = obj.ID }
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
        /// This API Used for Create Clients
        /// </summary>
        [HttpPost("CreateClients")]
        public IActionResult CreateClients(UserGroupClient_AddModel UserGroup)
        {
            try
            {
                DataTable dtUsers = Common.ToDataTable(UserGroup.Clients);
                if (dtUsers != null && dtUsers.Rows.Count > 0)
                {
                    ContextData contextData = Common.GetContextData(Request);
                    DBOperation dBConnection = new DBOperation(_configuration, contextData);
                    ArrayList alparameter = new ArrayList();
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@GroupID", UserGroup.groupID));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@Users", dtUsers));
                    clsResult result = dBConnection.executeNonQuery("dbo.ClientGroupMaster_AddUser", alparameter);
                    if (result.HasError)
                    {
                        return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                    }
                    else
                    {
                        return Ok(
                            new { success = true, message = "Client successfully save.", data = dtUsers.Rows.Count }
                            );
                    }
                }
                else
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = "something wents wrong", data = null });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        /// <summary>
        /// This API Used for Delete Clients
        /// </summary>
        [HttpPost("DeleteClients")]
        public IActionResult DeleteClients(UserGroupClient_AddModel UserGroup)
        {
            try
            {
                DataTable dtUsers = Common.ToDataTable(UserGroup.Clients);
                if (dtUsers != null && dtUsers.Rows.Count > 0)
                {
                    ContextData contextData = Common.GetContextData(Request);
                    DBOperation dBConnection = new DBOperation(_configuration,  contextData);
                    ArrayList alparameter = new ArrayList();
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@GroupID", UserGroup.groupID));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@Users", dtUsers));
                    clsResult result = dBConnection.executeNonQuery("dbo.ClientGroupMaster_DeleteUser", alparameter);
                    if (result.HasError)
                    {
                        return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                    }
                    else
                    {
                        return Ok(
                            new { success = true, message = "Client successfully deleted.", data = dtUsers.Rows.Count }
                            );
                    }
                }
                else
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = "something wents wrong", data = null });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        /// <summary>
        /// This API Used to get Group clients
        /// </summary>
        [HttpGet("GetClients")]
        public IActionResult GetClients(Int64 GroupID, Int64 UserID, string UserName)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration,  contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GroupID", GroupID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserName", UserName));
                clsResult result = dBConnection.execute("dbo.ClientGroupMaster_GetUser", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<UserGroupClient_ViewModel> obj = result.GetDataList<UserGroupClient_ViewModel>();
                    return Ok(new
                    {
                        success = true,
                        message = "success",
                        data = obj
                    });
                }

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
