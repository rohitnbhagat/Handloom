using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrabullsAPI.Controllers;
using HandloomAPI.Models.Masters.ProductBOM;
using TrabullsAPI;
using TrabullsAPI.Models.DBOperation;
using System.Collections;
using TrabullsAPI.Models;
using System.Data;

namespace HandloomAPI.Controllers.Masters
{
    [Route("api/Masters/ProductBOM")]
    [ApiController]
    public class ProductBOMController : BaseController
    {
        private readonly IConfiguration _configuration;
        public ProductBOMController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Create")]
        public IActionResult Create(ProductBOM_AddModel model)
        {
            try
            {
                DataTable dtComponent = new DataTable();
                dtComponent.Columns.Add("ComponentID");

                DataTable dtComponent_Process = new DataTable();
                dtComponent_Process.Columns.Add("ComponentID");
                dtComponent_Process.Columns.Add("ProcessID");

                if (model.Components != null)
                {
                    foreach (ProductBOM_Component_AddModel component in model.Components) 
                    {
                        DataRow dr = dtComponent.NewRow();
                        dr["ComponentID"] = component.ComponentID;
                        dtComponent.Rows.Add(dr);

                        if (component.Processes != null) 
                        {
                            foreach (ProductBOM_Process_AddModel process in component.Processes)
                            {
                                DataRow drProcess = dtComponent_Process.NewRow();
                                drProcess["ComponentID"] = component.ComponentID;
                                drProcess["ProcessID"] = process.ProcessID;
                                dtComponent_Process.Rows.Add(drProcess);
                            }
                        }
                    }
                    dtComponent.AcceptChanges();
                    dtComponent_Process.AcceptChanges();
                }
                


                    ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", model.ProductID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@tblComponent", dtComponent));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@tblProcess", dtComponent_Process));
                clsResult result = dBConnection.execute("dbo.ProductBOM_Add", alparameter);
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

        [HttpPost("Delete")]
        public IActionResult Delete(long ProductID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", ProductID));
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ContextUserID", contextData.UserID));
                clsResult result = dBConnection.executeNonQuery("dbo.ProductBOM_Delete", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                return Ok(
                    new { success = true, message = "Successfully deleted", data = ProductID }
                    );
            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        [HttpGet("Get")]
        public IActionResult Get(Int64 ProductID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", ProductID));
                clsResult result = dBConnection.execute("dbo.ProductBOM_Get", alparameter);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else
                {
                    List<ProductBOM_ViewModel> obj = result.GetDataList<ProductBOM_ViewModel>();
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

        [HttpGet("GetComponents")]
        public IActionResult GetComponent(Int64 ProductID)
        {
            try
            {
                ContextData contextData = Common.GetContextData(Request);
                DBOperation dBConnection = new DBOperation(_configuration, contextData);
                ArrayList alparameter = new ArrayList();
                alparameter.Add(new System.Data.SqlClient.SqlParameter("@ProductID", ProductID));
                clsResult result = dBConnection.execute("dbo.ProductBOM_GetComponent", alparameter);

                ArrayList alparameter_P = new ArrayList();
                alparameter_P.Add(new System.Data.SqlClient.SqlParameter("@ProductID", ProductID));
                clsResult result_P = dBConnection.execute("dbo.ProductBOM_GetProcess", alparameter_P);
                if (result.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                }
                else if (result_P.HasError)
                {
                    return new NotFoundObjectResult(new APIResult() { success = false, message = result_P.GetException.Message, data = null });
                }
                else
                {
                    List<ProductBOM_Component_ViewModel> obj = result.GetDataList<ProductBOM_Component_ViewModel>();
                    List<ProductBOM_Process_ViewModel> obj_P = result_P.GetDataList<ProductBOM_Process_ViewModel>();
                    foreach (ProductBOM_Component_ViewModel o in obj)
                    {
                        o.Processes = obj_P.Where(t => t.ComponentID == o.ComponentID).ToList();
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
