using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Sales
{
    public class ProcessIn_AddModel
    {
        public long ProcessInID { get; set; }
        public string ProcessInNo { get; set; }
        public DateTime ProcessInDate { get; set; }
        public string ProcessInType { get; set; }
        public long ProcessID { get; set; }
        public long PartyID { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public List<ProcessIn_Item_AddModel> Items { get; set; }

    }
    public class ProcessIn_Item_AddModel
    {
        public long ID { get; set; }
        public long WOPlanningItemComponentID { get; set; }
        public long ProcessOutItemID { get; set; }
        public string WONo { get; set; }
        public string ProcessOutNo { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public long ComponentID { get; set; }
        public decimal Qty { get; set; }
        public decimal DQty { get; set; }
        public decimal RQty { get; set; }
        public string Remarks { get; set; }
    }

    public class ProcessIn_ProcessOut_ViewModel
    {
        public long ProcessOutID { get; set; }
        public string ProcessOutNo { get; set; }
        public DateTime ProcessOutDate { get; set; }
        public string ProcessOutType { get; set; }
        public long ProcessID { get; set; }
        public string ProcessName { get; set; }
        public long PartyID { get; set; }
        public string PartyName { get; set; }
        public string IssueType { get; set; }
        public string WorkType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? DueDays { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public decimal TotalPendingQty { get; set; }
    }
    public class ProcessIn_ProcessOut_Item_ViewModel
    {
        public long WOPlanningItemComponentID { get; set; }
        public long WOPlanningItemID { get; set; }
        public long WOPlanningID { get; set; }
        public string WONo { get; set; }
        public long ProcessOutItemID { get; set; }
        public long ProcessOutID { get; set; }
        public string ProcessOutNo { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public decimal UsedQty { get; set; }
        public decimal UsedDQty { get; set; }
        public decimal UsedRQty { get; set; }
        public long ComponentID { get; set; }
        public string ComponentName { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
        public List<WorkOrderPlanning_SalesOrder_Item_Attribute_ViewModel> AttributeValues { get; set; }
    }

    public class ProcessIn_ViewModel
    {
        public long ProcessInID { get; set; }
        public string ProcessInNo { get; set; }
        public DateTime ProcessInDate { get; set; }
        public string ProcessInType { get; set; }
        public long ProcessID { get; set; }
        public string ProcessName { get; set; }
        public long PartyID { get; set; }
        public string PartyName { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsLocked { get; set; }
        public List<ProcessIn_Item_AddModel> Items { get; set; }

    }
    public class ProcessIn_Item_ViewModel
    {
        public long ID { get; set; }
        public long ProcessInID { get; set; }
        public long WOPlanningItemComponentID { get; set; }
        public long WOPlanningItemID { get; set; }
        public long WOPlanningID { get; set; }
        public string WONo { get; set; }
        public long ProcessOutItemID { get; set; }
        public long ProcessOutID { get; set; }
        public string ProcessOutNo { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public long ComponentID { get; set; }
        public string ComponentName { get; set; }
        public decimal Qty { get; set; }
        public decimal DQty { get; set; }
        public decimal RQty { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
    }

    public class ProcessIn_Filter
    {
        public long ProcessInID { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string ProcessInNo { get; set; }
    }
    
    
}
