export interface ClientListModel {
    ClientID?:number;
    ClientCode?:string;
    TOTP?:string;
    Password?:string;
    IsActive?:boolean;
    IsLocked?:boolean;
    ModifiedDate?:Date;

    ClientName?:string;
    EmailID?:string;
    DematAccountNo?:string;
}