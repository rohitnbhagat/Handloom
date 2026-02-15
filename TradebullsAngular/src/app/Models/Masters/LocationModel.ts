export class CountryMaster_AddModel {
    CountryID:number = 0;
    CountryCode?:string;
    CountryName?:string;
}
export class CountryMaster_ViewModel {
    CountryID?:number;
    CountryCode?:string;
    CountryName?:string;
    ModifiedBy?:number;
    ModifiedByName?:string;
    ModifiedDate?:Date;
}



export class StateMaster_AddModel {
    StateID:number = 0;
    CountryID:number = 0;
    StateCode?:string;
    StateName?:string;
}
export class StateMaster_ViewModel {
    StateID?:number;
    CountryID?:number;
    StateCode?:string;
    StateName?:string;
    CountryCode?:string;
    CountryName?:string;
    ModifiedBy?:number;
    ModifiedByName?:string;
    ModifiedDate?:Date;
}


export class CityMaster_AddModel {
    CityID:number = 0;
    StateID:number = 0;
    CountryID:number = 0;
    CityName?:string;
}
export class CityMaster_ViewModel {
    CityID?:number;
    CountryID?:number;
    StateID?:number;
    CityName?:string;
    StateCode?:string;
    StateName?:string;
    CountryCode?:string;
    CountryName?:string;
    ModifiedBy?:number;
    ModifiedByName?:string;
    ModifiedDate?:Date;
}