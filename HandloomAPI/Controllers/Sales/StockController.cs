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
    [Route("api/Sales/Stock")]
    [ApiController]
    public class StockController: BaseController
    {
        private readonly IConfiguration _configuration;
        public StockController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Get")]
        public IActionResult Get(Stock_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandID", model.BrandID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", model.ProductID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ParentProductID", model.ParentProductID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Sku", model.Sku));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductName", model.ProductName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductIDs", model.ProductIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TransID", model.TransID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@TransType", model.TransType));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@IsRemarks", model.IsRemarks));
                clsResult result = dBConnection.execute("dbo.StockItem_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<Stock_ViewModel> obj = result.GetDataList<Stock_ViewModel>();
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

        [HttpPost("Register")]
        public IActionResult Register(Stock_Register_Filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@BrandID", model.BrandID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", model.ProductID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@VariationID", model.VariationID));
                clsResult result = dBConnection.execute("dbo.Stock_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<Stock_Register_ViewModel> obj = result.GetDataList<Stock_Register_ViewModel>();
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

        [HttpPost("RegisterItem")]
        public IActionResult RegisterItem(long StockItemID, string type)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@StockItemID", StockItemID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Type", type));
                clsResult result = dBConnection.execute("dbo.Stock_Get_InOut", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<Stock_Register_Item_ViewModel> obj = result.GetDataList<Stock_Register_Item_ViewModel>();
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
