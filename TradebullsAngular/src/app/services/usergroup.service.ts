import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { LoginModel } from '../Models/LoginModel';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../encoder';
import { UserGroupCreateModel, UserGroupListModel, UserGroupClientCreateModel, UserGroupClientDeleteModel, UserGroupClientListModel } from '../Models/UserGroup';

@Injectable({
  providedIn: 'root'
})
export class UsergroupService {

  private Baseurl:string = environment.APIUrl;
  private APIKey:string = environment.APIKey;
  private ClientCode:string = environment.ClientCode;

  private API_Get = 'UserGroup/Get';
  private API_ActiveInactive = 'UserGroup/ActiveInActive';
  private API_Delete = 'UserGroup/Delete';
  private API_Create = 'UserGroup/Create';

  private API_Client_Create = 'UserGroup/CreateClients';
  private API_Client_Delete = 'UserGroup/DeleteClients';
  private API_Client_Get = 'UserGroup/GetClients';

  constructor(private http: HttpClient) { 
  }
  
  Get(GroupID:number, GroupName:string){

    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("GroupID", <any>GroupID);
    queryParameters = queryParameters.set("GroupName", <any>GroupName);
      
    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    return this.http.get(this.Baseurl + this.API_Get,{ 
      params: queryParameters,
      headers: headers
    });
  }

  ActiveInActive(GroupID:number){
    
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);
    

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=null;
    
    return this.http.post(this.Baseurl + this.API_ActiveInactive + "?GroupID="+ GroupID, body,{ headers});
  }

  Delete(GroupID:number){
    
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);
    

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=null;
    
    return this.http.post(this.Baseurl + this.API_Delete + "?GroupID="+ GroupID, body,{ headers});
  }

  Create(userCreateModel:UserGroupCreateModel){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=JSON.stringify(userCreateModel);
    
    return this.http.post(this.Baseurl + this.API_Create, body,{ headers});
  }
  
  CreateClients(userCreateModel:UserGroupClientCreateModel){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=JSON.stringify(userCreateModel);
    
    return this.http.post(this.Baseurl + this.API_Client_Create, body,{ headers});
  }

  DeleteClients(userCreateModel:UserGroupClientDeleteModel){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=JSON.stringify(userCreateModel);
    
    return this.http.post(this.Baseurl + this.API_Client_Delete, body,{ headers});
  }

  GetClients(GroupID:number, UserID: number, UserName:string){

    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("GroupID", <any>GroupID);
    queryParameters = queryParameters.set("UserID", <any>UserID);
    queryParameters = queryParameters.set("UserName", <any>UserName);
      
    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    return this.http.get(this.Baseurl + this.API_Client_Get,{ 
      params: queryParameters,
      headers: headers
    });
  }

}
