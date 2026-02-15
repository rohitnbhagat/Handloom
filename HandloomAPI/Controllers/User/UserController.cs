using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrabullsAPI.Models;
using TrabullsAPI.Models.DBOperation;
using TrabullsAPI.Models.User;
using Microsoft.Extensions.Logging;

namespace TrabullsAPI.Controllers.User
{
    [EnableCors]
    [Route("api/User/")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserController> _logger;

        public UserController(IConfiguration configuration, ILogger<UserController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// This API Used for login
        /// </summary>
        [HttpPost("Login")]
        public IActionResult Login(UserCredential userCredential)
        {
            try
            {
                _logger.LogInformation("User login attempt: {Username}", userCredential.UserName);
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserName", userCredential.UserName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Password", userCredential.Password));
                clsResult result = dBConnection.execute("dbo.UserMaster_Login", alparameter);
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
                _logger.LogInformation("User login attempt: Exception" + ex.Message);
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        /// <summary>
        /// This API Used to get login user info
        /// </summary>
        [HttpGet("GetLoginUserInfo")]
        public IActionResult GetLoginUserInfo(Int64 UID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", UID));
                clsResult result = dBConnection.execute("dbo.UserMaster_Login_Info", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else {
                    LoginUser_ViewModel obj = result.GetData<LoginUser_ViewModel>();
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
        /// This API Used to get login user info
        /// </summary>
        [HttpGet("GetUsers")]
        public IActionResult GetUsers(Int64 UID, Int64 UserTypeID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", UID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserTypeID", UserTypeID));
                clsResult result = dBConnection.execute("dbo.UserMaster_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<User_ViewModel> obj = result.GetDataList<User_ViewModel>();
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
        /// This API Used for lock and Unlock
        /// </summary>
        [HttpPost("LockUnlock")]
        public IActionResult LockUnlock(long UserID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.UserMaster_LockUnlock", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully unlocked", data = UserID }
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
        public IActionResult Delete(long UserID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.UserMaster_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = UserID }
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
        public IActionResult Create(User_AddModel user)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", user.userID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserTypeID", user.userTypeID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@FirstName", user.firstName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@MiddleName", user.middleName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@LastName", user.lastName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ClientCode", user.clientCode));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserName", user.userName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Password", user.password));
                clsResult result = dBConnection.execute("dbo.UserMaster_Create", alparameter);
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
    }
}
