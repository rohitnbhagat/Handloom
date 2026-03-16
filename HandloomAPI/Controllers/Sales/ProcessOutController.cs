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

namespace HandloomAPI.Controllers.Sales
{
    [Route("api/Sales/ProcessOut")]
    [ApiController]
    public class ProcessOutController : BaseController
    {
        private readonly IConfiguration _configuration;
        public ProcessOutController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Delete")]
        public IActionResult Delete(long ProcessOutID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutID", ProcessOutID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.ProcessOut_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = ProcessOutID }
                    );
            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        [HttpPost("Get")]
        public IActionResult Get(ProcessOut_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutID", model.ProcessOutID));
                if(model.FromDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@FromDate", model.FromDate));
                if (model.ToDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ToDate", model.ToDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutNo", model.ProcessOutNo));
                clsResult result = dBConnection.execute("dbo.ProcessOut_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProcessOut_ViewModel> obj = result.GetDataList<ProcessOut_ViewModel>();
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

        [HttpPost("Create")]
        public IActionResult Create(ProcessOut_AddModel model)
        {
            try
            {
                System.Data.DataTable dtItems = new System.Data.DataTable("Items");
                dtItems.Columns.Add("ID");
                dtItems.Columns.Add("WOPlanningItemComponentID");
                dtItems.Columns.Add("ProcessInItemID");
                dtItems.Columns.Add("WONo");
                dtItems.Columns.Add("ProcessInNo");
                dtItems.Columns.Add("SrNo");
                dtItems.Columns.Add("ParentProductID");
                dtItems.Columns.Add("ProductID");
                dtItems.Columns.Add("ComponentID");
                dtItems.Columns.Add("Qty");
                dtItems.Columns.Add("Remarks");

                if (model.Items != null)
                {
                    foreach (ProcessOut_Item_AddModel item in model.Items) 
                    {
                        System.Data.DataRow dr = dtItems.NewRow();
                        dr["ID"] = item.ID;
                        dr["WOPlanningItemComponentID"] = item.WOPlanningItemComponentID;
                        dr["ProcessInItemID"] = item.ProcessInItemID;
                        dr["WONo"] = item.WONo;
                        dr["ProcessInNo"] = item.ProcessInNo;
                        dr["SrNo"] = item.SrNo;
                        dr["ParentProductID"] = item.ParentProductID;
                        dr["ProductID"] = item.ProductID;
                        dr["ComponentID"] = item.ComponentID;
                        dr["Qty"] = item.Qty;
                        dr["Remarks"] = item.Remarks;
                        dtItems.Rows.Add(dr);
                    }
                    dtItems.AcceptChanges();
                }


                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutID", model.ProcessOutID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutNo", model.ProcessOutNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutDate", model.ProcessOutDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutType", model.ProcessOutType));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessID", model.ProcessID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", model.PartyID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@IssueType", model.IssueType));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WorkType", model.WorkType));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@StartDate", model.StartDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@EndDate", model.EndDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@DueDays", model.DueDays));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TotalQty", model.TotalQty));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items", dtItems));
                clsResult result = dBConnection.execute("dbo.ProcessOut_Add", alparameter);
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

        [HttpGet("GetOrderDetails")]
        public IActionResult GetOrderDetails(Int64 ProcessOutID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutID", ProcessOutID));
                clsResult result = dBConnection.execute("dbo.ProcessOut_Get_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProcessOut_Item_ViewModel> obj = result.GetDataList<ProcessOut_Item_ViewModel>();
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

        [HttpGet("GetPendingWorkOrders")]
        public IActionResult GetPendingWorkOrders(string IssueType, long ProcessID, long PartyID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@IssueType", IssueType));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessID", ProcessID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", PartyID));
                clsResult result = dBConnection.execute("dbo.ProcessOut_Get_WorkOrderPlanning", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProcessOut_WorkOrderPlanning_ViewModel> obj = result.GetDataList<ProcessOut_WorkOrderPlanning_ViewModel>();
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
        
        [HttpGet("GetPendingWorkOrderDetails")]
        public IActionResult GetPendingWorkOrderDetails(string WOPlanningIDs, long ProcessOutID, string IssueType, long ProcessID, long PartyID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WOPlanningIDs", WOPlanningIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutID", ProcessOutID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@IssueType", IssueType));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessID", ProcessID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", PartyID));
                clsResult result = dBConnection.execute("dbo.ProcessOut_Get_WorkOrderPlanning_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProcessOut_WorkOrderPlanning_Item_ViewModel> obj = result.GetDataList<ProcessOut_WorkOrderPlanning_Item_ViewModel>();

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
