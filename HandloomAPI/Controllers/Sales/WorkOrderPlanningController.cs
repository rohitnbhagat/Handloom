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
    [Route("api/Sales/WorkOrderPlanning")]
    [ApiController]
    public class WorkOrderPlanningController : BaseController
    {
        private readonly IConfiguration _configuration;
        public WorkOrderPlanningController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Delete")]
        public IActionResult Delete(long WOPlanningID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WOPlanningID", WOPlanningID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.WorkOrderPlanning_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = WOPlanningID }
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
        public IActionResult Get(WorkOrderPlanning_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WOPlanningID", model.WOPlanningID));
                if(model.FromDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@FromDate", model.FromDate));
                if (model.ToDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ToDate", model.ToDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WONo", model.WONo));
                clsResult result = dBConnection.execute("dbo.WorkOrderPlanning_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<WorkOrderPlanning_ViewModel> obj = result.GetDataList<WorkOrderPlanning_ViewModel>();
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
        public IActionResult Create(WorkOrderPlanning_AddModel model)
        {
            try
            {
                System.Data.DataTable dtItems = new System.Data.DataTable("Items");
                dtItems.Columns.Add("ID");
                dtItems.Columns.Add("SalesOrderItemID");
                dtItems.Columns.Add("SalesOrderNo");
                dtItems.Columns.Add("SrNo");
                dtItems.Columns.Add("ParentProductID");
                dtItems.Columns.Add("ProductID");
                dtItems.Columns.Add("Qty");
                dtItems.Columns.Add("Remarks");

                System.Data.DataTable dtItems_Attribute = new System.Data.DataTable("dtItems_Attribute");
                dtItems_Attribute.Columns.Add("ID");
                dtItems_Attribute.Columns.Add("SrNo");
                dtItems_Attribute.Columns.Add("ProductAttributeID");
                dtItems_Attribute.Columns.Add("ProductAttributeValueID");

                System.Data.DataTable dtItems_SOItem = new System.Data.DataTable("dtItems_SOItem");
                dtItems_SOItem.Columns.Add("ID");
                dtItems_SOItem.Columns.Add("SrNo");
                dtItems_SOItem.Columns.Add("SalesOrderItemID");
                dtItems_SOItem.Columns.Add("SalesOrderNo");
                dtItems_SOItem.Columns.Add("Qty");

                System.Data.DataTable dtItems_Component = new System.Data.DataTable("dtItems_Component");
                dtItems_Component.Columns.Add("ID");
                dtItems_Component.Columns.Add("SrNo");
                dtItems_Component.Columns.Add("ComponentID");
                dtItems_Component.Columns.Add("ComponentName");


                if (model.Items != null)
                {
                    foreach (WorkOrderPlanning_Item_AddModel item in model.Items) 
                    {
                        System.Data.DataRow dr = dtItems.NewRow();
                        dr["ID"] = item.ID;
                        dr["SalesOrderItemID"] = item.SalesOrderItemID;
                        dr["SalesOrderNo"] = item.SalesOrderNo;
                        dr["SrNo"] = item.SrNo;
                        dr["ParentProductID"] = item.ParentProductID;
                        dr["ProductID"] = item.ProductID;
                        dr["Qty"] = item.Qty;
                        dr["Remarks"] = item.Remarks;
                        dtItems.Rows.Add(dr);

                        if (item.AttributeValues != null)
                        {
                            foreach (WorkOrderPlanning_Item_Attribute_AddModel attribute in item.AttributeValues)
                            {
                                System.Data.DataRow drattr = dtItems_Attribute.NewRow();
                                drattr["ID"] = item.ID;
                                drattr["SrNo"] = item.SrNo;
                                drattr["ProductAttributeID"] = attribute.ProductAttributeID;
                                drattr["ProductAttributeValueID"] = attribute.ProductAttributeValueID;
                                dtItems_Attribute.Rows.Add(drattr);
                            }
                            dtItems_Attribute.AcceptChanges();
                        }

                        if (item.SOItems != null)
                        {
                            foreach (WorkOrderPlanning_Item_SOItem_AddModel SOitem in item.SOItems)
                            {
                                System.Data.DataRow drattr = dtItems_SOItem.NewRow();
                                drattr["ID"] = item.ID;
                                drattr["SrNo"] = item.SrNo;
                                drattr["SalesOrderItemID"] = SOitem.SalesOrderItemID;
                                drattr["SalesOrderNo"] = SOitem.SalesOrderNo;
                                drattr["Qty"] = SOitem.Qty;
                                dtItems_SOItem.Rows.Add(drattr);
                            }
                            dtItems_SOItem.AcceptChanges();
                        }

                        if (item.Components != null)
                        {
                            foreach (WorkOrderPlanning_Item_Component_AddModel component in item.Components)
                            {
                                System.Data.DataRow drattr = dtItems_Component.NewRow();
                                drattr["ID"] = item.ID;
                                drattr["SrNo"] = item.SrNo;
                                drattr["ComponentID"] = component.ComponentID;
                                drattr["ComponentName"] = component.ComponentName;
                                dtItems_Component.Rows.Add(drattr);
                            }
                            dtItems_Component.AcceptChanges();
                        }


                    }
                    dtItems.AcceptChanges();
                }


                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WOPlanningID", model.WOPlanningID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WONo", model.WONo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WODate", model.WODate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WOType", model.WOType));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PreparedBy", model.PreparedBy));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@AssignedTo", model.AssignedTo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@AuthorizedBy", model.AuthorizedBy));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@StartDate", model.StartDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@EndDate", model.EndDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@DueDays", model.DueDays));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TotalQty", model.TotalQty));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderNo", model.SalesOrderNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items", dtItems));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items_Attribute", dtItems_Attribute));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@dtItems_SOItem", dtItems_SOItem));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@dtItems_Component", dtItems_Component));
                clsResult result = dBConnection.execute("dbo.WorkOrderPlanning_Add", alparameter);
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
        public IActionResult GetOrderDetails(Int64 WOPlanningID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WOPlanningID", WOPlanningID));
                clsResult result = dBConnection.execute("dbo.WorkOrderPlanning_Get_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<WorkOrderPlanning_Item_ViewModel> obj = result.GetDataList<WorkOrderPlanning_Item_ViewModel>();
                    List<WorkOrderPlanning_SelectedSO_ViewModel> SelectedSO = new List<WorkOrderPlanning_SelectedSO_ViewModel>();

                    if (result.ResultDataSet.Tables.Count > 1)
                    {
                        List<WorkOrderPlanning_Item_Attribute_ViewModel> lstAttribute = clsConvert.ConvertDataTable<WorkOrderPlanning_Item_Attribute_ViewModel>(result.ResultDataSet.Tables[1]);
                        if (lstAttribute.Count > 0)
                        {
                            foreach (WorkOrderPlanning_Item_ViewModel item in obj) {
                                item.AttributeValues = lstAttribute.Where(t => t.WOPlanningItemID == item.ID).ToList();
                            }
                        }
                    }
                    if (result.ResultDataSet.Tables.Count > 2)
                    {
                        List<WorkOrderPlanning_Item_SOItem_ViewModel> lstTaxes = clsConvert.ConvertDataTable<WorkOrderPlanning_Item_SOItem_ViewModel>(result.ResultDataSet.Tables[2]);
                        if (lstTaxes.Count > 0)
                        {
                            foreach (WorkOrderPlanning_Item_ViewModel item in obj) {
                                item.SOItems = lstTaxes.Where(t => t.WOPlanningItemID == item.ID).ToList();
                            }
                        }
                    }
                    if (result.ResultDataSet.Tables.Count > 3)
                    {
                        List<WorkOrderPlanning_Item_Component_ViewModel> lstTaxes = clsConvert.ConvertDataTable<WorkOrderPlanning_Item_Component_ViewModel>(result.ResultDataSet.Tables[3]);
                        if (lstTaxes.Count > 0)
                        {
                            foreach (WorkOrderPlanning_Item_ViewModel item in obj)
                            {
                                item.Components = lstTaxes.Where(t => t.WOPlanningItemID == item.ID).ToList();
                            }
                        }
                    }
                    if (result.ResultDataSet.Tables.Count > 4)
                    {
                        SelectedSO = clsConvert.ConvertDataTable<WorkOrderPlanning_SelectedSO_ViewModel>(result.ResultDataSet.Tables[4]);
                    }


                    return Ok(new
                    {
                        success = true,
                        message = "success",
                        data = obj,
                        SelectedSO = SelectedSO
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

        [HttpPost("GetReport")]
        public IActionResult GetReport(GDN_Report_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Columns", model.Columns));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@FromDate", model.FromDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ToDate", model.ToDate));
                clsResult result = dBConnection.execute("dbo.GDN_Get_Report", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    return Ok(new
                    {
                        success = true,
                        message = "success",
                        data = result.ResultDataTable.Rows[0][0]
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

        [HttpPost("GetPendingSalesOrders")]
        public IActionResult GetPendingSalesOrders(SalesOrder_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderID", model.SalesOrderID));
                if (model.FromDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@FromDate", model.FromDate));
                if (model.ToDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ToDate", model.ToDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderNo", model.SalesOrderNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandID", model.BrandID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", model.PartyID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ConsigneeID", model.ConsigneeID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@AgentID", model.AgentID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesLocationID", model.SalesLocationID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Priority", model.Priority));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Status", model.Status));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ExhibitionID", model.ExhibitionID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@CreditTypeID", model.CreditTypeID));
                clsResult result = dBConnection.execute("dbo.WorkOrderPlanning_Get_SalesOrder", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<WorkOrderPlanning_SalesOrder_ViewModel> obj = result.GetDataList<WorkOrderPlanning_SalesOrder_ViewModel>();
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
        [HttpGet("GetPendingSalesOrderDetails")]
        public IActionResult GetPendingSalesOrderDetails(string SalesOrderIDs, long WOPlanningID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderIDs", SalesOrderIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@WOPlanningID", WOPlanningID));
                clsResult result = dBConnection.execute("dbo.WorkOrderPlanning_Get_SalesOrder_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<WorkOrderPlanning_SalesOrder_Item_ViewModel> obj = result.GetDataList<WorkOrderPlanning_SalesOrder_Item_ViewModel>();

                    if (result.ResultDataSet.Tables.Count > 1)
                    {
                        List<WorkOrderPlanning_SalesOrder_Item_Attribute_ViewModel> lstAttribute = clsConvert.ConvertDataTable<WorkOrderPlanning_SalesOrder_Item_Attribute_ViewModel>(result.ResultDataSet.Tables[1]);
                        if (lstAttribute.Count > 0)
                        {
                            foreach (WorkOrderPlanning_SalesOrder_Item_ViewModel item in obj)
                            {
                                item.AttributeValues = lstAttribute.Where(t => t.SalesOrderItemID == item.SalesOrderItemID).ToList();
                            }
                        }
                    }
                    if (result.ResultDataSet.Tables.Count > 2)
                    {
                        List<WorkOrderPlanning_SalesOrder_Item_Component_ViewModel> lstComponent = clsConvert.ConvertDataTable<WorkOrderPlanning_SalesOrder_Item_Component_ViewModel>(result.ResultDataSet.Tables[2]);
                        if (lstComponent.Count > 0)
                        {
                            foreach (WorkOrderPlanning_SalesOrder_Item_ViewModel item in obj)
                            {
                                item.Components = lstComponent.Where(t => t.SalesOrderItemID == item.SalesOrderItemID).ToList();
                            }
                        }
                    }


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
