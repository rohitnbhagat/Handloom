import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { UserCreateModel } from '../../Models/UserCreateModel';
import { RemoveStock_AddModel } from '../../Models/Sales/RemoveStockModel';

@Injectable({
  providedIn: 'root'
})
export class RemoveStockService {

  private Baseurl:string = environment.APIUrl;
  private APIKey:string = environment.APIKey;
  private ClientCode:string = environment.ClientCode;

  private API_Get = 'Sales/RemoveStock/Get';
  private API_GetOrderDetails = 'Sales/RemoveStock/GetOrderDetails';
  private API_Delete = 'Sales/RemoveStock/Delete';
  private API_Create = 'Sales/RemoveStock/Create';
    
  constructor(private http: HttpClient) { 
  }

  Get(model:{
    RemoveStockID: number,
    FromDate: Date | null,
    ToDate: Date | null,
    RemoveStockNo: string,
    BrandID: number
  }){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    if(model.FromDate)
      model.FromDate = this.normalizeDate(model.FromDate);
    if(model.ToDate)
      model.ToDate = this.normalizeDate(model.ToDate);

    const body=JSON.stringify(model);
    
    return this.http.post(this.Baseurl + this.API_Get, body,{ headers}).toPromise();
  }

  Delete(RemoveStockID:number){
    
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=null;
    
    return this.http.post(this.Baseurl + this.API_Delete + "?RemoveStockID="+ RemoveStockID, body,{ headers});
  }
  normalizeDate(date: Date): Date {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(23, 59, 0, 0); // Set time to midnight
    return normalizedDate;
  }
  Create(model:RemoveStock_AddModel){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    if(model.RemoveStockDate)
      model.RemoveStockDate = this.normalizeDate(model.RemoveStockDate);
    
    const body=JSON.stringify(model);
    
    return this.http.post(this.Baseurl + this.API_Create, model,{ headers});
  }

  GetOrderDetails(RemoveStockID:number){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("RemoveStockID", <any>RemoveStockID);
      
    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    return this.http.get(this.Baseurl + this.API_GetOrderDetails,{ 
      params: queryParameters,
      headers: headers
    }).toPromise();
  }


}
