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
    [Route("api/Sales/SalesOrder")]
    [ApiController]
    public class SalesOrderController : BaseController
    {
        private readonly IConfiguration _configuration;
        public SalesOrderController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Delete")]
        public IActionResult Delete(long SalesOrderID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderID", SalesOrderID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.SalesOrder_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = SalesOrderID }
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
        public IActionResult Get(SalesOrder_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderID", model.SalesOrderID));
                if(model.FromDate != null)
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
                clsResult result = dBConnection.execute("dbo.SalesOrder_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<SalesOrder_ViewModel> obj = result.GetDataList<SalesOrder_ViewModel>();
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
        public IActionResult Create(SalesOrder_AddModel model)
        {
            try
            {
                System.Data.DataTable dtItems = new System.Data.DataTable("Items");
                dtItems.Columns.Add("ID");
                dtItems.Columns.Add("SrNo");
                dtItems.Columns.Add("ParentProductID");
                dtItems.Columns.Add("ProductID");
                dtItems.Columns.Add("Qty");
                dtItems.Columns.Add("Price");
                dtItems.Columns.Add("TotalAmount");
                dtItems.Columns.Add("TotalTaxAmount");
                dtItems.Columns.Add("FinalAmount");
                dtItems.Columns.Add("HSNCodeID");
                dtItems.Columns.Add("Remarks");

                System.Data.DataTable dtItems_Attribute = new System.Data.DataTable("dtItems_Attribute");
                dtItems_Attribute.Columns.Add("ID");
                dtItems_Attribute.Columns.Add("SrNo");
                dtItems_Attribute.Columns.Add("ProductAttributeID");
                dtItems_Attribute.Columns.Add("ProductAttributeValueID");

                System.Data.DataTable dtItems_Taxes = new System.Data.DataTable("dtItems_Taxes");
                dtItems_Taxes.Columns.Add("SrNo");
                dtItems_Taxes.Columns.Add("TaxRateID");
                dtItems_Taxes.Columns.Add("TaxName");
                dtItems_Taxes.Columns.Add("Rate");
                dtItems_Taxes.Columns.Add("Total");

                System.Data.DataTable dt_Taxes = new System.Data.DataTable("dt_Taxes");
                dt_Taxes.Columns.Add("TaxRateID");
                dt_Taxes.Columns.Add("TaxName");
                dt_Taxes.Columns.Add("Rate");
                dt_Taxes.Columns.Add("Total");

                if (model.Items != null)
                {
                    foreach (SalesOrder_Item_AddModel item in model.Items) 
                    {
                        System.Data.DataRow dr = dtItems.NewRow();
                        dr["ID"] = item.ID;
                        dr["SrNo"] = item.SrNo;
                        dr["ParentProductID"] = item.ParentProductID;
                        dr["ProductID"] = item.ProductID;
                        dr["Qty"] = item.Qty;
                        dr["Price"] = item.Price;
                        dr["TotalAmount"] = item.TotalAmount;
                        dr["TotalTaxAmount"] = item.TotalTaxAmount;
                        dr["FinalAmount"] = item.FinalAmount;
                        dr["HSNCodeID"] = item.HSNCodeID;
                        dr["Remarks"] = item.Remarks;
                        dtItems.Rows.Add(dr);

                        if (item.AttributeValues != null)
                        {
                            foreach (SalesOrder_Item_Attribute_AddModel attribute in item.AttributeValues)
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

                        if (item.Taxes != null) {
                            foreach (SalesOrder_Item_Tax_AddModel tax in item.Taxes)
                            {
                                System.Data.DataRow drTax = dtItems_Taxes.NewRow();
                                drTax["SrNo"] = item.SrNo;
                                drTax["TaxRateID"] = tax.TaxRateID;
                                drTax["TaxName"] = tax.name;
                                drTax["Rate"] = tax.rate;
                                drTax["Total"] = tax.Amount;
                                dtItems_Taxes.Rows.Add(drTax);
                            }
                        }
                    }
                    dtItems.AcceptChanges();
                }

                if (model.Taxes != null)
                {
                    foreach (SalesOrder_Tax_AddModel item in model.Taxes)
                    {
                        System.Data.DataRow dr = dt_Taxes.NewRow();
                        dr["TaxRateID"] = item.TaxRateID;
                        dr["TaxName"] = item.name;
                        dr["Rate"] = item.rate;
                        dr["Total"] = item.Amount;
                        dt_Taxes.Rows.Add(dr);
                    }
                }

                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderID", model.SalesOrderID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderNo", model.SalesOrderNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderDate", model.SalesOrderDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandID", model.BrandID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", model.PartyID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ConsigneeID", model.ConsigneeID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@AgentID", model.AgentID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PONo", model.PONo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PODate", model.PODate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@DeliveryDate", model.DeliveryDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesLocationID", model.SalesLocationID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Priority", model.Priority));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@DueDays", model.DueDays));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TotalQty", model.TotalQty));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@GrossTotal", model.GrossTotal));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TotalTax", model.TotalTax));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TotalAmount", model.TotalAmount));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items", dtItems));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items_Attribute", dtItems_Attribute));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items_Tax", dtItems_Taxes));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Tax", dt_Taxes));

                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_FirstName", model.Billing_FirstName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_LastName", model.Billing_LastName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_Company", model.Billing_Company));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_Address1", model.Billing_Address1));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_Address2", model.Billing_Address2));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_Postcode", model.Billing_Postcode));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_EmailID", model.Billing_EmailID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_PhoneNo", model.Billing_PhoneNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_CountryID", model.Billing_CountryID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_StateID", model.Billing_StateID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_CityID", model.Billing_CityID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_Country", model.Billing_Country));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_State", model.Billing_State));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Billing_City", model.Billing_City));

                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_FirstName", model.Shipping_FirstName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_LastName", model.Shipping_LastName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_Company", model.Shipping_Company));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_Address1", model.Shipping_Address1));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_Address2", model.Shipping_Address2));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_Postcode", model.Shipping_Postcode));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_EmailID", model.Shipping_EmailID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_PhoneNo", model.Shipping_PhoneNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_CountryID", model.Shipping_CountryID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_StateID", model.Shipping_StateID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_CityID", model.Shipping_CityID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_Country", model.Shipping_Country));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_State", model.Shipping_State));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Shipping_City", model.Shipping_City));

                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ExhibitionID", model.ExhibitionID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@CreditTypeID", model.CreditTypeID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Status", model.Status));

                clsResult result = dBConnection.execute("dbo.SalesOrder_Add", alparameter);
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
        public IActionResult GetOrderDetails(Int64 SalesOrderID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderID", SalesOrderID));
                clsResult result = dBConnection.execute("dbo.SalesOrder_Get_Items", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<SalesOrder_Item_ViewModel> obj = result.GetDataList<SalesOrder_Item_ViewModel>();
                    List<SalesOrder_Tax_ViewModel> Taxes = new List<SalesOrder_Tax_ViewModel>();
                    List<SalesOrder_Parent_Item_ViewModel> lstParentProduct = new List<SalesOrder_Parent_Item_ViewModel>();

                    if (result.ResultDataSet.Tables.Count > 1)
                    {
                        List<SalesOrder_Item_Attribute_ViewModel> lstAttribute = clsConvert.ConvertDataTable<SalesOrder_Item_Attribute_ViewModel>(result.ResultDataSet.Tables[1]);
                        if (lstAttribute.Count > 0)
                        {
                            foreach (SalesOrder_Item_ViewModel item in obj) {
                                item.AttributeValues = lstAttribute.Where(t => t.SalesOrderItemID == item.ID).ToList();
                            }
                        }
                    }
                    if (result.ResultDataSet.Tables.Count > 2)
                    {
                        List<SalesOrder_Item_Tax_ViewModel> lstTaxes = clsConvert.ConvertDataTable<SalesOrder_Item_Tax_ViewModel>(result.ResultDataSet.Tables[2]);
                        if (lstTaxes.Count > 0)
                        {
                            foreach (SalesOrder_Item_ViewModel item in obj) {
                                item.Taxes = lstTaxes.Where(t => t.SalesOrderItemID == item.ID).ToList();
                            }
                        }
                    }
                    if (result.ResultDataSet.Tables.Count > 3)
                    {
                        Taxes = clsConvert.ConvertDataTable<SalesOrder_Tax_ViewModel>(result.ResultDataSet.Tables[3]);
                    }
                    if (result.ResultDataSet.Tables.Count > 4)
                    {
                        lstParentProduct = clsConvert.ConvertDataTable<SalesOrder_Parent_Item_ViewModel>(result.ResultDataSet.Tables[4]);
                    }
                    
                    return Ok(new
                    {
                        success = true,
                        message = "success",
                        data = obj,
                        Taxes = Taxes,
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

        [HttpPost("GetReport")]
        public IActionResult GetReport(SalesOrder_Report_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesOrderNo", model.SalesOrderNo));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyID", model.PartyIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", model.ProductIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@VariationID", model.VariationIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Columns", model.Columns));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@FromDate", model.FromDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ToDate", model.ToDate));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandIDs", model.BrandIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@SalesLocationIDs", model.SalesLocationIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ExhibitionIDs", model.ExhibitionIDs));
                clsResult result = dBConnection.execute("dbo.SalesOrder_Get_Report", alparameter);
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

    }
}
