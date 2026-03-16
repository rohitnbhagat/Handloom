import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { UserCreateModel } from '../../Models/UserCreateModel';
import { ProcessIn_AddModel } from '../../Models/Sales/ProcessInModel';

@Injectable({
  providedIn: 'root'
})
export class ProcessinService {

  private Baseurl: string = environment.APIUrl;
  private APIKey: string = environment.APIKey;
  private ClientCode: string = environment.ClientCode;

  private API_Delete = 'Sales/ProcessIn/Delete';
  private API_Get = 'Sales/ProcessIn/Get';
  private API_Create = 'Sales/ProcessIn/Create';
  private API_GetOrderDetails = 'Sales/ProcessIn/GetOrderDetails';
  private API_GetPendingProcessOuts = 'Sales/ProcessIn/GetPendingProcessOut';
  private API_GetPendingProcessOutDetails = 'Sales/ProcessIn/GetPendingProcessOutDetails';

  constructor(private http: HttpClient) {
  }

  Delete(ProcessInID: number) {

    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID: " + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body = null;

    return this.http.post(this.Baseurl + this.API_Delete + "?ProcessInID=" + ProcessInID, body, { headers });
  }
  Get(model: {
    ProcessInID: number,
    FromDate: Date | null,
    ToDate: Date | null,
    ProcessInNo: string
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
  Create(model: ProcessIn_AddModel) {

    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID: " + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    if (model.ProcessInDate)
      model.ProcessInDate = this.normalizeDate(model.ProcessInDate);

    const body = JSON.stringify(model);

    return this.http.post(this.Baseurl + this.API_Create, body, { headers });
  }
  GetOrderDetails(ProcessInID: number) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("ProcessInID", <any>ProcessInID);

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
  GetPendingProcessOuts(ProcessID: number, PartyID: number) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    return this.http.get(this.Baseurl + this.API_GetPendingProcessOuts + `?ProcessID=${ProcessID}&PartyID=${PartyID}`, { headers }).toPromise();

  }
  GetPendingProcessOutDetails(ProcessOutIDs: string, ProcessInID: number) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("ProcessOutIDs", <any>ProcessOutIDs);
    queryParameters = queryParameters.set("ProcessInID", <any>ProcessInID);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    return this.http.get(this.Baseurl + this.API_GetPendingProcessOutDetails, {
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
