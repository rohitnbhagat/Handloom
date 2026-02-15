using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Sales
{
    public class WorkOrderPlanning_ViewModel
    {
        public long WOPlanningID { get; set; }
        public string WONo { get; set; }
        public DateTime WODate { get; set; }
        public string WOType { get; set; }
        public long PreparedBy { get; set; }
        public string PreparedByName { get; set; }
        public long AssignedTo { get; set; }
        public string AssignedToName { get; set; }
        public long AuthorizedBy { get; set; }
        public string AuthorizedByName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? DueDays { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public long ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedByName { get; set; }
        public bool IsLocked { get; set; }
    }
    public class WorkOrderPlanning_AddModel
    {
        public long WOPlanningID { get; set; }
        public string WONo { get; set; }
        public DateTime WODate { get; set; }
        public string WOType { get; set; }
        public long PreparedBy { get; set; }
        public long AssignedTo { get; set; }
        public long AuthorizedBy { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? DueDays { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public List<WorkOrderPlanning_Item_AddModel> Items { get; set; }

    }
    public class WorkOrderPlanning_Item_AddModel
    {
        public long ID { get; set; }
        public long SrNo { get; set; }
        public long SalesOrderItemID { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public List<GDN_Item_Attribute_AddModel> AttributeValues { get; set; }
        public decimal Qty { get; set; }
        public long HSNCodeID { get; set; }
        public string Remarks { get; set; }
    }
    public class WorkOrderPlanning_Filter
    {
        public long WOPlanningID { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string WONo { get; set; }
    }
    public class WorkOrderPlanning_SalesOrder_ViewModel
    {
        public long SalesOrderID { get; set; }
        public string SalesOrderNo { get; set; }
        public DateTime SalesOrderDate { get; set; }
        public long BrandID { get; set; }
        public string BrandName { get; set; }
        public long PartyID { get; set; }
        public string PartyName { get; set; }
        public string PONo { get; set; }
        public DateTime? PODate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public long SalesLocationID { get; set; }
        public string SalesLocationName { get; set; }
        public string Priority { get; set; }
        public long? ExhibitionID { get; set; }
        public string ExhibitionName { get; set; }
        public int? DueDays { get; set; }
        public decimal TotalQty { get; set; }
        public decimal TotalPendingQty { get; set; }
    }
    public class WorkOrderPlanning_SalesOrder_Item_ViewModel
    {
        public long SalesOrderItemID { get; set; }
        public long SalesOrderID { get; set; }
        public string SalesOrderNo { get; set; }
        public DateTime SalesOrderDate { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public decimal UsedQty { get; set; }
        public long HSNCodeID { get; set; }
        public string HSNCodeName { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
        public List<WorkOrderPlanning_SalesOrder_Item_Attribute_ViewModel> AttributeValues { get; set; }
        public List<WorkOrderPlanning_SalesOrder_Item_Component_ViewModel> Components { get; set; }
    }
    public class WorkOrderPlanning_SalesOrder_Item_Attribute_ViewModel
    {
        public long SalesOrderID { get; set; }
        public long SalesOrderItemID { get; set; }
        public long ProductAttributeID { get; set; }
        public long ProductAttributeValueID { get; set; }
        public string name { get; set; }
        public string option { get; set; }
    }
    public class WorkOrderPlanning_SalesOrder_Item_Component_ViewModel
    {
        public long SalesOrderID { get; set; }
        public long SalesOrderItemID { get; set; }
        public long ProductID { get; set; }
        public long ComponentID { get; set; }
        public string ComponentName { get; set; }
    }
}
