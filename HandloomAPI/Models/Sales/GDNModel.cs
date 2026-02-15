using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Sales
{
    public class GDN_ViewModel
    {
        public long GDNID { get; set; }
        public string GDNNo { get; set; }
        public long RefID { get; set; }
        public long RefParent_ID { get; set; }
        public DateTime GDNDate { get; set; }
        public string Currency { get; set; }
        public string Currency_Symbol { get; set; }
        public string Created_via { get; set; }
        public long PartyID { get; set; }
        public string BillingName { get; set; }
        public string ShippingName { get; set; }
        public string Billing_first_name { get; set; }
        public string Billing_last_name { get; set; }
        public string Billing_company { get; set; }
        public string Billing_address_1 { get; set; }
        public string Billing_address_2 { get; set; }
        public long Billing_CityID { get; set; }
        public string Billing_city { get; set; }
        public long Billing_StateID { get; set; }
        public string Billing_state { get; set; }
        public string Billing_postcode { get; set; }
        public long Billing_CountryID { get; set; }
        public string Billing_country { get; set; }
        public string Billing_email { get; set; }
        public string Billing_phone { get; set; }
        public string Shipping_first_name { get; set; }
        public string Shipping_last_name { get; set; }
        public string Shipping_company { get; set; }
        public string Shipping_address_1 { get; set; }
        public string Shipping_address_2 { get; set; }
        public long Shipping_CityID { get; set; }
        public string Shipping_city { get; set; }
        public long Shipping_StateID { get; set; }
        public string Shipping_state { get; set; }
        public string Shipping_postcode { get; set; }
        public long Shipping_CountryID { get; set; }
        public string Shipping_country { get; set; }
        public string Shipping_email { get; set; }
        public string Shipping_phone { get; set; }
        public string Customer_Note { get; set; }
        public string Status { get; set; }
        public string Payment_method { get; set; }
        public string Payment_method_title { get; set; }
        public string Transaction_id { get; set; }
        public DateTime? Date_Paid { get; set; }
        public DateTime? Date_completed { get; set; }
        public bool Prices_include_tax { get; set; }
        public decimal Discount_total { get; set; }
        public decimal Discount_tax { get; set; }
        public decimal Shipping_total { get; set; }
        public decimal Shipping_tax { get; set; }
        public decimal Cart_tax { get; set; }
        public decimal Total { get; set; }
        public decimal Total_tax { get; set; }
        public long ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string PartyName { get; set; }
        public string ModifiedByName { get; set; }
        public long BrandID { get; set; }
        public string BrandName { get; set; }
        public long ConsigneeID { get; set; }
        public long AgentID { get; set; }
        public string PONo { get; set; }
        public DateTime? PODate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public long SalesLocationID { get; set; }
        public string SalesLocationName { get; set; }
        public string Priority { get; set; }
        public int? DueDays { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public decimal GrossTotal { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalAmount { get; set; }
        public bool IsOnline { get; set; }
        public long? ExhibitionID { get; set; }
        public long? CreditTypeID { get; set; }
        public string ExhibitionName { get; set; }
        public string CreditTypeName { get; set; }
        public string VoucherType { get; set; }
    }

    public class GDN_AddModel
    {
        public long GDNID { get; set; }
        public string VoucherType { get; set; }
        public string GDNNo { get; set; }
        public DateTime GDNDate { get; set; }
        public long BrandID { get; set; }
        public long PartyID { get; set; }
        public long ConsigneeID { get; set; }
        public long AgentID { get; set; }
        public string PONo { get; set; }
        public DateTime? PODate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public long SalesLocationID { get; set; }
        public string Priority { get; set; }
        public long DueDays { get; set; }
        public string Remarks { get; set; }
        public List<GDN_Item_AddModel> Items { get; set; }

        public string Billing_FirstName { get; set; }
        public string Billing_LastName { get; set; }
        public string Billing_Company { get; set; }
        public string Billing_Address1 { get; set; }
        public string Billing_Address2 { get; set; }
        public string Billing_Postcode { get; set; }
        public string Billing_EmailID { get; set; }
        public string Billing_PhoneNo { get; set; }
        public long Billing_CountryID { get; set; }
        public long Billing_StateID { get; set; }
        public long Billing_CityID { get; set; }
        public string Billing_Country { get; set; }
        public string Billing_State { get; set; }
        public string Billing_City { get; set; }

        public string Shipping_FirstName { get; set; }
        public string Shipping_LastName { get; set; }
        public string Shipping_Company { get; set; }
        public string Shipping_Address1 { get; set; }
        public string Shipping_Address2 { get; set; }
        public string Shipping_Postcode { get; set; }
        public string Shipping_EmailID { get; set; }
        public string Shipping_PhoneNo { get; set; }
        public long Shipping_CountryID { get; set; }
        public long Shipping_StateID { get; set; }
        public long Shipping_CityID { get; set; }
        public string Shipping_Country { get; set; }
        public string Shipping_State { get; set; }
        public string Shipping_City { get; set; }

        public decimal TotalQty { get; set; }
        public decimal GrossTotal { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalAmount { get; set; }

        public long ExhibitionID { get; set; }
        public long CreditTypeID { get; set; }
        public string Status { get; set; }

        public List<GDN_Tax_AddModel> Taxes { get; set; }

    }
    public class GDN_Item_AddModel
    {
        public long ID { get; set; }
        public long SrNo { get; set; }
        public long SalesOrderItemID { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public List<GDN_Item_Attribute_AddModel> AttributeValues { get; set; }
        public List<GDN_Item_Tax_AddModel> Taxes { get; set; }
        public decimal Qty { get; set; }
        public decimal Price { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalTaxAmount { get; set; }
        public decimal FinalAmount { get; set; }
        public long HSNCodeID { get; set; }
        public string Remarks { get; set; }
        public List<Stock_Used_ViewModel> Stock { get; set; }
    }
    public class GDN_Tax_AddModel
    {
        public long TaxRateID { get; set; }
        public long TaxClassID { get; set; }
        public string name { get; set; }
        public decimal rate { get; set; }
        public decimal Amount { get; set; }
    }
    public class GDN_Item_Attribute_AddModel
    {
        public long ProductAttributeID { get; set; }
        public long ProductAttributeValueID { get; set; }
    }
    public class GDN_Item_Tax_AddModel
    {
        public long TaxRateID { get; set; }
        public long TaxClassID { get; set; }
        public string name { get; set; }
        public decimal rate { get; set; }
        public decimal Amount { get; set; }
    }
    public class GDN_Item_ViewModel
    {
        public long ID { get; set; }
        public long SalesOrderItemID { get; set; }
        public string SalesOrderNo{ get; set; }
        public DateTime? SalesOrderDate { get; set; }
        public long GDNID { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }   
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total_tax { get; set; }
        public decimal Total { get; set; }
        public long HSNCodeID { get; set; }
        public string HSNCodeName { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
        public List<GDN_Item_Attribute_ViewModel> AttributeValues { get; set; }
        public List<GDN_Item_Tax_ViewModel> Taxes { get; set; }
        public List<Stock_Used_ViewModel> Stock { get; set; }
    }
    public class GDN_Parent_Item_ViewModel
    {
        public long GDNID { get; set; }
        public long SrNo { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total_tax { get; set; }
        public decimal Total { get; set; }
        public string Photo { get; set; }
    }
    public class GDN_SalesOrder_ViewModel
    {
        public long SalesOrderID { get; set; }
        public string SalesOrderNo { get; set; }
        public DateTime SalesOrderDate { get; set; }
    }
    public class GDN_Item_Attribute_ViewModel
    {
        public long GDNID { get; set; }
        public long GDNItemID { get; set; }
        public long ProductAttributeID { get; set; }
        public long ProductAttributeValueID { get; set; }
        public string name { get; set; }
        public string option { get; set; }
    }
    public class GDN_Item_Tax_ViewModel
    {
        public long GDNID { get; set; }
        public long GDNItemID { get; set; }
        public long GDNItemTaxID { get; set; }
        public long TaxRateID { get; set; }
        public long TaxClassID { get; set; }
        public string TaxName { get; set; }
        public decimal Rate { get; set; }
        public decimal Total { get; set; }
    }
    public class GDN_Tax_ViewModel
    {
        public long GDNID { get; set; }
        public long GDNTaxID { get; set; }
        public long TaxRateID { get; set; }
        public long TaxClassID { get; set; }
        public string TaxName { get; set; }
        public decimal Rate { get; set; }
        public decimal Total { get; set; }
    }
    public class GDN_Report_Filter
    {
        public string Columns { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

    public class GDN_Filter
    {
        public long GDNID { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string GDNNo { get; set; }
        public long PartyID { get; set; }
        public long BrandID { get; set; }
        public long ConsigneeID { get; set; }
        public long AgentID { get; set; }
        public long SalesLocationID { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public long ExhibitionID { get; set; }
        public long CreditTypeID { get; set; }
    }

    public class GDN_SalesOrder_Item_ViewModel
    {
        public long ID { get; set; }
        public long SalesOrderID { get; set; }
        public string SalesOrderNo { get; set; }
        public DateTime SalesOrderDate { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total_tax { get; set; }
        public decimal Total { get; set; }
        public long HSNCodeID { get; set; }
        public string HSNCodeName { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
        public List<GDN_SalesOrder_Item_Attribute_ViewModel> AttributeValues { get; set; }
        public List<GDN_SalesOrder_Item_Tax_ViewModel> Taxes { get; set; }
    }
    public class GDN_SalesOrder_Item_Attribute_ViewModel
    {
        public long SalesOrderID { get; set; }
        public long SalesOrderItemID { get; set; }
        public long ProductAttributeID { get; set; }
        public long ProductAttributeValueID { get; set; }
        public string name { get; set; }
        public string option { get; set; }
    }
    public class GDN_SalesOrder_Item_Tax_ViewModel
    {
        public long SalesOrderID { get; set; }
        public long SalesOrderItemID { get; set; }
        public long SalesOrderItemTaxID { get; set; }
        public long TaxRateID { get; set; }
        public long TaxClassID { get; set; }
        public string TaxName { get; set; }
        public decimal Rate { get; set; }
        public decimal Total { get; set; }
    }
    public class GDN_SalesOrder_Tax_ViewModel
    {
        public long TaxRateID { get; set; }
        public long TaxClassID { get; set; }
        public string TaxName { get; set; }
        public decimal Rate { get; set; }
        public decimal Total { get; set; }
    }
}
