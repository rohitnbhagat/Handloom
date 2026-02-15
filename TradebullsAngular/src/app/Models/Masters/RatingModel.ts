export class RatingMaster_AddModel {
    RatingID?:number;
    RatingName?:string;
    Remarks?:string;
}

export class RatingMaster_ViewModel {
    RatingID?:number;
    RatingName?:string;
    Remarks?:string;
    ModifiedBy?:number;
    ModifiedByName?:string;
    ModifiedDate?:Date;
}