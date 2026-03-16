export class ProcessOut_AddModel {
    ProcessOutID?:number;
    ProcessOutNo?:string;
    ProcessOutDate?:Date;
    ProcessOutType?:string;
    ProcessID?:number;
    PartyID?:number;
    IssueType?:string;
    WorkType?:string;
    StartDate?:Date | null;
    EndDate?:Date | null;
    DueDays:number | null = null;
    Remarks?:string;
    TotalQty?:number;
    Items:ProcessOut_Item_AddModel[] = [];
}

export class ProcessOut_Item_AddModel {
    ID?:number;
    WOPlanningItemComponentID: number = 0;
    ProcessInItemID: number = 0;
    WONo: string = "";
    ProcessInNo: string = "";
    SrNo?:number;
    ParentProductID?:number;
    ProductID?:number;
    sku?: string;
    ProductName?: string;
    ComponentID?:number;
    ComponentName?: string;
    Qty?:number;
    Remarks?:string;
    Photo: string = "";
}

export class ProcessOut_WorkOrderPlanning_ViewModel {
    WOPlanningID?:number;
    WONo?:string;
    WODate?:Date;
    WOType?:string;
    PreparedByName?:string;
    AssignedToName?:string;
    AuthorizedByName?:string;
    StartDate?:Date | null;
    EndDate?:Date | null;
    DueDays:number | null = null;
    TotalQty?:number;
    TotalPendingQty?:number;
}

export class ProcessOut_WorkOrderPlanning_Item_ViewModel{
    WOPlanningItemComponentID: number = 0;
    WOPlanningItemID: number = 0;
    WOPlanningID: number = 0;
    WONo: string = "";
    ProcessInItemID: number = 0;
    ProcessInID: number = 0;
    ProcessInNo: string = "";
    SrNo: number = 0;
    ParentProductID: number = 0;
    ProductID: number = 0;
    sku?: string;
    ProductName?: string;
    Qty: number = 0;
    UsedQty: number = 0;
    ComponentID?: number;
    ComponentName?: string;
    Remarks?: string;
    Photo?: string;
}


export class ProcessOut_ViewModel {
    ProcessOutID?:number;
    ProcessOutNo?:string;
    ProcessOutDate?:Date;
    ProcessOutType?:string;
    ProcessID?:number;
    ProcessName?:string;
    PartyID?:number;
    PartyName?:string;
    IssueType?:string;
    WorkType?:string;
    StartDate?:Date | null;
    EndDate?:Date | null;
    DueDays:number | null = null;
    Remarks?:string;
    TotalQty?:number;
    Items:ProcessOut_Item_ViewModel[] = [];
}

export class ProcessOut_Item_ViewModel {
    ID?:number;
    WOPlanningItemComponentID: number = 0;
    ProcessInItemID: number = 0;
    WONo: string = "";
    ProcessInNo: string = "";
    SrNo?:number;
    ParentProductID?:number;
    ProductID?:number;
    sku?: string;
    ProductName?: string;
    ComponentID?:number;
    ComponentName?: string;
    Qty?:number;
    Remarks?:string;
    Photo: string = "";
}
