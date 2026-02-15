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
    [Route("api/Sales/RemoveStock")]
    [ApiController]
    public class RemoveStockController : BaseController
    {
        private readonly IConfiguration _configuration;
        public RemoveStockController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Delete")]
        public IActionResult Delete(long RemoveStockID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@RemoveStockID", RemoveStockID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.RemoveStock_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = RemoveStockID }
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
        public IActionResult Get(RemoveStock_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@RemoveStockID", model.RemoveStockID));
                if(model.FromDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@FromDate", model.FromDate));
                if (model.ToDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ToDate", model.ToDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@RemoveStockNo", model.RemoveStockNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandID", model.BrandID));
                clsResult result = dBConnection.execute("dbo.RemoveStock_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<RemoveStock_ViewModel> obj = result.GetDataList<RemoveStock_ViewModel>();
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
        public IActionResult Create(RemoveStock_AddModel model)
        {
            try
            {
                System.Data.DataTable dtItems = new System.Data.DataTable("Items");
                dtItems.Columns.Add("ID");
                dtItems.Columns.Add("SrNo");
                dtItems.Columns.Add("StockItemID");
                dtItems.Columns.Add("ParentProductID");
                dtItems.Columns.Add("ProductID");
                dtItems.Columns.Add("Qty");
                dtItems.Columns.Add("HSNCodeID");
                dtItems.Columns.Add("Remarks");

                System.Data.DataTable dtItems_Attribute = new System.Data.DataTable("dtItems_Attribute");
                dtItems_Attribute.Columns.Add("ID");
                dtItems_Attribute.Columns.Add("SrNo");
                dtItems_Attribute.Columns.Add("ProductAttributeID");
                dtItems_Attribute.Columns.Add("ProductAttributeValueID");

                if (model.Items != null)
                {
                    foreach (RemoveStock_Item_AddModel item in model.Items) 
                    {
                        System.Data.DataRow dr = dtItems.NewRow();
                        dr["ID"] = item.ID;
                        dr["SrNo"] = item.SrNo;
                        dr["StockItemID"] = item.StockItemID;
                        dr["ParentProductID"] = item.ParentProductID;
                        dr["ProductID"] = item.ProductID;
                        dr["Qty"] = item.Qty;
                        dr["HSNCodeID"] = item.HSNCodeID;
                        dr["Remarks"] = item.Remarks;
                        dtItems.Rows.Add(dr);

                        if (item.AttributeValues != null)
                        {
                            foreach (RemoveStock_Item_Attribute_AddModel attribute in item.AttributeValues)
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
                    }
                    dtItems.AcceptChanges();
                }


                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@RemoveStockID", model.RemoveStockID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@RemoveStockNo", model.RemoveStockNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@RemoveStockDate", model.RemoveStockDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandID", model.BrandID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TotalQty", model.TotalQty));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items", dtItems));
                clsResult result = dBConnection.execute("dbo.RemoveStock_Add", alparameter);
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
        public IActionResult GetOrderDetails(Int64 RemoveStockID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@RemoveStockID", RemoveStockID));
                clsResult result = dBConnection.execute("dbo.RemoveStock_Get_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<RemoveStock_Item_ViewModel> obj = result.GetDataList<RemoveStock_Item_ViewModel>();
                    List<RemoveStock_Parent_Item_ViewModel> lstParentProduct = new List<RemoveStock_Parent_Item_ViewModel>();

                    if (result.ResultDataSet.Tables.Count > 1)
                    {
                        List<RemoveStock_Item_Attribute_ViewModel> lstAttribute = clsConvert.ConvertDataTable<RemoveStock_Item_Attribute_ViewModel>(result.ResultDataSet.Tables[1]);
                        if (lstAttribute.Count > 0)
                        {
                            foreach (RemoveStock_Item_ViewModel item in obj) {
                                item.AttributeValues = lstAttribute.Where(t => t.RemoveStockItemID == item.ID).ToList();
                            }
                        }
                    }
                    if (result.ResultDataSet.Tables.Count > 2)
                    {
                        lstParentProduct = clsConvert.ConvertDataTable<RemoveStock_Parent_Item_ViewModel>(result.ResultDataSet.Tables[2]);
                    }
                    
                    return Ok(new
                    {
                        success = true,
                        message = "success",
                        data = obj,
                        ParentProduct = lstParentProduct
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
