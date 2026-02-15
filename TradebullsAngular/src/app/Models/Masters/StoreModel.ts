export class StoreMaster_AddModel {
    StoreID?:number;
    StoreName?:string;
    Address1?:string;
    Address2?:string;
    City?:string;
    State?:string;
    Postcode?:string;
    Country?:string;
    EmailID?:string;
    PhoneNo?:string;
    ContactPerson?:string;
    Locations?:StoreLocationMaster_AddModel[]
}

export class StoreLocationMaster_AddModel {
    StoreLocationID?:number;
    SrNo:number = 0;
    LocationCode?:string;
    LocationName?:string;
}

export class StoreMaster_ViewModel {
    StoreID?:number;
    StoreName?:string;
    Address1?:string;
    Address2?:string;
    City?:string;
    State?:string;
    Postcode?:string;
    Country?:string;
    EmailID?:string;
    PhoneNo?:string;
    ContactPerson?:string;
    ModifiedByName?:string;
    ModifiedDate?:Date;
}

export class StoreLocationMaster_ViewModel {
    StoreLocationID?:number;
    LocationCode?:string;
    LocationName?:string;
    ModifiedByName?:string;
    ModifiedDate?:Date;
}