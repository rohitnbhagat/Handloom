export class Stock_FilterModel {
    BrandID:number = 0;
    ProductID:number = 0;
    ParentProductID?:number = 0;
    Sku:string = "";
    ProductName:string = "";
    ProductIDs:string = "";
    TransID: number = 0;
    TransType: string = "";
    Remarks: string = "";
    IsRemarks: number = -1;
}

export class Stock_ViewModel {
    StockItemID:number = 0;
    BrandID:number = 0;
    BrandName:string = "";
    ProductID:number = 0;
    ParentProductID?:number = 0;
    SKU:string = "";
    ProductName:string = "";
    Remarks:string = "";
    Qty:number = 0;
    UsedQty: number = 0;
}

export class Stock_View_response_Model {
    success:boolean = false;
    message:string = "";
    data:Stock_ViewModel[] | null = null;
}

export class Stock_Used_ViewModel {
    StockItemID:number = 0;
    BrandID:number = 0;
    BrandName:string = "";
    ProductID:number = 0;
    ParentProductID?:number = 0;
    SKU:string = "";
    ProductName:string = "";
    Remarks:string = "";
    Qty:number = 0;
}

export class Stock_Register_FilterModel {
    BrandID:string = "";
    ProductID:string = "";
    VariationID:string = "";
}