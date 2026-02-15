using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrabullsAPI.Models.DBOperation;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using TrabullsAPI.Models;
using System.Collections;
using Microsoft.AspNetCore.Cors;
using System.Data;
using WooCommerceNET.WooCommerce.v3;

namespace TrabullsAPI.Controllers
{
    [EnableCors]
    [Route("api/WooCommerce/")]
    [ApiController]
    public class WooCommerceController : BaseController
    {
        private readonly IConfiguration _configuration;
        public WooCommerceController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Sync_Products")]
        public IActionResult Sync_Products()
        {
            try
            {
                TrabullsAPI.Models.WooCommerceHelper wooCommerceHelper = new Models.WooCommerceHelper(_configuration);
                WooCommerceProductWithVariationSyncResult wooCommerceProductSyncResult = wooCommerceHelper.GetProductWithVariations().GetAwaiter().GetResult();

                if (wooCommerceProductSyncResult.success)
                {
                    DataTable dtProduct = new DataTable("dtProduct");
                    dtProduct.Columns.Add("id");
                    dtProduct.Columns.Add("name");
                    dtProduct.Columns.Add("slug");
                    dtProduct.Columns.Add("tax_status");
                    dtProduct.Columns.Add("tax_class");
                    dtProduct.Columns.Add("sku");
                    dtProduct.Columns.Add("stock_status");
                    dtProduct.Columns.Add("stock_quantity");
                    dtProduct.Columns.Add("backorders_allowed");
                    dtProduct.Columns.Add("backordered");
                    dtProduct.Columns.Add("backorders");
                    dtProduct.Columns.Add("sold_individually");
                    dtProduct.Columns.Add("weight");
                    dtProduct.Columns.Add("dimensions_height");
                    dtProduct.Columns.Add("dimensions_length");
                    dtProduct.Columns.Add("dimensions_width");
                    dtProduct.Columns.Add("shipping_class");
                    dtProduct.Columns.Add("shipping_class_id");
                    dtProduct.Columns.Add("purchase_note");
                    dtProduct.Columns.Add("menu_order");
                    dtProduct.Columns.Add("short_description");
                    dtProduct.Columns.Add("description");
                    dtProduct.Columns.Add("shipping_taxable");
                    dtProduct.Columns.Add("shipping_required");
                    dtProduct.Columns.Add("button_text");
                    dtProduct.Columns.Add("reviews_allowed");
                    dtProduct.Columns.Add("average_rating");
                    dtProduct.Columns.Add("external_url");
                    dtProduct.Columns.Add("parent_id");
                    dtProduct.Columns.Add("rating_count");
                    dtProduct.Columns.Add("download_expiry");
                    dtProduct.Columns.Add("enable_html_description");
                    dtProduct.Columns.Add("catalog_visibility");
                    dtProduct.Columns.Add("featured");
                    dtProduct.Columns.Add("status");
                    dtProduct.Columns.Add("type");
                    dtProduct.Columns.Add("date_modified", typeof(DateTime));
                    dtProduct.Columns.Add("date_created", typeof(DateTime));
                    dtProduct.Columns.Add("permalink");
                    dtProduct.Columns.Add("enable_html_short_description");
                    dtProduct.Columns.Add("price");
                    dtProduct.Columns.Add("downloadable");
                    dtProduct.Columns.Add("virtual");
                    dtProduct.Columns.Add("total_sales");
                    dtProduct.Columns.Add("purchasable");
                    dtProduct.Columns.Add("on_sale");
                    dtProduct.Columns.Add("price_html");
                    dtProduct.Columns.Add("download_limit");
                    dtProduct.Columns.Add("date_on_sale_from", typeof(DateTime));
                    dtProduct.Columns.Add("date_on_sale_to", typeof(DateTime));
                    dtProduct.Columns.Add("sale_price");
                    dtProduct.Columns.Add("regular_price");
                    dtProduct.Columns.Add("IsVariationProduct");
                    dtProduct.Columns.Add("ImageURL");
                    DataTable dtProductVariation = new DataTable("dtProductVariation");
                    dtProductVariation = dtProduct.Clone();

                    DataTable dtProductAttribute = new DataTable("dtProductAttribute");
                    dtProductAttribute.Columns.Add("productid");
                    dtProductAttribute.Columns.Add("id");
                    dtProductAttribute.Columns.Add("name");
                    dtProductAttribute.Columns.Add("option");
                    DataTable dtProductVariationAttribute = dtProductAttribute.Clone();

                    foreach (ProductVariation product in wooCommerceProductSyncResult.Products)
                    {
                        DataRow dr = dtProduct.NewRow();
                        dr["id"] = product.Product.id;
                        dr["name"] = product.Product.name;
                        dr["slug"] = product.Product.slug;
                        dr["tax_status"] = product.Product.tax_status;
                        dr["tax_class"] = product.Product.tax_class;
                        dr["sku"] = product.Product.sku;
                        dr["stock_status"] = product.Product.stock_status;
                        dr["stock_quantity"] = product.Product.stock_quantity;
                        dr["backorders_allowed"] = product.Product.backorders_allowed;
                        dr["backordered"] = product.Product.backordered;
                        dr["backorders"] = product.Product.backorders;
                        dr["sold_individually"] = product.Product.sold_individually;
                        dr["weight"] = product.Product.weight;
                        dr["dimensions_height"] = product.Product.dimensions.height;
                        dr["dimensions_length"] = product.Product.dimensions.length;
                        dr["dimensions_width"] = product.Product.dimensions.width;
                        dr["shipping_class"] = product.Product.shipping_class;
                        dr["shipping_class_id"] = product.Product.shipping_class_id;
                        dr["purchase_note"] = product.Product.purchase_note;
                        dr["menu_order"] = product.Product.menu_order;
                        dr["short_description"] = product.Product.short_description;
                        dr["description"] = product.Product.description;
                        dr["shipping_taxable"] = product.Product.shipping_taxable;
                        dr["shipping_required"] = product.Product.shipping_required;
                        dr["button_text"] = product.Product.button_text;
                        dr["reviews_allowed"] = product.Product.reviews_allowed;
                        dr["average_rating"] = product.Product.average_rating;
                        dr["external_url"] = product.Product.external_url;
                        dr["parent_id"] = product.Product.parent_id;
                        dr["rating_count"] = product.Product.rating_count;
                        dr["download_expiry"] = product.Product.download_expiry;
                        dr["enable_html_description"] = product.Product.enable_html_description;
                        dr["catalog_visibility"] = product.Product.catalog_visibility;
                        dr["featured"] = product.Product.featured;
                        dr["status"] = product.Product.status;
                        dr["type"] = product.Product.type;
                        if (product.Product.date_modified != null)
                            dr["date_modified"] = product.Product.date_modified;
                        if (product.Product.date_created != null)
                            dr["date_created"] = product.Product.date_created;
                        dr["permalink"] = product.Product.permalink;
                        dr["enable_html_short_description"] = product.Product.enable_html_short_description;
                        dr["price"] = product.Product.price;
                        dr["downloadable"] = product.Product.downloadable;
                        dr["virtual"] = product.Product._virtual;
                        dr["total_sales"] = product.Product.total_sales;
                        dr["purchasable"] = product.Product.purchasable;
                        dr["on_sale"] = product.Product.on_sale;
                        dr["price_html"] = product.Product.price_html;
                        dr["download_limit"] = product.Product.download_limit;
                        if (product.Product.date_on_sale_from != null)
                            dr["date_on_sale_from"] = product.Product.date_on_sale_from;
                        if (product.Product.date_on_sale_to != null)
                            dr["date_on_sale_to"] = product.Product.date_on_sale_to;
                        dr["sale_price"] = product.Product.sale_price;
                        dr["regular_price"] = product.Product.regular_price;
                        dr["IsVariationProduct"] = false;
                        dr["ImageURL"] = "";
                        if (product.Product.images != null && product.Product.images.Count() > 0)
                        {
                            dr["ImageURL"] = product.Product.images[0].src;
                        }
                        dtProduct.Rows.Add(dr);

                        if (product.Product.attributes.Count > 0)
                        {
                            foreach (ProductAttributeLine productAttributeLine in product.Product.attributes)
                            {
                                foreach (string str in productAttributeLine.options)
                                {
                                    DataRow drAttribute = dtProductAttribute.NewRow();
                                    drAttribute["productid"] = product.Product.id;
                                    drAttribute["id"] = productAttributeLine.id;
                                    drAttribute["name"] = productAttributeLine.name;
                                    drAttribute["option"] = str;
                                    dtProductAttribute.Rows.Add(drAttribute);
                                }
                            }
                            dtProductAttribute.AcceptChanges();
                        }

                        if (product.Variations.Count > 0)
                        {
                            foreach (Variation variation in product.Variations)
                            {
                                DataRow drV = dtProductVariation.NewRow();
                                drV["id"] = variation.id;
                                drV["name"] = product.Product.name;
                                drV["slug"] = product.Product.slug;
                                drV["tax_status"] = variation.tax_status;
                                drV["tax_class"] = variation.tax_class;
                                drV["sku"] = variation.sku;
                                drV["stock_status"] = variation.stock_status;
                                drV["stock_quantity"] = variation.stock_quantity;
                                drV["backorders_allowed"] = variation.backorders_allowed;
                                drV["backordered"] = variation.backordered;
                                drV["backorders"] = variation.backorders;
                                drV["sold_individually"] = product.Product.sold_individually;
                                drV["weight"] = variation.weight;
                                drV["dimensions_height"] = variation.dimensions.height;
                                drV["dimensions_length"] = variation.dimensions.length;
                                drV["dimensions_width"] = variation.dimensions.width;
                                drV["shipping_class"] = variation.shipping_class;
                                drV["shipping_class_id"] = variation.shipping_class_id;
                                drV["purchase_note"] = product.Product.purchase_note;
                                drV["menu_order"] = variation.menu_order;
                                drV["short_description"] = product.Product.short_description;
                                drV["description"] = variation.description;
                                drV["shipping_taxable"] = product.Product.shipping_taxable;
                                drV["shipping_required"] = product.Product.shipping_required;
                                drV["button_text"] = product.Product.button_text;
                                drV["reviews_allowed"] = product.Product.reviews_allowed;
                                drV["average_rating"] = product.Product.average_rating;
                                drV["external_url"] = product.Product.external_url;
                                drV["parent_id"] = product.Product.id;
                                drV["rating_count"] = product.Product.rating_count;
                                drV["download_expiry"] = variation.download_expiry;
                                drV["enable_html_description"] = product.Product.enable_html_description;
                                drV["catalog_visibility"] = product.Product.catalog_visibility;
                                drV["featured"] = product.Product.featured;
                                drV["status"] = variation.status;
                                drV["type"] = product.Product.type;
                                if (variation.date_modified != null)
                                    drV["date_modified"] = variation.date_modified;
                                if (variation.date_created != null)
                                    drV["date_created"] = variation.date_created;
                                drV["permalink"] = variation.permalink;
                                drV["enable_html_short_description"] = product.Product.enable_html_short_description;
                                drV["price"] = variation.price;
                                drV["downloadable"] = variation.downloadable;
                                drV["virtual"] = variation._virtual;
                                drV["total_sales"] = product.Product.total_sales;
                                drV["purchasable"] = variation.purchasable;
                                drV["on_sale"] = variation.on_sale;
                                drV["price_html"] = product.Product.price_html;
                                drV["download_limit"] = variation.download_limit;
                                if (variation.date_on_sale_from != null)
                                    drV["date_on_sale_from"] = variation.date_on_sale_from;
                                if (variation.date_on_sale_to != null)
                                    drV["date_on_sale_to"] = variation.date_on_sale_to;
                                drV["sale_price"] = variation.sale_price;
                                drV["regular_price"] = variation.regular_price;
                                drV["IsVariationProduct"] = true;
                                drV["ImageURL"] = "";
                                if (variation.image != null)
                                {
                                    drV["ImageURL"] = variation.image.src;
                                }

                                if (variation.attributes.Count > 0)
                                {
                                    foreach (VariationAttribute variationAttribute in variation.attributes)
                                    {
                                        DataRow drAttribute = dtProductVariationAttribute.NewRow();
                                        drAttribute["productid"] = variation.id;
                                        drAttribute["id"] = variationAttribute.id;
                                        drAttribute["name"] = variationAttribute.name;
                                        drAttribute["option"] = variationAttribute.option;
                                        dtProductVariationAttribute.Rows.Add(drAttribute);

                                        drV["name"] = drV["name"] + " (" + variationAttribute.option + ")";
                                    }
                                    dtProductVariationAttribute.AcceptChanges();
                                }

                                dtProductVariation.Rows.Add(drV);
                            }
                            dtProductVariationAttribute.AcceptChanges();
                        }


                    }
                    dtProduct.AcceptChanges();


                    ContextData contextData = Common.GetContextData(Request);
                    DBOperation dBConnection = new DBOperation(_configuration, contextData);
                    ArrayList alparameter = new ArrayList();
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@dtProduct", dtProduct));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@dtProductAttribute", dtProductAttribute));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@dtProductVariation", dtProductVariation));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@dtProductVariationAttribute", dtProductVariationAttribute));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", contextData.UserID));
                    clsResult result = dBConnection.executeNonQuery("dbo.ProductMaster_Sync", alparameter);
                    if (result.HasError)
                    {
                        return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                    }
                    return Ok(
                        new { success = true, message = "Product successfully synced", data = dtProduct.Rows.Count }
                        );
                }
                else
                {
                    return Ok(
                            new { success = false, message = wooCommerceProductSyncResult.Message, data = 0 }
                            );
                }
            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        [HttpPost("Sync_TaxClasses")]
        public IActionResult Sync_TaxClasses()
        {
            try
            {
                TrabullsAPI.Models.WooCommerceHelper wooCommerceHelper = new Models.WooCommerceHelper(_configuration);
                WooCommerceTaxClassSyncResult wooCommerceTaxClassSyncResult = wooCommerceHelper.GetTaxClass().GetAwaiter().GetResult();
                if (wooCommerceTaxClassSyncResult.success)
                {
                    DataTable dtTaxClass = new DataTable("dtTaxClass");
                    dtTaxClass.Columns.Add("slug");
                    dtTaxClass.Columns.Add("name");

                    foreach (TaxClass taxClass in wooCommerceTaxClassSyncResult.TaxClasses)
                    {
                        DataRow dr = dtTaxClass.NewRow();
                        dr["slug"] = taxClass.slug;
                        dr["name"] = taxClass.name;
                        dtTaxClass.Rows.Add(dr);
                    }
                    dtTaxClass.AcceptChanges();

                    ContextData contextData = Common.GetContextData(Request);
                    DBOperation dBConnection = new DBOperation(_configuration, contextData);
                    ArrayList alparameter = new ArrayList();
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@dtTaxClass", dtTaxClass));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", contextData.UserID));
                    clsResult result = dBConnection.executeNonQuery("dbo.TaxClass_Sync", alparameter);
                    if (result.HasError)
                    {
                        return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                    }
                    return Ok(
                        new { success = true, message = "Tax classes successfully synced", data = dtTaxClass.Rows.Count }
                        );
                }
                else
                {
                    return Ok(
                            new { success = false, message = wooCommerceTaxClassSyncResult.Message, data = 0 }
                            );
                }


            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        [HttpPost("Sync_TaxRates")]
        public IActionResult Sync_TaxRates()
        {
            try
            {
                TrabullsAPI.Models.WooCommerceHelper wooCommerceHelper = new Models.WooCommerceHelper(_configuration);
                WooCommerceTaxRateSyncResult wooCommerceTaxRateSyncResult = wooCommerceHelper.GetTaxRate().GetAwaiter().GetResult();
                if (wooCommerceTaxRateSyncResult.success)
                {
                    DataTable dtTaxRate = new DataTable("dtTaxRate");
                    dtTaxRate.Columns.Add("id");
                    dtTaxRate.Columns.Add("class");
                    dtTaxRate.Columns.Add("name");
                    dtTaxRate.Columns.Add("rate");
                    dtTaxRate.Columns.Add("country");
                    dtTaxRate.Columns.Add("state");
                    dtTaxRate.Columns.Add("priority");
                    dtTaxRate.Columns.Add("order");
                    dtTaxRate.Columns.Add("compound");
                    dtTaxRate.Columns.Add("shipping");
                    dtTaxRate.Columns.Add("postcode");
                    dtTaxRate.Columns.Add("city");

                    foreach (TaxRate taxRate in wooCommerceTaxRateSyncResult.TaxRates)
                    {
                        DataRow dr = dtTaxRate.NewRow();
                        dr["id"] = taxRate.id;
                        dr["class"] = taxRate._class;
                        dr["name"] = taxRate.name;
                        dr["rate"] = taxRate.rate;
                        dr["country"] = taxRate.country;
                        dr["state"] = taxRate.state;
                        dr["priority"] = taxRate.priority;
                        dr["order"] = taxRate.order;
                        dr["compound"] = taxRate.compound;
                        dr["shipping"] = taxRate.shipping;
                        dr["postcode"] = taxRate.postcode;
                        dr["city"] = taxRate.city;
                        dtTaxRate.Rows.Add(dr);
                    }
                    dtTaxRate.AcceptChanges();

                    ContextData contextData = Common.GetContextData(Request);
                    DBOperation dBConnection = new DBOperation(_configuration, contextData);
                    ArrayList alparameter = new ArrayList();
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@dtTaxRate", dtTaxRate));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", contextData.UserID));
                    clsResult result = dBConnection.executeNonQuery("dbo.TaxRate_Sync", alparameter);
                    if (result.HasError)
                    {
                        return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                    }
                    return Ok(
                        new { success = true, message = "Tax classes successfully synced", data = dtTaxRate.Rows.Count }
                        );
                }
                else
                {
                    return Ok(
                            new { success = false, message = wooCommerceTaxRateSyncResult.Message, data = 0 }
                            );
                }


            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        [HttpPost("Sync_Customers")]
        public IActionResult Sync_Customers()
        {
            try
            {
                TrabullsAPI.Models.WooCommerceHelper wooCommerceHelper = new Models.WooCommerceHelper(_configuration);
                WooCommerceCustomerSyncResult wooCommerceCustomerSyncResult = wooCommerceHelper.GetCustomers().GetAwaiter().GetResult();
                if (wooCommerceCustomerSyncResult.success)
                {
                    DataTable dtParty = new DataTable("dtParty");
                    dtParty.Columns.Add("ID");
                    dtParty.Columns.Add("FirstName");
                    dtParty.Columns.Add("LastName");
                    dtParty.Columns.Add("EmailID");

                    DataTable dtBillingAddress = new DataTable("dtBillingAddress");
                    dtBillingAddress.Columns.Add("ID");
                    dtBillingAddress.Columns.Add("FirstName");
                    dtBillingAddress.Columns.Add("LastName");
                    dtBillingAddress.Columns.Add("Company");
                    dtBillingAddress.Columns.Add("Address1");
                    dtBillingAddress.Columns.Add("Address2");
                    dtBillingAddress.Columns.Add("City");
                    dtBillingAddress.Columns.Add("State");
                    dtBillingAddress.Columns.Add("Postcode");
                    dtBillingAddress.Columns.Add("Country");
                    dtBillingAddress.Columns.Add("EmailID");
                    dtBillingAddress.Columns.Add("PhoneNo");

                    DataTable dtShippingAddress = new DataTable("dtShippingAddress");
                    dtShippingAddress.Columns.Add("ID");
                    dtShippingAddress.Columns.Add("FirstName");
                    dtShippingAddress.Columns.Add("LastName");
                    dtShippingAddress.Columns.Add("Company");
                    dtShippingAddress.Columns.Add("Address1");
                    dtShippingAddress.Columns.Add("Address2");
                    dtShippingAddress.Columns.Add("City");
                    dtShippingAddress.Columns.Add("State");
                    dtShippingAddress.Columns.Add("Postcode");
                    dtShippingAddress.Columns.Add("Country");
                    dtShippingAddress.Columns.Add("EmailID");
                    dtShippingAddress.Columns.Add("PhoneNo");

                    foreach (Customer customer in wooCommerceCustomerSyncResult.Customers)
                    {
                        DataRow dr = dtParty.NewRow();
                        dr["ID"] = customer.id;
                        dr["FirstName"] = customer.first_name;
                        dr["LastName"] = customer.last_name;
                        dr["EmailID"] = customer.email;
                        dtParty.Rows.Add(dr);

                        if (customer.billing != null)
                        {
                            DataRow drBilling = dtBillingAddress.NewRow();
                            drBilling["ID"] = customer.id;
                            drBilling["FirstName"] = customer.billing.first_name;
                            drBilling["LastName"] = customer.billing.last_name;
                            drBilling["Company"] = customer.billing.company;
                            drBilling["Address1"] = customer.billing.address_1;
                            drBilling["Address2"] = customer.billing.address_2;
                            drBilling["City"] = customer.billing.city;
                            drBilling["State"] = customer.billing.state;
                            drBilling["Postcode"] = customer.billing.postcode;
                            drBilling["Country"] = customer.billing.country;
                            drBilling["EmailID"] = customer.billing.email;
                            dtBillingAddress.Rows.Add(drBilling);
                        }

                        if (customer.shipping != null)
                        {
                            DataRow drShipping = dtShippingAddress.NewRow();
                            drShipping["ID"] = customer.id;
                            drShipping["FirstName"] = customer.shipping.first_name;
                            drShipping["LastName"] = customer.shipping.last_name;
                            drShipping["Company"] = customer.shipping.company;
                            drShipping["Address1"] = customer.shipping.address_1;
                            drShipping["Address2"] = customer.shipping.address_2;
                            drShipping["City"] = customer.shipping.city;
                            drShipping["State"] = customer.shipping.state;
                            drShipping["Postcode"] = customer.shipping.postcode;
                            drShipping["Country"] = customer.shipping.country;
                            drShipping["EmailID"] = "";
                            dtShippingAddress.Rows.Add(drShipping);
                        }

                    }
                    dtParty.AcceptChanges();
                    dtBillingAddress.AcceptChanges();
                    dtShippingAddress.AcceptChanges();

                    ContextData contextData = Common.GetContextData(Request);
                    DBOperation dBConnection = new DBOperation(_configuration, contextData);
                    ArrayList alparameter = new ArrayList();
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@Party", dtParty));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyBillingAddress", dtBillingAddress));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@PartyShippingAddress", dtShippingAddress));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", contextData.UserID));
                    clsResult result = dBConnection.executeNonQuery("dbo.PartyMaster_Sync", alparameter);
                    if (result.HasError)
                    {
                        return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                    }
                    return Ok(
                        new { success = true, message = "Customers successfully synced", data = dtParty.Rows.Count }
                        );
                }
                else
                {
                    return Ok(
                            new { success = false, message = wooCommerceCustomerSyncResult.Message, data = 0 }
                            );
                }


            }
            catch (Exception ex)
            {
                return BadRequest(
                       new APIResult() { success = false, message = ex.Message, data = null }
                       );
            }
        }

        [HttpPost("Sync_Orders")]
        public IActionResult Sync_Orders()
        {
            try
            {
                TrabullsAPI.Models.WooCommerceHelper wooCommerceHelper = new Models.WooCommerceHelper(_configuration);
                WooCommerceOrderSyncResult wooCommerceOrderSyncResult = wooCommerceHelper.GetOrders().GetAwaiter().GetResult();
                if (wooCommerceOrderSyncResult.success)
                {
                    DataTable dtOrder = new DataTable("dtOrder");
                    dtOrder.Columns.Add("ID", typeof(long));
                    dtOrder.Columns.Add("Parent_ID", typeof(long));
                    dtOrder.Columns.Add("SalesOrderNo", typeof(string));
                    dtOrder.Columns.Add("SalesOrderDate", typeof(DateTime));
                    dtOrder.Columns.Add("Currency", typeof(string));
                    dtOrder.Columns.Add("Currency_Symbol", typeof(string));
                    dtOrder.Columns.Add("Created_via", typeof(string));
                    dtOrder.Columns.Add("Customer_id", typeof(long));
                    dtOrder.Columns.Add("Billing_first_name", typeof(string));
                    dtOrder.Columns.Add("Billing_last_name", typeof(string));
                    dtOrder.Columns.Add("Billing_company", typeof(string));
                    dtOrder.Columns.Add("Billing_address_1", typeof(string));
                    dtOrder.Columns.Add("Billing_address_2", typeof(string));
                    dtOrder.Columns.Add("Billing_city", typeof(string));
                    dtOrder.Columns.Add("Billing_state", typeof(string));
                    dtOrder.Columns.Add("Billing_postcode", typeof(string));
                    dtOrder.Columns.Add("Billing_country", typeof(string));
                    dtOrder.Columns.Add("Billing_email", typeof(string));
                    dtOrder.Columns.Add("Billing_phone", typeof(string));
                    dtOrder.Columns.Add("Shipping_first_name", typeof(string));
                    dtOrder.Columns.Add("Shipping_last_name", typeof(string));
                    dtOrder.Columns.Add("Shipping_company", typeof(string));
                    dtOrder.Columns.Add("Shipping_address_1", typeof(string));
                    dtOrder.Columns.Add("Shipping_address_2", typeof(string));
                    dtOrder.Columns.Add("Shipping_city", typeof(string));
                    dtOrder.Columns.Add("Shipping_state", typeof(string));
                    dtOrder.Columns.Add("Shipping_postcode", typeof(string));
                    dtOrder.Columns.Add("Shipping_country", typeof(string));
                    dtOrder.Columns.Add("Shipping_phone", typeof(string));
                    dtOrder.Columns.Add("Customer_Note", typeof(string));
                    dtOrder.Columns.Add("Status", typeof(string));
                    dtOrder.Columns.Add("Payment_method", typeof(string));
                    dtOrder.Columns.Add("Payment_method_title", typeof(string));
                    dtOrder.Columns.Add("Transaction_id", typeof(string));
                    dtOrder.Columns.Add("Date_Paid", typeof(DateTime));
                    dtOrder.Columns.Add("Date_completed", typeof(DateTime));
                    dtOrder.Columns.Add("Prices_include_tax", typeof(bool));
                    dtOrder.Columns.Add("Discount_total", typeof(decimal));
                    dtOrder.Columns.Add("Discount_tax", typeof(decimal));
                    dtOrder.Columns.Add("Shipping_total", typeof(decimal));
                    dtOrder.Columns.Add("Shipping_tax", typeof(decimal));
                    dtOrder.Columns.Add("Cart_tax", typeof(decimal));
                    dtOrder.Columns.Add("Total", typeof(decimal));
                    dtOrder.Columns.Add("Total_tax", typeof(decimal));


                    DataTable dtItem = new DataTable("dtItem");
                    dtItem.Columns.Add("OrderID", typeof(long));
                    dtItem.Columns.Add("ID", typeof(long));
                    dtItem.Columns.Add("sku", typeof(string));
                    dtItem.Columns.Add("ProductName", typeof(string));
                    dtItem.Columns.Add("product_id", typeof(long));
                    dtItem.Columns.Add("variation_id", typeof(long));
                    dtItem.Columns.Add("Qty", typeof(decimal));
                    dtItem.Columns.Add("Price", typeof(decimal));
                    dtItem.Columns.Add("Tax_class", typeof(string));
                    dtItem.Columns.Add("Subtotal", typeof(decimal));
                    dtItem.Columns.Add("Subtotal_tax", typeof(decimal));
                    dtItem.Columns.Add("Total", typeof(decimal));
                    dtItem.Columns.Add("Total_tax", typeof(decimal));
                    dtItem.Columns.Add("imageURL", typeof(string));

                    DataTable dtItemTax = new DataTable("dtItemTax");
                    dtItemTax.Columns.Add("OrderID", typeof(long));
                    dtItemTax.Columns.Add("ItemID", typeof(long));
                    dtItemTax.Columns.Add("ID", typeof(long));
                    dtItemTax.Columns.Add("Total", typeof(decimal));
                    dtItemTax.Columns.Add("SubTotal", typeof(decimal));

                    DataTable dtTax = new DataTable("dtTax");
                    dtTax.Columns.Add("OrderID", typeof(long));
                    dtTax.Columns.Add("id", typeof(long));
                    dtTax.Columns.Add("rate_code", typeof(string));
                    dtTax.Columns.Add("rate_id", typeof(long));
                    dtTax.Columns.Add("label", typeof(string));
                    dtTax.Columns.Add("compound", typeof(bool));
                    dtTax.Columns.Add("tax_total", typeof(decimal));
                    dtTax.Columns.Add("shipping_tax_total", typeof(decimal));

                    DataTable dtCoupon = new DataTable("dtCoupon");
                    dtCoupon.Columns.Add("OrderID", typeof(long));
                    dtCoupon.Columns.Add("ID", typeof(long));
                    dtCoupon.Columns.Add("Code", typeof(string));
                    dtCoupon.Columns.Add("Discount", typeof(decimal));
                    dtCoupon.Columns.Add("Discount_tax", typeof(decimal));

                    DataTable dtFees = new DataTable("dtFees");
                    dtFees.Columns.Add("OrderID", typeof(long));
                    dtFees.Columns.Add("ID", typeof(long));
                    dtFees.Columns.Add("Name", typeof(string));
                    dtFees.Columns.Add("Tax_class", typeof(string));
                    dtFees.Columns.Add("Tax_status", typeof(string));
                    dtFees.Columns.Add("Total", typeof(decimal));
                    dtFees.Columns.Add("Total_tax", typeof(decimal));

                    DataTable dtFeesTax = new DataTable("dtFeesTax");
                    dtFeesTax.Columns.Add("OrderID", typeof(long));
                    dtFeesTax.Columns.Add("FeesID", typeof(long));
                    dtFeesTax.Columns.Add("ID", typeof(long));
                    dtFeesTax.Columns.Add("Total", typeof(decimal));
                    dtFeesTax.Columns.Add("SubTotal", typeof(decimal));

                    DataTable dtShipping = new DataTable("dtShipping");
                    dtShipping.Columns.Add("OrderID", typeof(long));
                    dtShipping.Columns.Add("id", typeof(long));
                    dtShipping.Columns.Add("Method_title", typeof(string));
                    dtShipping.Columns.Add("Method_id", typeof(string));
                    dtShipping.Columns.Add("instance_id", typeof(string));
                    dtShipping.Columns.Add("Total", typeof(decimal));
                    dtShipping.Columns.Add("Total_tax", typeof(decimal));

                    DataTable dtShippingTax = new DataTable("dtShippingTax");
                    dtShippingTax.Columns.Add("OrderID", typeof(long));
                    dtShippingTax.Columns.Add("ShippingID", typeof(long));
                    dtShippingTax.Columns.Add("ID", typeof(long));
                    dtShippingTax.Columns.Add("Total", typeof(decimal));
                    dtShippingTax.Columns.Add("SubTotal", typeof(decimal));

                    DataTable dtRefund= new DataTable("dtRefund");
                    dtRefund.Columns.Add("OrderID", typeof(long));
                    dtRefund.Columns.Add("ID", typeof(long));
                    dtRefund.Columns.Add("Reason", typeof(string));
                    dtRefund.Columns.Add("Total", typeof(decimal));

                    foreach (Order order in wooCommerceOrderSyncResult.Orders)
                    {
                        DataRow dr = dtOrder.NewRow();
                        dr["ID"] = order.id;
                        dr["Parent_ID"] = order.parent_id;
                        dr["SalesOrderNo"] = order.number;
                        dr["SalesOrderDate"] = order.date_created;
                        dr["Currency"] = order.currency;
                        dr["Currency_Symbol"] = "";
                        dr["Created_via"] = order.created_via;
                        dr["Customer_id"] = order.customer_id;
                        if (order.billing != null)
                        {
                            dr["Billing_first_name"] = order.billing.first_name;
                            dr["Billing_last_name"] = order.billing.last_name;
                            dr["Billing_company"] = order.billing.company;
                            dr["Billing_address_1"] = order.billing.address_1;
                            dr["Billing_address_2"] = order.billing.address_2;
                            dr["Billing_city"] = order.billing.city;
                            dr["Billing_state"] = order.billing.state;
                            dr["Billing_postcode"] = order.billing.postcode;
                            dr["Billing_country"] = order.billing.country;
                            dr["Billing_email"] = order.billing.email;
                            dr["Billing_phone"] = order.billing.phone;
                        }
                        if (order.shipping != null)
                        {
                            dr["Shipping_first_name"] = order.shipping.first_name;
                            dr["Shipping_last_name"] = order.shipping.last_name;
                            dr["Shipping_company"] = order.shipping.company;
                            dr["Shipping_address_1"] = order.shipping.address_1;
                            dr["Shipping_address_2"] = order.shipping.address_2;
                            dr["Shipping_city"] = order.shipping.city;
                            dr["Shipping_state"] = order.shipping.state;
                            dr["Shipping_postcode"] = order.shipping.postcode;
                            dr["Shipping_country"] = order.shipping.country;
                            dr["Shipping_phone"] = "";
                        }
                        if(order.customer_note != null)
                            dr["Customer_Note"] = order.customer_note;
                        dr["Status"] = order.status;
                        dr["Payment_method"] = order.payment_method;
                        dr["Payment_method_title"] = order.payment_method_title;
                        dr["Transaction_id"] = order.transaction_id;
                        if(order.date_paid != null)
                            dr["Date_Paid"] = order.date_paid;
                        if(order.date_completed != null)
                            dr["Date_completed"] = order.date_completed;
                        dr["Prices_include_tax"] = order.prices_include_tax;
                        dr["Discount_total"] = order.discount_total;
                        dr["Discount_tax"] = order.discount_tax;
                        dr["Shipping_total"] = order.shipping_total;
                        dr["Shipping_tax"] = order.shipping_tax;
                        dr["Cart_tax"] = order.cart_tax;
                        dr["Total"] = order.total;
                        dr["Total_tax"] = order.total_tax;
                        dtOrder.Rows.Add(dr);

                        if (order.line_items != null)
                        {
                            foreach (WooCommerceNET.WooCommerce.v2.OrderLineItem item in order.line_items)
                            {
                                DataRow drItem = dtItem.NewRow();
                                drItem["OrderID"] = order.id;
                                drItem["ID"] = item.id;
                                drItem["sku"] = item.sku;
                                drItem["ProductName"] = item.name;
                                drItem["product_id"] = item.product_id;
                                drItem["variation_id"] = item.variation_id;
                                drItem["Qty"] = item.quantity;
                                drItem["Price"] = item.price;
                                drItem["Tax_class"] = item.tax_class;
                                drItem["Subtotal"] = item.subtotal;
                                drItem["Subtotal_tax"] = item.subtotal_tax;
                                drItem["Total"] = item.total;
                                drItem["Total_tax"] = item.total_tax;
                                drItem["imageURL"] = "";
                                dtItem.Rows.Add(drItem);

                                if (item.taxes != null) 
                                {
                                    foreach (WooCommerceNET.WooCommerce.v2.TaxItem itemTax in item.taxes)
                                    {
                                        DataRow drItemTax = dtItemTax.NewRow();
                                        drItemTax["OrderID"] = order.id;
                                        drItemTax["ItemID"] = item.id;
                                        drItemTax["ID"] = itemTax.id;
                                        drItemTax["Total"] = (itemTax.total != null) ? itemTax.total : 0;
                                        drItemTax["SubTotal"] = (itemTax.subtotal != null) ? itemTax.subtotal : 0;
                                        dtItemTax.Rows.Add(drItemTax);
                                    }
                                }

                            }
                        }

                        if (order.tax_lines != null)
                        {
                            foreach (WooCommerceNET.WooCommerce.v2.OrderTaxLine tax in order.tax_lines)
                            {
                                DataRow drTax = dtTax.NewRow();
                                drTax["OrderID"] = order.id;
                                drTax["id"] = tax.id;
                                drTax["rate_code"] = tax.rate_code;
                                if(tax.rate_id != null)
                                    drTax["rate_id"] = tax.rate_id;
                                drTax["label"] = tax.label ;
                                drTax["compound"] = tax.compound ?? false;
                                drTax["tax_total"] = tax.tax_total ?? 0;
                                drTax["shipping_tax_total"] = tax.shipping_tax_total ?? 0;
                                dtTax.Rows.Add(drTax);
                            }
                        }

                        if (order.coupon_lines != null) 
                        {
                            foreach (WooCommerceNET.WooCommerce.v2.OrderCouponLine coupon in order.coupon_lines)
                            {
                                DataRow drCoupon = dtCoupon.NewRow();
                                drCoupon["OrderID"] = order.id;
                                drCoupon["ID"] = coupon.id;
                                drCoupon["Code"] = coupon.code;
                                if(coupon.discount != null)
                                    drCoupon["Discount"] = coupon.discount;
                                if(coupon.discount_tax != null)
                                    drCoupon["Discount_tax"] = coupon.discount_tax;
                                dtCoupon.Rows.Add(drCoupon);
                            }
                        }

                        if (order.fee_lines != null)
                        {
                            foreach (WooCommerceNET.WooCommerce.v2.OrderFeeLine fee in order.fee_lines)
                            {
                                DataRow drFees = dtFees.NewRow();
                                drFees["OrderID"] = order.id;
                                drFees["ID"] = fee.id;
                                drFees["Name"] = fee.name;
                                drFees["Tax_class"] = fee.tax_class;
                                drFees["Tax_status"] = fee.tax_status;
                                if(fee.total != null)
                                    drFees["Total"] = fee.total;
                                if(fee.total_tax != null)
                                    drFees["Total_tax"] = fee.total_tax;
                                dtFees.Rows.Add(drFees);

                                if (fee.taxes != null)
                                {
                                    foreach (WooCommerceNET.WooCommerce.v2.TaxItem itemTax in fee.taxes)
                                    {
                                        DataRow drfeesTax = dtFeesTax.NewRow();
                                        drfeesTax["OrderID"] = order.id;
                                        drfeesTax["FeesID"] = fee.id;
                                        drfeesTax["ID"] = itemTax.id;
                                        drfeesTax["Total"] = (itemTax.total != null) ? itemTax.total : 0;
                                        drfeesTax["SubTotal"] = (itemTax.subtotal != null) ? itemTax.subtotal : 0;
                                        dtFeesTax.Rows.Add(drfeesTax);
                                    }
                                }

                            }
                        }

                        if (order.shipping_lines != null)
                        {
                            foreach (WooCommerceNET.WooCommerce.v2.OrderShippingLine shipping in order.shipping_lines)
                            {
                                DataRow drShipping = dtShipping.NewRow();
                                drShipping["OrderID"] = order.id;
                                drShipping["id"] = shipping.id;
                                drShipping["Method_title"] = shipping.method_title;
                                drShipping["Method_id"] = shipping.method_id;
                                drShipping["instance_id"] = shipping.instance_id;
                                drShipping["Total"] = shipping.total;
                                drShipping["Total_tax"] = shipping.total_tax;
                                dtShipping.Rows.Add(drShipping);

                                if (shipping.taxes != null)
                                {
                                    foreach (WooCommerceNET.WooCommerce.v2.TaxItem itemTax in shipping.taxes)
                                    {
                                        DataRow drShippingTax = dtShippingTax.NewRow();
                                        drShippingTax["OrderID"] = order.id;
                                        drShippingTax["ShippingID"] = shipping.id;
                                        drShippingTax["ID"] = itemTax.id;
                                        drShippingTax["Total"] = (itemTax.total != null) ? itemTax.total : 0;
                                        drShippingTax["SubTotal"] = (itemTax.subtotal != null) ? itemTax.subtotal : 0;
                                        dtShippingTax.Rows.Add(drShippingTax);
                                    }
                                }

                            }
                        }

                        if (order.refunds != null)
                        {
                            foreach (WooCommerceNET.WooCommerce.v2.OrderRefundLine refund in order.refunds)
                            {
                                DataRow drRefund = dtRefund.NewRow();
                                drRefund["OrderID"] = order.id;
                                drRefund["ID"] = refund.id;
                                drRefund["Reason"] = refund.reason;
                                if (refund.total != null)
                                    drRefund["Total"] = refund.total;
                                dtRefund.Rows.Add(drRefund);
                            }
                        }
                    }
                    dtOrder.AcceptChanges();
                    dtItem.AcceptChanges();
                    dtItemTax.AcceptChanges();
                    dtTax.AcceptChanges();
                    dtCoupon.AcceptChanges();
                    dtFees.AcceptChanges();
                    dtFeesTax.AcceptChanges();
                    dtShipping.AcceptChanges();
                    dtShippingTax.AcceptChanges();
                    dtRefund.AcceptChanges();

                    ContextData contextData = Common.GetContextData(Request);
                    DBOperation dBConnection = new DBOperation(_configuration, contextData);
                    ArrayList alparameter = new ArrayList();
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@Order", dtOrder));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@Items", dtItem));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ItemsTax", dtItemTax));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@OrderTax", dtTax));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@OrderCoupon", dtCoupon));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@OrderFees", dtFees));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@FeesTax", dtFeesTax));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@OrderShipping", dtShipping));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@ShippingTax", dtShippingTax));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@OrderRefund", dtRefund));
                    alparameter.Add(new System.Data.SqlClient.SqlParameter("@UserID", contextData.UserID));
                    clsResult result = dBConnection.executeNonQuery("dbo.SalesOrder_Sync", alparameter);
                    if (result.HasError)
                    {
                        return new NotFoundObjectResult(new APIResult() { success = false, message = result.GetException.Message, data = null });
                    }
                    return Ok(
                        new { success = true, message = "Orders successfully synced", data = dtOrder.Rows.Count }
                        );
                }
                else
                {
                    return Ok(
                            new { success = false, message = wooCommerceOrderSyncResult.Message, data = 0 }
                            );
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
