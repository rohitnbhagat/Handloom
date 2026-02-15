using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Sales
{
    public class Stock_ViewModel
    {
        public long StockItemID { get; set; }
        public long BrandID { get; set; }
        public string BrandName { get; set; }
        public long ProductID { get; set; }
        public long ParentProductID { get; set; }
        public string SKU { get; set; }
        public string ProductName { get; set; }
        public string Remarks { get; set; }
        public decimal InQty { get; set; }
        public decimal OutQty { get; set; }
        public decimal Qty { get; set; }
    }

    public class Stock_Filter
    {
        public long BrandID { get; set; }
        public long ProductID { get; set; }
        public long ParentProductID { get; set; }
        public string Sku { get; set; }
        public string ProductName { get; set; }
        public string ProductIDs { get; set; }
        public long TransID { get; set; }
        public string TransType { get; set; }
        public string Remarks { get; set; }
        public int IsRemarks { get; set; }
    }

    public class Stock_Used_ViewModel {
        public long StockItemID { get; set; }
        public long BrandID { get; set; }
        public string BrandName { get; set; }
        public long ProductID { get; set; }
        public long ParentProductID { get; set; }
        public string SKU { get; set; }
        public string ProductName { get; set; }
        public string Remarks { get; set; }
        public decimal Qty { get; set; }
    }


    public class Stock_Register_Filter
    {
        public string BrandID { get; set; }
        public string ProductID { get; set; }
        public string VariationID { get; set; }
    }
    public class Stock_Register_ViewModel
    {
        public long StockItemID { get; set; }
        public long BrandID { get; set; }
        public string BrandName { get; set; }
        public long ProductID { get; set; }
        public long ParentProductID { get; set; }
        public string SKU { get; set; }
        public string ProductName { get; set; }
        public decimal InQty { get; set; }
        public decimal OutQty { get; set; }
        public decimal Qty { get; set; }
        public string Remarks { get; set; }
        public string ImageURL { get; set; }
    }
    public class Stock_Register_Item_ViewModel
    {
        public long StockItemInOutID { get; set; }
        public long TransID { get; set; }
        public string TransType { get; set; }
        public string TransNo { get; set; }
        public DateTime? TransDate { get; set; }
        public long TransChildID { get; set; }
        public long StockItemID { get; set; }
        public long BrandID { get; set; }
        public string BrandName { get; set; }
        public long ProductID { get; set; }
        public long ParentProductID { get; set; }
        public string SKU { get; set; }
        public string ProductName { get; set; }
        public string Remarks { get; set; }
        public decimal OutQty { get; set; }
        public decimal Qty { get; set; }
    }
}
