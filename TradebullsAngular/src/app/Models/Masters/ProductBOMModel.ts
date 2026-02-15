export class ProductBOM_AddModel {
    ProductID?:number;
    Remarks?:string;
    Components: ProductBOM_Component_AddModel[]  = [];
}
export class ProductBOM_Component_AddModel {
    ComponentID?:number;
    Processes: ProductBOM_Process_AddModel[]  = [];
}
export class ProductBOM_Process_AddModel {
    ProcessID?:number;
}

export class ProductBOM_ViewModel {
    ProductBOMID?:number;
    ProductID?:number;
    ProductName?:string;
    Remarks?:string;
    ModifiedBy?:number;
    ModifiedByName?:string;
    ModifiedDate?:Date;
    Components: ProductBOM_Component_ViewModel[]  = [];
}
export class ProductBOM_Component_ViewModel {
    ComponentID?:number;
    ComponentName?:string;
    Processes: ProductBOM_Process_ViewModel[]  = [];
}
export class ProductBOM_Process_ViewModel {
    ComponentID?:number;
    ProcessID?:number;
    ProcessName?:string;
}