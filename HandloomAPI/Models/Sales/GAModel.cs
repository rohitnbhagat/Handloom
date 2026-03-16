using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Sales
{
    public class GA_AddModel
    {
        public long GAID { get; set; }
        public string GANo { get; set; }
        public DateTime GADate { get; set; }
        public long BrandID { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public List<GA_Item_AddModel> Items { get; set; }
    }
    public class GA_Item_AddModel
    {
        public long ID { get; set; }
        public long WOPlanningItemID { get; set; }
        public string WONo { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public decimal Qty { get; set; }
        public string Remarks { get; set; }
    }

    public class GA_WorkOrderPlanning_ViewModel
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
    public class GA_WorkOrderPlanning_Item_ViewModel
    {
        public long WOPlanningItemID { get; set; }
        public long WOPlanningID { get; set; }
        public string WONo { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public decimal UsedQty { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
    }

    public class GA_ViewModel
    {
        public long GAID { get; set; }
        public string GANo { get; set; }
        public DateTime GADate { get; set; }
        public long BrandID { get; set; }
        public string BrandName { get; set; }
        public string Remarks { get; set; }
        public decimal TotalQty { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsLocked { get; set; }
        public List<GA_Item_ViewModel> Items { get; set; }
    }
    public class GA_Item_ViewModel
    {
        public long ID { get; set; }
        public long GAID { get; set; }
        public long WOPlanningItemID { get; set; }
        public long WOPlanningID { get; set; }
        public string WONo { get; set; }
        public long SrNo { get; set; }
        public long ParentProductID { get; set; }
        public long ProductID { get; set; }
        public string sku { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public string Remarks { get; set; }
        public string Photo { get; set; }
    }

    public class GA_Filter
    {
        public long GAID { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string GANo { get; set; }
    }
    
    
}
