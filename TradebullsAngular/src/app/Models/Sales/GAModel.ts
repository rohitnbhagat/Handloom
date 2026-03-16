export class GA_AddModel {
    GAID?:number;
    GANo?:string;
    GADate?:Date;
    BrandID?:number;
    Remarks?:string;
    TotalQty?:number;
    Items:GA_Item_AddModel[] = [];
}

export class GA_Item_AddModel {
    ID?:number;
    WOPlanningItemID: number = 0;
    WONo: string = "";
    SrNo?:number;
    ParentProductID?:number;
    ProductID?:number;
    sku?: string;
    ProductName?: string;
    Qty?:number;
    Remarks?:string;
    Photo: string = "";
}

export class GA_WorkOrderPlanning_ViewModel {
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

export class GA_WorkOrderPlanning_Item_ViewModel{
    WOPlanningItemID: number = 0;
    WOPlanningID: number = 0;
    WONo: string = "";
    SrNo: number = 0;
    ParentProductID: number = 0;
    ProductID: number = 0;
    sku?: string;
    ProductName?: string;
    Qty: number = 0;
    UsedQty: number = 0;
    Remarks?: string;
    Photo?: string;
}


export class GA_ViewModel {
    GAID?:number;
    GANo?:string;
    GADate?:Date;
    BrandID?:number;
    BrandName?:string;
    Remarks?:string;
    TotalQty?:number;
    ModifiedByName?:string;
    ModifiedDate?:Date;
    Items:GA_Item_ViewModel[] = [];
}

export class GA_Item_ViewModel {
    ID?:number;
    WOPlanningItemID: number = 0;
    WONo: string = "";
    SrNo?:number;
    ParentProductID?:number;
    ProductID?:number;
    sku?: string;
    ProductName?: string;
    Qty?:number;
    Remarks?:string;
    Photo: string = "";
}
