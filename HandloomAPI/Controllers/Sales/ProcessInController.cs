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
    [Route("api/Sales/ProcessIn")]
    [ApiController]
    public class ProcessInController : BaseController
    {
        private readonly IConfiguration _configuration;
        public ProcessInController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Delete")]
        public IActionResult Delete(long ProcessInID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessInID", ProcessInID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.ProcessIn_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = ProcessInID }
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
        public IActionResult Get(ProcessIn_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessInID", model.ProcessInID));
                if(model.FromDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@FromDate", model.FromDate));
                if (model.ToDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ToDate", model.ToDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessInNo", model.ProcessInNo));
                clsResult result = dBConnection.execute("dbo.ProcessIn_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProcessIn_ViewModel> obj = result.GetDataList<ProcessIn_ViewModel>();
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
        public IActionResult Create(ProcessIn_AddModel model)
        {
            try
            {
                System.Data.DataTable dtItems = new System.Data.DataTable("Items");
                dtItems.Columns.Add("ID");
                dtItems.Columns.Add("WOPlanningItemComponentID");
                dtItems.Columns.Add("ProcessOutItemID");
                dtItems.Columns.Add("WONo");
                dtItems.Columns.Add("ProcessOutNo");
                dtItems.Columns.Add("SrNo");
                dtItems.Columns.Add("ParentProductID");
                dtItems.Columns.Add("ProductID");
                dtItems.Columns.Add("ComponentID");
                dtItems.Columns.Add("Qty");
                dtItems.Columns.Add("DamageQty");
                dtItems.Columns.Add("RepairQty");
                dtItems.Columns.Add("Remarks");

                if (model.Items != null)
                {
                    foreach (ProcessIn_Item_AddModel item in model.Items) 
                    {
                        System.Data.DataRow dr = dtItems.NewRow();
                        dr["ID"] = item.ID;
                        dr["WOPlanningItemComponentID"] = item.WOPlanningItemComponentID;
                        dr["ProcessOutItemID"] = item.ProcessOutItemID;
                        dr["WONo"] = item.WONo;
                        dr["ProcessOutNo"] = item.ProcessOutNo;
                        dr["SrNo"] = item.SrNo;
                        dr["ParentProductID"] = item.ParentProductID;
                        dr["ProductID"] = item.ProductID;
                        dr["ComponentID"] = item.ComponentID;
                        dr["Qty"] = item.Qty;
                        dr["DamageQty"] = item.DQty;
                        dr["RepairQty"] = item.RQty;
                        dr["Remarks"] = item.Remarks;
                        dtItems.Rows.Add(dr);
                    }
                    dtItems.AcceptChanges();
                }


                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessInID", model.ProcessInID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessInNo", model.ProcessInNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessInDate", model.ProcessInDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessInType", model.ProcessInType));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessID", model.ProcessID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", model.PartyID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TotalQty", model.TotalQty));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items", dtItems));
                clsResult result = dBConnection.execute("dbo.ProcessIn_Add", alparameter);
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
        public IActionResult GetOrderDetails(Int64 ProcessInID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessInID", ProcessInID));
                clsResult result = dBConnection.execute("dbo.ProcessIn_Get_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProcessIn_Item_ViewModel> obj = result.GetDataList<ProcessIn_Item_ViewModel>();
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

        [HttpGet("GetPendingProcessOut")]
        public IActionResult GetPendingProcessOut(long ProcessID, long PartyID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessID", ProcessID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", PartyID));
                clsResult result = dBConnection.execute("dbo.ProcessIn_Get_ProcessOut", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProcessIn_ProcessOut_ViewModel> obj = result.GetDataList<ProcessIn_ProcessOut_ViewModel>();
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
        
        [HttpGet("GetPendingProcessOutDetails")]
        public IActionResult GetPendingProcessOutDetails(string ProcessOutIDs, long ProcessInID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessOutIDs", ProcessOutIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessInID", ProcessInID));
                clsResult result = dBConnection.execute("dbo.ProcessIn_Get_ProcessOut_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProcessIn_ProcessOut_Item_ViewModel> obj = result.GetDataList<ProcessIn_ProcessOut_Item_ViewModel>();

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
