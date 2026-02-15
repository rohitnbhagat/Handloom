export class WorkOrderPlanning_AddModel {
    WOPlanningID?:number;
    WONo?:string;
    WODate?:Date;
    WOType?:string;
    PreparedBy?:number;
    AssignedTo?:number;
    AuthorizedBy?:number;
    StartDate?:Date | null;
    EndDate?:Date | null;
    DueDays:number | null = null;
    Remarks?:string;
    TotalQty?:number;
    SalesOrderNo: string = "";
    Items:WorkOrderPlanning_Item_AddModel[] = [];
}

export class WorkOrderPlanning_Item_AddModel {
    ID?:number;
    SalesOrderItemID: string = "";
    SalesOrderNo: string = "";
    SrNo?:number;
    ParentProductID?:number;
    ProductID?:number;
    AttributeValues:{ProductAttributeID: number, ProductAttributeValueID: number} [] = [];
    Qty?:number;
    Remarks?:string;
    SOItems: {SalesOrderItemID: number,SalesOrderNo: string, Qty: number}[] = [];
    Components: {ComponentID: number, ComponentName: string}[] = [];
}

export class WorkOrderPlanning_Item{
    ID: number = 0;
    SrNo: number = 0;
    SalesOrderItemID: string = "";
    SalesOrderNo: string = "";
    ParentProductID: number = 0;
    ProductID: number = 0;
    sku?: string;
    ProductName?: string;
    AttributeValues: {
      ProductAttributeID: number,
      ProductAttributeValueID: number,
      Name: string,
      Option: string
    }[] = [];
    Qty: number = 0;
    Remarks?: string;
    Photo?: string;
    SOItems: {SalesOrderItemID: number,SalesOrderNo: string, Qty: number}[] = [];
    Components:{ComponentID: number, ComponentName: string}[] = [];
}

export class WorkOrderPlanning_SalesOrder_Item{
    SalesOrderItemID: number = 0;
    SalesOrderID: number = 0;
    SalesOrderNo?: string;
    SrNo: number = 0;
    ParentProductID: number = 0;
    ProductID: number = 0;
    sku?: string;
    ProductName?: string;
    AttributeValues: {
      ProductAttributeID: number,
      ProductAttributeValueID: number,
      Name: string,
      Option: string
    }[] = [];
    Qty: number = 0;
    UsedQty: number = 0;
    HSNCodeID?: number;
    HSNCodeName?: string;
    Remarks?: string;
    Photo?: string;
    Components:{ComponentID: number, ComponentName: string}[] = [];
}
