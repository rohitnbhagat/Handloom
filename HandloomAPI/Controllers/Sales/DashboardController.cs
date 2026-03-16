using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrabullsAPI.Controllers;
using HandloomAPI.Models.Masters.CreditTypeMaster;
using TrabullsAPI;
using TrabullsAPI.Models.DBOperation;
using System.Collections;
using TrabullsAPI.Models;
using HandloomAPI.Models.Sales;
using System.Data;

namespace HandloomAPI.Controllers.Sales
{
    [Route("api/Sales/Dashboard")]
    [ApiController]
    public class DashboardController : BaseController
    {
        private readonly IConfiguration _configuration;
        public DashboardController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetPendingCounts")]
        public IActionResult GetPendingCounts()
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                clsResult result = dBConnection.execute("dbo.Dashboard_Counts", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<Dashboard_Pending_Count_Model> obj = result.GetDataList<Dashboard_Pending_Count_Model>();
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

        [HttpGet("GetPendingCountsDetails")]
        public IActionResult GetPendingCountsDetails(int SrNo)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SrNo", SrNo));
                clsResult result = dBConnection.execute("dbo.Dashboard_Counts_Details", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    var dynamicList = result.ResultDataTable.AsEnumerable().Select(row =>
                                            result.ResultDataTable.Columns.Cast<DataColumn>().ToDictionary(
                                                column => column.ColumnName,
                                                column => row[column] == DBNull.Value ? null : row[column]
                                            )
                                        );
                    return Ok(new
                    {
                        success = true,
                        message = "success",
                        data = dynamicList
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
