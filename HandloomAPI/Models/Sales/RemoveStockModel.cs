using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Sales
{
    public class RemoveStock_ViewModel
    {
        public long RemoveStockID { get; set; }
        public string RemoveStockNo { get; set; }
        public DateTime RemoveStockDate { get; set; }
        public long ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedByName { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public bool IsLocked { get; set; }
        public long BrandID { get; set; }
        public string BrandName { get; set; }
    }

    public class RemoveStock_AddModel
    {
        public long RemoveStockID { get; set; }
        public string RemoveStockNo { get; set; }
        public DateTime RemoveStockDate { get; set; }
        public long BrandID { get; set; }
        public string Remarks { get; set; }
        public List<RemoveStock_Item_AddModel> Items { get; set; }
        public decimal TotalQty { get; set; }
    }
    public class RemoveStock_Item_AddModel
    {
        public long ID { get; set; }
        public long SrNo { get; set; }
        public long StockItemID { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public List<RemoveStock_Item_Attribute_AddModel> AttributeValues { get; set; }
        public decimal Qty { get; set; }
        public long HSNCodeID { get; set; }
        public string Remarks { get; set; }
    }
    public class RemoveStock_Item_Attribute_AddModel
    {
        public long ProductAttributeID { get; set; }
        public long ProductAttributeValueID { get; set; }
    }
    public class RemoveStock_Item_ViewModel
    {
        public long ID { get; set; }
        public long RemoveStockID { get; set; }
        public long SrNo { get; set; }
        public long StockItemID { get; set; }   
        public long ParentProductID { get; set; }   
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public long HSNCodeID { get; set; }
        public string HSNCodeName { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
        public List<RemoveStock_Item_Attribute_ViewModel> AttributeValues { get; set; }
    }
    public class RemoveStock_Parent_Item_ViewModel
    {
        public long RemoveStockID { get; set; }
        public long SrNo { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public string Photo { get; set; }
    }
    public class RemoveStock_Item_Attribute_ViewModel
    {
        public long RemoveStockID { get; set; }
        public long RemoveStockItemID { get; set; }
        public long ProductAttributeID { get; set; }
        public long ProductAttributeValueID { get; set; }
        public string name { get; set; }
        public string option { get; set; }
    }
    public class RemoveStock_Filter
    {
        public long RemoveStockID { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string RemoveStockNo { get; set; }
        public long PartyID { get; set; }
        public long BrandID { get; set; }
    }
}
