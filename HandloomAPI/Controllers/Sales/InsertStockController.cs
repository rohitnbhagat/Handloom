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
    [Route("api/Sales/InsertStock")]
    [ApiController]
    public class InsertStockController : BaseController
    {
        private readonly IConfiguration _configuration;
        public InsertStockController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Delete")]
        public IActionResult Delete(long InsertStockID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@InsertStockID", InsertStockID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.InsertStock_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = InsertStockID }
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
        public IActionResult Get(InsertStock_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@InsertStockID", model.InsertStockID));
                if(model.FromDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@FromDate", model.FromDate));
                if (model.ToDate != null)
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ToDate", model.ToDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@InsertStockNo", model.InsertStockNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", model.PartyID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandID", model.BrandID));
                clsResult result = dBConnection.execute("dbo.InsertStock_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<InsertStock_ViewModel> obj = result.GetDataList<InsertStock_ViewModel>();
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
        public IActionResult Create(InsertStock_AddModel model)
        {
            try
            {
                System.Data.DataTable dtItems = new System.Data.DataTable("Items");
                dtItems.Columns.Add("ID");
                dtItems.Columns.Add("SrNo");
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
                    foreach (InsertStock_Item_AddModel item in model.Items) 
                    {
                        System.Data.DataRow dr = dtItems.NewRow();
                        dr["ID"] = item.ID;
                        dr["SrNo"] = item.SrNo;
                        dr["ParentProductID"] = item.ParentProductID;
                        dr["ProductID"] = item.ProductID;
                        dr["Qty"] = item.Qty;
                        dr["HSNCodeID"] = item.HSNCodeID;
                        dr["Remarks"] = item.Remarks;
                        dtItems.Rows.Add(dr);

                        if (item.AttributeValues != null)
                        {
                            foreach (InsertStock_Item_Attribute_AddModel attribute in item.AttributeValues)
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
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@InsertStockID", model.InsertStockID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@InsertStockNo", model.InsertStockNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@InsertStockDate", model.InsertStockDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", model.PartyID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandID", model.BrandID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TotalQty", model.TotalQty));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items", dtItems));
                clsResult result = dBConnection.execute("dbo.InsertStock_Add", alparameter);
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
        public IActionResult GetOrderDetails(Int64 InsertStockID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@InsertStockID", InsertStockID));
                clsResult result = dBConnection.execute("dbo.InsertStock_Get_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<InsertStock_Item_ViewModel> obj = result.GetDataList<InsertStock_Item_ViewModel>();
                    List<InsertStock_Parent_Item_ViewModel> lstParentProduct = new List<InsertStock_Parent_Item_ViewModel>();

                    if (result.ResultDataSet.Tables.Count > 1)
                    {
                        List<InsertStock_Item_Attribute_ViewModel> lstAttribute = clsConvert.ConvertDataTable<InsertStock_Item_Attribute_ViewModel>(result.ResultDataSet.Tables[1]);
                        if (lstAttribute.Count > 0)
                        {
                            foreach (InsertStock_Item_ViewModel item in obj) {
                                item.AttributeValues = lstAttribute.Where(t => t.InsertStockItemID == item.ID).ToList();
                            }
                        }
                    }
                    if (result.ResultDataSet.Tables.Count > 2)
                    {
                        lstParentProduct = clsConvert.ConvertDataTable<InsertStock_Parent_Item_ViewModel>(result.ResultDataSet.Tables[2]);
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
