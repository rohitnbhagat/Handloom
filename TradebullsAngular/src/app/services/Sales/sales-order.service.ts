import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { UserCreateModel } from '../../Models/UserCreateModel';
import { SalesOrder_AddModel } from '../../Models/Sales/SalesOrderModel';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  private Baseurl:string = environment.APIUrl;
  private APIKey:string = environment.APIKey;
  private ClientCode:string = environment.ClientCode;

  private API_Get = 'Sales/SalesOrder/Get';
  private API_GetOrderDetails = 'Sales/SalesOrder/GetOrderDetails';
  private API_Delete = 'Sales/SalesOrder/Delete';
  private API_Create = 'Sales/SalesOrder/Create';
  private API_Report = 'Sales/SalesOrder/GetReport';
  
  constructor(private http: HttpClient) { 
  }

  Get(model:{
    SalesOrderID: number,
    FromDate: Date | null,
    ToDate: Date | null,
    SalesOrderNo: string,
    BrandID: number,
    PartyID: number,
    ConsigneeID: Number,
    AgentID: Number,
    SalesLocationID: Number,
    Priority: string,
    Status: string,
    ExhibitionID: Number,
    CreditTypeID: Number
  }){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    // let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
    // queryParameters = queryParameters.set("SalesOrderID", <any>SalesOrderID);
      
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

    // return this.http.post(this.Baseurl + this.API_Get,{ 
    //   params: queryParameters,
    //   headers: headers
    // }).toPromise();
  }

  Delete(SalesOrderID:number){
    
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=null;
    
    return this.http.post(this.Baseurl + this.API_Delete + "?SalesOrderID="+ SalesOrderID, body,{ headers});
  }
  normalizeDate(date: Date): Date {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(23, 59, 0, 0); // Set time to midnight
    return normalizedDate;
  }
  Create(model:SalesOrder_AddModel){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    if(model.SalesOrderDate)
      model.SalesOrderDate = this.normalizeDate(model.SalesOrderDate);
    if(model.PODate)
      model.PODate = this.normalizeDate(model.PODate);
    if(model.DeliveryDate)
      model.DeliveryDate = this.normalizeDate(model.DeliveryDate);

    const body=JSON.stringify(model);
    
    return this.http.post(this.Baseurl + this.API_Create, model,{ headers});
  }

  GetOrderDetails(SalesOrderID:number){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("SalesOrderID", <any>SalesOrderID);
      
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

  GetReport(model:{
    SalesOrderNo: string,
    PartyIDs: string,
    ProductIDs: string,
    VariationIDs: string,
    Columns: string,
    FromDate: Date,
    ToDate: Date,
    BrandIDs: string,
    SalesLocationIDs: string,
    ExhibitionIDs: string
  }){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    if(model.FromDate)
      model.FromDate = this.normalizeDate(model.FromDate);
    if(model.ToDate)
      model.ToDate = this.normalizeDate(model.ToDate);

    const body=JSON.stringify(model);
    
    return this.http.post(this.Baseurl + this.API_Report, body,{ headers});
  }

}
