import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { UserCreateModel } from '../../Models/UserCreateModel';
import { WorkOrderPlanning_AddModel } from '../../Models/Sales/WorkOrderPlanningModel';

@Injectable({
  providedIn: 'root'
})
export class WorkorderplanningService {

  private Baseurl:string = environment.APIUrl;
  private APIKey:string = environment.APIKey;
  private ClientCode:string = environment.ClientCode;

  private API_Get = 'Sales/WorkOrderPlanning/Get';
  private API_GetOrderDetails = 'Sales/WorkOrderPlanning/GetOrderDetails';
  private API_Delete = 'Sales/WorkOrderPlanning/Delete';
  private API_Create = 'Sales/WorkOrderPlanning/Create';
  private API_Report = 'Sales/WorkOrderPlanning/GetReport';
  private API_Get_SalesOrder = 'Sales/WorkOrderPlanning/GetPendingSalesOrders';
  private API_Get_SalesOrderDetails = 'Sales/WorkOrderPlanning/GetPendingSalesOrderDetails';

  constructor(private http: HttpClient) { 
    }

  GetPendingSalesOrder(model:{
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
      
      return this.http.post(this.Baseurl + this.API_Get_SalesOrder, body,{ headers}).toPromise();
  
    }
  GetPendingSalesOrderDetails(SalesOrderIDs:string, WOPlanningID: number){
      let userSession:any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
      queryParameters = queryParameters.set("SalesOrderIDs", <any>SalesOrderIDs);
      queryParameters = queryParameters.set("WOPlanningID", WOPlanningID);
        
      let headers = new HttpHeaders();
      headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
      headers = headers.set("XApiKey", this.APIKey);
      
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
      
      return this.http.get(this.Baseurl + this.API_Get_SalesOrderDetails,{ 
        params: queryParameters,
        headers: headers
      }).toPromise();
    }
  Get(model:{
      WOPlanningID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      WONo: string
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
  
    Delete(WOPlanningID:number){
      
      let userSession:any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let headers = new HttpHeaders();
      headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
      headers = headers.set("XApiKey", this.APIKey);
      
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  
      const body=null;
      
      return this.http.post(this.Baseurl + this.API_Delete + "?WOPlanningID="+ WOPlanningID, body,{ headers});
    }
    normalizeDate(date: Date): Date {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(23, 59, 0, 0); // Set time to midnight
      return normalizedDate;
    }
    Create(model:WorkOrderPlanning_AddModel){
        
      let userSession:any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let headers = new HttpHeaders();
      headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
      headers = headers.set("XApiKey", this.APIKey);
      
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  
      if(model.WODate)
        model.WODate = this.normalizeDate(model.WODate);
      if(model.StartDate)
        model.StartDate = this.normalizeDate(model.StartDate);
      if(model.EndDate)
        model.EndDate = this.normalizeDate(model.EndDate);
  
      const body=JSON.stringify(model);
      
      return this.http.post(this.Baseurl + this.API_Create, body,{ headers});
    }
  
    GetOrderDetails(WOPlanningID:number){
      let userSession:any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
      queryParameters = queryParameters.set("WOPlanningID", <any>WOPlanningID);
        
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
      Columns: string,
      FromDate: Date,
      ToDate: Date
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
