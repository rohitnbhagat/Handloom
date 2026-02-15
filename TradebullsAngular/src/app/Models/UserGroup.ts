export class UserGroupCreateModel {
    GroupID?:number;
    GroupName?:string;
    Remarks?:string;
    IsActive?:boolean
}

export interface UserGroupListModel {
    GroupID?:number;
    GroupName?:string;
    Remarks?:string;
    IsActive?:boolean
    ModifiedDate?:Date
}

export class UserGroupClientCreateModel {
    GroupID:number = 0;
    Clients:UserGroupUserModel[] = [];
}

export class UserGroupClientDeleteModel {
    GroupID:number = 0;
    Clients:UserGroupUserModel[] = [];
}

export class UserGroupUserModel {
    UserID:number = 0;
}

export interface UserGroupClientResultModel {
    success?:boolean;
    message?:string;
    data?:UserGroupClientListModel[];
}
export interface UserGroupClientListModel {
    GroupID?:number;
    GroupName?:string;
    ClientID?:number;
    ClientCode?:string;
    ClientName?:string;
    IsActive?:boolean
    ModifiedDate?:Date
}