import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { LoginModel } from '../Models/LoginModel';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../encoder';
import { ClientCreateModel } from '../Models/ClientCreateModel';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private Baseurl:string = environment.APIUrl;
  private APIKey:string = environment.APIKey;
  private ClientCode:string = environment.ClientCode;

  private API_Get = 'ClientMaster/Get';
  private API_LockUnlock = 'ClientMaster/LockUnlock';
  private API_Delete = 'ClientMaster/Delete';
  private API_Create = 'ClientMaster/Create';

  constructor(private http: HttpClient) { }

  Get(ClientID:number){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("ClientID", <any>ClientID);
      
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

  LockUnlock(ClientID:number){
    
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);
    

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=null;
    
    return this.http.post(this.Baseurl + this.API_LockUnlock + "?ClientID="+ ClientID, body,{ headers});
  }

  Delete(ClientID:number){
    
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);
    

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=null;
    
    return this.http.post(this.Baseurl + this.API_Delete + "?ClientID="+ ClientID, body,{ headers});
  }

  Create(clientCreateModel:ClientCreateModel){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=JSON.stringify(clientCreateModel);
    
    return this.http.post(this.Baseurl + this.API_Create, body,{ headers});
  }

}
