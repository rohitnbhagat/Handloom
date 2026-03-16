export class ProcessIn_AddModel {
    ProcessInID?:number;
    ProcessInNo?:string;
    ProcessInDate?:Date;
    ProcessInType?:string;
    ProcessID?:number;
    PartyID?:number;
    Remarks?:string;
    TotalQty?:number;
    Items:ProcessIn_Item_AddModel[] = [];
}

export class ProcessIn_Item_AddModel {
    ID?:number;
    WOPlanningItemComponentID: number = 0;
    ProcessOutItemID: number = 0;
    WONo: string = "";
    ProcessOutNo: string = "";
    SrNo?:number;
    ParentProductID?:number;
    ProductID?:number;
    sku?: string;
    ProductName?: string;
    ComponentID?:number;
    ComponentName?: string;
    Qty?:number;
    DQty?:number;
    RQty?:number;
    Remarks?:string;
    Photo: string = "";
}

export class ProcessIn_ProcessOut_ViewModel {
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
    TotalPendingQty?:number;
}

export class ProcessIn_ProcessOut_Item_ViewModel{
    WOPlanningItemComponentID: number = 0;
    WOPlanningItemID: number = 0;
    WOPlanningID: number = 0;
    WONo: string = "";
    ProcessOutItemID: number = 0;
    ProcessOutID: number = 0;
    ProcessOutNo: string = "";
    SrNo: number = 0;
    ParentProductID: number = 0;
    ProductID: number = 0;
    sku?: string;
    ProductName?: string;
    Qty: number = 0;
    UsedQty: number = 0;
    UsedDQty: number = 0;
    UsedRQty: number = 0;
    ComponentID?: number;
    ComponentName?: string;
    Remarks?: string;
    Photo?: string;
}

export class ProcessIn_ViewModel {
    ProcessInID?:number;
    ProcessInNo?:string;
    ProcessInDate?:Date;
    ProcessInType?:string;
    ProcessID?:number;
    ProcessName?: string;
    PartyID?:number;
    PartyName?: string;
    Remarks?:string;
    TotalQty?:number;
    Items:ProcessIn_Item_ViewModel[] = [];
}
export class ProcessIn_Item_ViewModel {
    ID?:number;
    WOPlanningItemComponentID: number = 0;
    ProcessOutItemID: number = 0;
    WONo: string = "";
    ProcessOutNo: string = "";
    SrNo?:number;
    ParentProductID?:number;
    ProductID?:number;
    sku?: string;
    ProductName?: string;
    ComponentID?:number;
    ComponentName?: string;
    Qty?:number;
    DQty?:number;
    RQty?:number;
    Remarks?:string;
    Photo: string = "";
}