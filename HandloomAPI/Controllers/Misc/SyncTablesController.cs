using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrabullsAPI.Controllers;
using HandloomAPI.Models.Masters.PartyTypeMaster;
using TrabullsAPI;
using TrabullsAPI.Models.DBOperation;
using System.Collections;
using TrabullsAPI.Models;
using HandloomAPI.Models;

namespace HandloomAPI.Controllers.Misc
{
    [Route("api/Misc/SyncTables")]
    [ApiController]
    public class SyncTablesController : BaseController
    {
        private readonly IConfiguration _configuration;
        public SyncTablesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("AddHistory")]
        public IActionResult AddHistory(SyncTables_AddModel model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TableID", model.TableID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SyncStartDate", model.SyncStartDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SyncEndDate", model.SyncEndDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.execute("dbo.SyncTable_Add", alparameter);
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

        [HttpGet("GetTables")]
        public IActionResult GetTables()
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                clsResult result = dBConnection.execute("dbo.SyncTable_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<SyncTables_ViewModel> obj = result.GetDataList<SyncTables_ViewModel>();
                    foreach (SyncTables_ViewModel m in obj)
                        m.LastSyncDate = (m.LastSyncDate != null) ? DateTime.SpecifyKind(m.LastSyncDate.Value, DateTimeKind.Utc) : m.LastSyncDate;

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
