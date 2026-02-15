export class InsertStock_AddModel {
    InsertStockID?:number;
    InsertStockNo?:string;
    InsertStockDate?:Date;
    PartyID?:number;
    BrandID?:number;
    Remarks?:string;
    TotalQty?: number;
    Items:InsertStock_Item_AddModel[] = [];
}

export class InsertStock_Item_AddModel {
    ID?:number;
    SrNo?:number;
    ParentProductID?:number;
    ProductID?:number;
    AttributeValues:{ProductAttributeID: number, ProductAttributeValueID: number} [] = [];
    Qty?:number;
    HSNCodeID?:number;
    Remarks?:string;
}

export class InsertStock_Item{
    ID: number = 0;
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
    HSNCodeID?: number;
    HSNCodeName?: string;
    Remarks?: string;
    Photo?: string;
}