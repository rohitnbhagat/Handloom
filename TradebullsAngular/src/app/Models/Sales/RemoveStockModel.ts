export class RemoveStock_AddModel {
    RemoveStockID?:number;
    RemoveStockNo?:string;
    RemoveStockDate?:Date;
    BrandID?:number;
    Remarks?:string;
    TotalQty?: number;
    Items:RemoveStock_Item_AddModel[] = [];
}

export class RemoveStock_Item_AddModel {
    ID?:number;
    SrNo?:number;
    StockItemID?:number;
    ParentProductID?:number;
    ProductID?:number;
    AttributeValues:{ProductAttributeID: number, ProductAttributeValueID: number} [] = [];
    Qty?:number;
    HSNCodeID?:number;
    Remarks?:string;
}

export class RemoveStock_Item{
    ID: number = 0;
    SrNo: number = 0;
    StockItemID: number = 0;
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
    HSNCodeID?: number;
    HSNCodeName?: string;
    Remarks?: string;
    Photo?: string;
}