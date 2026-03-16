export class FG_AddModel {
    FGID?:number;
    FGNo?:string;
    FGDate?:Date;
    Remarks?:string;
    TotalQty?:number;
    Items:FG_Item_AddModel[] = [];
}

export class FG_Item_AddModel {
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

export class FG_ProcessIn_ViewModel {
    ProcessInID?:number;
    ProcessInNo?:string;
    ProcessInDate?:Date;
    ProcessInType?:string;
    ProcessID?:number;
    ProcessName?:string;
    PartyID?:number;
    PartyName?:string;
    Remarks?:string;
    TotalQty?:number;
    TotalPendingQty?:number;
}

export class FG_ProcessIn_Item_ViewModel{
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

export class FG_ViewModel {
    FGID?:number;
    FGNo?:string;
    FGDate?:Date;
    Remarks?:string;
    TotalQty?:number;
    IsLocked?:boolean;
    Items:FG_Item_ViewModel[] = [];
}
export class FG_Item_ViewModel {
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