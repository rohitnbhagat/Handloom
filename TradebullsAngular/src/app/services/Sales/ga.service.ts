import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { UserCreateModel } from '../../Models/UserCreateModel';
import { GA_AddModel } from '../../Models/Sales/GAModel';

@Injectable({
  providedIn: 'root'
})
export class GaService {

  private Baseurl: string = environment.APIUrl;
    private APIKey: string = environment.APIKey;
    private ClientCode: string = environment.ClientCode;
  
    private API_Delete = 'Sales/GA/Delete';
    private API_Get = 'Sales/GA/Get';
    private API_Create = 'Sales/GA/Create';
    private API_GetOrderDetails = 'Sales/GA/GetOrderDetails';
    private API_GetPendingWorkOrders = 'Sales/GA/GetPendingWorkOrders';
    private API_GetPendingWorkOrderDetails = 'Sales/GA/GetPendingWorkOrderDetails';
  
    constructor(private http: HttpClient) {
    }
  
    Delete(GAID: number) {
  
      let userSession: any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let headers = new HttpHeaders();
      headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID: " + context.data.UserID + " }");
      headers = headers.set("XApiKey", this.APIKey);
  
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  
      const body = null;
  
      return this.http.post(this.Baseurl + this.API_Delete + "?GAID=" + GAID, body, { headers });
    }
    Get(model: {
      GAID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      GANo: string
    }) {
      let userSession: any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let headers = new HttpHeaders();
      headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
      headers = headers.set("XApiKey", this.APIKey);
  
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  
      if (model.FromDate)
        model.FromDate = this.normalizeDate(model.FromDate);
      if (model.ToDate)
        model.ToDate = this.normalizeDate(model.ToDate);
  
      const body = JSON.stringify(model);
  
      return this.http.post(this.Baseurl + this.API_Get, body, { headers }).toPromise();
    }
    Create(model: GA_AddModel) {
  
      let userSession: any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let headers = new HttpHeaders();
      headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID: " + context.data.UserID + " }");
      headers = headers.set("XApiKey", this.APIKey);
  
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  
      if (model.GADate)
        model.GADate = this.normalizeDate(model.GADate);
  
      const body = JSON.stringify(model);
  
      return this.http.post(this.Baseurl + this.API_Create, body, { headers });
    }
    GetOrderDetails(GAID: number) {
      let userSession: any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
      queryParameters = queryParameters.set("GAID", <any>GAID);
  
      let headers = new HttpHeaders();
      headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
      headers = headers.set("XApiKey", this.APIKey);
  
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  
      return this.http.get(this.Baseurl + this.API_GetOrderDetails, {
        params: queryParameters,
        headers: headers
      }).toPromise();
    }
    GetPendingWorkOrders() {
      let userSession: any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let headers = new HttpHeaders();
      headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
      headers = headers.set("XApiKey", this.APIKey);
  
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  
      return this.http.get(this.Baseurl + this.API_GetPendingWorkOrders, { headers }).toPromise();
  
    }
    GetPendingWorkOrderDetails(WOPlanningIDs: string, GAID: number) {
      let userSession: any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
      queryParameters = queryParameters.set("WOPlanningIDs", <any>WOPlanningIDs);
      queryParameters = queryParameters.set("GAID", GAID);
  
      let headers = new HttpHeaders();
      headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
      headers = headers.set("XApiKey", this.APIKey);
  
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  
      return this.http.get(this.Baseurl + this.API_GetPendingWorkOrderDetails, {
        params: queryParameters,
        headers: headers
      }).toPromise();
    }
  
    normalizeDate(date: Date): Date {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(23, 59, 0, 0); // Set time to midnight
      return normalizedDate;
    }
}
