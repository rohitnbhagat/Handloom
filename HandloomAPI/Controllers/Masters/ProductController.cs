using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrabullsAPI.Controllers;
using HandloomAPI.Models.Masters.ProductMaster;
using TrabullsAPI;
using TrabullsAPI.Models.DBOperation;
using System.Collections;
using TrabullsAPI.Models;

namespace HandloomAPI.Controllers.Masters
{
    [Route("api/Masters/Product")]
    [ApiController]
    public class ProductController : BaseController
    {
        private readonly IConfiguration _configuration;
        public ProductController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Get")]
        public IActionResult Get(ProductMaster_search_filter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", model.ProductID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ParentProductID", model.ParentProductID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductType", model.ProductType));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductName", model.ProductName));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductAttributeIDs", model.ProductAttributeIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductAttributeValueIDs", model.ProductAttributeValueIDs));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductIDs", model.ProductIDs));
                clsResult result = dBConnection.execute("dbo.ProductMaster_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProductMaster_ViewModel> obj = result.GetDataList<ProductMaster_ViewModel>();
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
        [HttpGet("GetAttribute")]
        public IActionResult GetAttribute(long ProductID, long ProductAttributeID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", ProductID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductAttributeID", ProductAttributeID));
                clsResult result = dBConnection.execute("dbo.ProductMaster_GetAttribute", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProductMaster_Attribute_ViewModel> obj = result.GetDataList<ProductMaster_Attribute_ViewModel>();
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
        [HttpGet("GetAttributeValue")]
        public IActionResult GetAttributeValue(long ProductID, long ProductAttributeID, long ProductAttributeValueID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", ProductID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductAttributeID", ProductAttributeID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductAttributeValueID", ProductAttributeValueID));
                clsResult result = dBConnection.execute("dbo.ProductMaster_GetAttributeValue", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProductMaster_AttributeValue_ViewModel> obj = result.GetDataList<ProductMaster_AttributeValue_ViewModel>();
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
        [HttpPost("GetTaxRate")]
        public IActionResult GetTaxRate(ProductMaster_TaxRate_Parameter model)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@CountryID", model.CountryID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@StateID", model.StateID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductIDs", model.ProductIDs));
                clsResult result = dBConnection.execute("dbo.ProductMaster_Get_Tax_Rates", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProductMaster_TaxRate_ViewModel> obj = result.GetDataList<ProductMaster_TaxRate_ViewModel>();
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
