using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Sales
{
    public class ProcessOut_AddModel
    {
        public long ProcessOutID { get; set; }
        public string ProcessOutNo { get; set; }
        public DateTime ProcessOutDate { get; set; }
        public string ProcessOutType { get; set; }
        public long ProcessID { get; set; }
        public long PartyID { get; set; }
        public string IssueType { get; set; }
        public string WorkType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? DueDays { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public List<ProcessOut_Item_AddModel> Items { get; set; }

    }
    public class ProcessOut_Item_AddModel
    {
        public long ID { get; set; }
        public long WOPlanningItemComponentID { get; set; }
        public long ProcessInItemID { get; set; }
        public string WONo { get; set; }
        public string ProcessInNo { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public long ComponentID { get; set; }
        public decimal Qty { get; set; }
        public string Remarks { get; set; }
    }

    public class ProcessOut_WorkOrderPlanning_ViewModel
    {
        public long WOPlanningID { get; set; }
        public string WONo { get; set; }
        public DateTime WODate { get; set; }
        public string WOType { get; set; }
        public string PreparedByName { get; set; }
        public string AssignedToName { get; set; }
        public string AuthorizedByName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DueDays { get; set; }
        public decimal TotalQty { get; set; }
        public decimal TotalPendingQty { get; set; }
    }
    public class ProcessOut_WorkOrderPlanning_Item_ViewModel
    {
        public long WOPlanningItemComponentID { get; set; }
        public long WOPlanningItemID { get; set; }
        public long WOPlanningID { get; set; }
        public string WONo { get; set; }
        public long ProcessInItemID { get; set; }
        public long ProcessInID { get; set; }
        public string ProcessInNo { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public decimal UsedQty { get; set; }
        public long ComponentID { get; set; }
        public string ComponentName { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
        public List<WorkOrderPlanning_SalesOrder_Item_Attribute_ViewModel> AttributeValues { get; set; }
    }

    public class ProcessOut_ViewModel
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
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsLocked { get; set; }
        public List<ProcessOut_Item_AddModel> Items { get; set; }

    }
    public class ProcessOut_Item_ViewModel
    {
        public long ID { get; set; }
        public long ProcessOutID { get; set; }
        public long WOPlanningItemComponentID { get; set; }
        public long WOPlanningItemID { get; set; }
        public long WOPlanningID { get; set; }
        public string WONo { get; set; }
        public long ProcessInItemID { get; set; }
        public long ProcessInID { get; set; }
        public string ProcessInNo { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public long ComponentID { get; set; }
        public string ComponentName { get; set; }
        public decimal Qty { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
    }

    public class ProcessOut_Filter
    {
        public long ProcessOutID { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string ProcessOutNo { get; set; }
    }
    
    
}
