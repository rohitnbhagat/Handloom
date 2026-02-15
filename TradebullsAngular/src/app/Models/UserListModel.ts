export interface UserListModel {
    UserID?:number;
    UserTypeID?:number;
    FirstName?:string;
    LastName?:string;
    MiddleName?:string;
    FullName?:string;
    Gender?:string;
    EmailID?:string;
    PhoneNo?:string;
    Address1?:string;
    Address2?:string;
    Country?:string;
    State?:string;
    City?:string;
    ZipCode?:string;
    ClientCode?:string;
    PanNo?:string;
    AadharCardNo?:string;
    ParentUserID?:number;
    Relation?:string;
    IsLocked: boolean;
    LastLoginDate?:Date
}