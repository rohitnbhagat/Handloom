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
    [Route("api/Sales/GA")]
    [ApiController]
    public class GAController : BaseController
    {
        private readonly IConfiguration _configuration;
        public GAController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Delete")]
        public IActionResult Delete(long GAID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GAID", GAID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.GA_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = GAID }
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
        public IActionResult Get(GA_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GAID", model.GAID));
                if(model.FromDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@FromDate", model.FromDate));
                if (model.ToDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ToDate", model.ToDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GANo", model.GANo));
                clsResult result = dBConnection.execute("dbo.GA_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<GA_ViewModel> obj = result.GetDataList<GA_ViewModel>();
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
        public IActionResult Create(GA_AddModel model)
        {
            try
            {
                System.Data.DataTable dtItems = new System.Data.DataTable("Items");
                dtItems.Columns.Add("ID");
                dtItems.Columns.Add("WOPlanningItemID");
                dtItems.Columns.Add("WONo");
                dtItems.Columns.Add("SrNo");
                dtItems.Columns.Add("ParentProductID");
                dtItems.Columns.Add("ProductID");
                dtItems.Columns.Add("Qty");
                dtItems.Columns.Add("Remarks");

                if (model.Items != null)
                {
                    foreach (GA_Item_AddModel item in model.Items) 
                    {
                        System.Data.DataRow dr = dtItems.NewRow();
                        dr["ID"] = item.ID;
                        dr["WOPlanningItemID"] = item.WOPlanningItemID;
                        dr["WONo"] = item.WONo;
                        dr["SrNo"] = item.SrNo;
                        dr["ParentProductID"] = item.ParentProductID;
                        dr["ProductID"] = item.ProductID;
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
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GAID", model.GAID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GANo", model.GANo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GADate", model.GADate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandID", model.BrandID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TotalQty", model.TotalQty));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items", dtItems));
                clsResult result = dBConnection.execute("dbo.GA_Add", alparameter);
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
        public IActionResult GetOrderDetails(Int64 GAID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GAID", GAID));
                clsResult result = dBConnection.execute("dbo.GA_Get_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<GA_Item_ViewModel> obj = result.GetDataList<GA_Item_ViewModel>();
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
        public IActionResult GetPendingWorkOrders()
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                //alparameter.Add(new System.Data.SqlClient.SqlParameter("@IssueType", IssueType));
                //alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessID", ProcessID));
                //alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", PartyID));
                clsResult result = dBConnection.execute("dbo.GA_Get_WorkOrderPlanning", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<GA_WorkOrderPlanning_ViewModel> obj = result.GetDataList<GA_WorkOrderPlanning_ViewModel>();
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
        public IActionResult GetPendingWorkOrderDetails(string WOPlanningIDs, long GAID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WOPlanningIDs", WOPlanningIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GAID", GAID));
                //alparameter.Add(new System.Data.SqlClient.SqlParameter("@IssueType", IssueType));
                //alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProcessID", ProcessID));
                //alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", PartyID));
                clsResult result = dBConnection.execute("dbo.GA_Get_WorkOrderPlanning_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<GA_WorkOrderPlanning_Item_ViewModel> obj = result.GetDataList<GA_WorkOrderPlanning_Item_ViewModel>();

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
