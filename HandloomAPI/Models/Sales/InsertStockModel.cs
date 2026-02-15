using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Sales
{
    public class InsertStock_ViewModel
    {
        public long InsertStockID { get; set; }
        public string InsertStockNo { get; set; }
        public DateTime InsertStockDate { get; set; }
        public long PartyID { get; set; }
        public long ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string PartyName { get; set; }
        public string ModifiedByName { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public bool IsLocked { get; set; }
        public long BrandID { get; set; }
        public string BrandName { get; set; }
    }

    public class InsertStock_AddModel
    {
        public long InsertStockID { get; set; }
        public string InsertStockNo { get; set; }
        public DateTime InsertStockDate { get; set; }
        public long PartyID { get; set; }
        public long BrandID { get; set; }
        public string Remarks { get; set; }
        public List<InsertStock_Item_AddModel> Items { get; set; }
        public decimal TotalQty { get; set; }
    }
    public class InsertStock_Item_AddModel
    {
        public long ID { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public List<InsertStock_Item_Attribute_AddModel> AttributeValues { get; set; }
        public decimal Qty { get; set; }
        public long HSNCodeID { get; set; }
        public string Remarks { get; set; }
    }
    public class InsertStock_Item_Attribute_AddModel
    {
        public long ProductAttributeID { get; set; }
        public long ProductAttributeValueID { get; set; }
    }
    public class InsertStock_Item_ViewModel
    {
        public long ID { get; set; }
        public long InsertStockID { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }   
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public long HSNCodeID { get; set; }
        public string HSNCodeName { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
        public List<InsertStock_Item_Attribute_ViewModel> AttributeValues { get; set; }
    }
    public class InsertStock_Parent_Item_ViewModel
    {
        public long InsertStockID { get; set; }
        public long SrNo { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public string Photo { get; set; }
    }
    public class InsertStock_Item_Attribute_ViewModel
    {
        public long InsertStockID { get; set; }
        public long InsertStockItemID { get; set; }
        public long ProductAttributeID { get; set; }
        public long ProductAttributeValueID { get; set; }
        public string name { get; set; }
        public string option { get; set; }
    }
    public class InsertStock_Filter
    {
        public long InsertStockID { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string InsertStockNo { get; set; }
        public long PartyID { get; set; }
        public long BrandID { get; set; }
    }
}
