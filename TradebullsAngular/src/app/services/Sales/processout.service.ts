import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { UserCreateModel } from '../../Models/UserCreateModel';
import { ProcessOut_AddModel } from '../../Models/Sales/ProcessOutModel';

@Injectable({
  providedIn: 'root'
})
export class ProcessoutService {

  private Baseurl: string = environment.APIUrl;
  private APIKey: string = environment.APIKey;
  private ClientCode: string = environment.ClientCode;

  private API_Delete = 'Sales/ProcessOut/Delete';
  private API_Get = 'Sales/ProcessOut/Get';
  private API_Create = 'Sales/ProcessOut/Create';
  private API_GetOrderDetails = 'Sales/ProcessOut/GetOrderDetails';
  private API_GetPendingWorkOrders = 'Sales/ProcessOut/GetPendingWorkOrders';
  private API_GetPendingWorkOrderDetails = 'Sales/ProcessOut/GetPendingWorkOrderDetails';

  constructor(private http: HttpClient) {
  }

  Delete(ProcessOutID: number) {

    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID: " + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body = null;

    return this.http.post(this.Baseurl + this.API_Delete + "?ProcessOutID=" + ProcessOutID, body, { headers });
  }
  Get(model: {
    ProcessOutID: number,
    FromDate: Date | null,
    ToDate: Date | null,
    ProcessOutNo: string
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
  Create(model: ProcessOut_AddModel) {

    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID: " + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    if (model.ProcessOutDate)
      model.ProcessOutDate = this.normalizeDate(model.ProcessOutDate);
    if (model.StartDate)
      model.StartDate = this.normalizeDate(model.StartDate);
    if (model.EndDate)
      model.EndDate = this.normalizeDate(model.EndDate);

    const body = JSON.stringify(model);

    return this.http.post(this.Baseurl + this.API_Create, body, { headers });
  }
  GetOrderDetails(ProcessOutID: number) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("ProcessOutID", <any>ProcessOutID);

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
  GetPendingWorkOrders(IssueType: string, ProcessID: number, PartyID: number) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    return this.http.get(this.Baseurl + this.API_GetPendingWorkOrders + "?IssueType=" + IssueType + "&ProcessID=" + ProcessID + "&PartyID=" + PartyID, { headers }).toPromise();

  }
  GetPendingWorkOrderDetails(WOPlanningIDs: string, ProcessOutID: number, IssueType: string,ProcessID: number, PartyID: number) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("WOPlanningIDs", <any>WOPlanningIDs);
    queryParameters = queryParameters.set("ProcessOutID", ProcessOutID);
    queryParameters = queryParameters.set("IssueType", IssueType);
    queryParameters = queryParameters.set("ProcessID", ProcessID);
    queryParameters = queryParameters.set("PartyID", PartyID);

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
