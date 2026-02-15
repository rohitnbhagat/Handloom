using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace HandloomAPI.Models.Masters.ProductMaster
{
    public class ProductMaster_search_filter 
    { 
        public long ProductID { get; set; }
        public long ParentProductID { get; set; }
        public int ProductType { get; set; }
        public string ProductName { get; set; }
        public string ProductAttributeIDs { get; set; }
        public string ProductAttributeValueIDs { get; set; }
        public string ProductIDs { get; set; }
    }

    public class ProductMaster_Attribute_ViewModel
    {
        public long ProductID { get; set; }
        public long ProductAttributeID { get; set; }
        public long id { get; set; }
        public string Name { get; set; }
    }
    public class ProductMaster_AttributeValue_ViewModel
    {
        public long ProductID { get; set; }
        public long ProductAttributeID { get; set; }
        public long ProductAttributeValueID { get; set; }
        public long id { get; set; }
        public string option { get; set; }
    }
    public class ProductMaster_ViewModel
    {
        public long ProductID { get; set; }
        public long id { get; set; }
        public string name { get; set; }
        public string slug { get; set; }
        public string tax_status { get; set; }
        public string tax_class { get; set; }
        public string sku { get; set; }
        public string stock_status { get; set; }
        public long? stock_quantity { get; set; }
        public bool? backorders_allowed { get; set; }
        public bool? backordered { get; set; }
        public string backorders { get; set; }
        public bool? sold_individually { get; set; }
        public decimal? weight { get; set; }
        public string dimensions_height { get; set; }
        public string dimensions_length { get; set; }
        public string dimensions_width { get; set; }
        public string shipping_class { get; set; }
        public string shipping_class_id { get; set; }
        public string purchase_note { get; set; }
        public long? menu_order { get; set; }
        public string short_description { get; set; }
        public string description { get; set; }
        public bool? shipping_taxable { get; set; }
        public bool? shipping_required { get; set; }
        public string button_text { get; set; }
        public bool? reviews_allowed { get; set; }
        public string average_rating { get; set; }
        public long? parent_id { get; set; }
        public long? rating_count { get; set; }
        public long? download_expiry { get; set; }
        public bool? enable_html_description { get; set; }
        public string catalog_visibility { get; set; }
        public bool? featured { get; set; }
        public string status { get; set; }
        public string type { get; set; }
        public DateTime? date_modified { get; set; }
        public DateTime? date_created { get; set; }
        public string enable_html_short_description { get; set; }
        public decimal? price { get; set; }
        public bool? downloadable { get; set; }
        public bool? @virtual { get; set; }
        public long? total_sales { get; set; }
        public bool? purchasable { get; set; }
        public bool? on_sale { get; set; }
        public DateTime? date_on_sale_from { get; set; }
        public DateTime? date_on_sale_to { get; set; }
        public decimal? sale_price { get; set; }
        public decimal? regular_price { get; set; }
        public bool IsVariationProduct { get; set; }
        public long ParentProductID { get; set; }
        public long TaxClassID { get; set; }
        public string Photo { get; set; }

        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }

    }

    public class ProductMaster_TaxRate_ViewModel
    {
        public long TaxRateID { get; set; }
        public long TaxClassID { get; set; }
        public string name { get; set; }
        public decimal rate { get; set; }
    }
    public class ProductMaster_TaxRate_Parameter
    {
        public long CountryID { get; set; }
        public long StateID { get; set; }
        public string ProductIDs { get; set; }
    }
}
