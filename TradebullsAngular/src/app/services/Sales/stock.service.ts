import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { UserCreateModel } from '../../Models/UserCreateModel';
import { Stock_FilterModel, Stock_Register_FilterModel } from '../../Models/Sales/StockModel';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private Baseurl:string = environment.APIUrl;
  private APIKey:string = environment.APIKey;
  private ClientCode:string = environment.ClientCode;

  private API_Get = 'Sales/Stock/Get';
  private API_GetRegister = 'Sales/Stock/Register';
  private API_GetRegisterItem = 'Sales/Stock/RegisterItem';
    
  constructor(private http: HttpClient) { 
  }

  Get(model:Stock_FilterModel){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    const body=JSON.stringify(model);
    
    return this.http.post(this.Baseurl + this.API_Get, body,{ headers}).toPromise();
  }

   GetRegister(model:Stock_Register_FilterModel){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    const body=JSON.stringify(model);
    
    return this.http.post(this.Baseurl + this.API_GetRegister, body,{ headers}).toPromise();
  }

  GetRegisterItem(StockItemID:number, type:string){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    return this.http.post(this.Baseurl + this.API_GetRegisterItem + "?StockItemID=" + StockItemID + "&type="+ type, null,{ headers}).toPromise();
  }

}
