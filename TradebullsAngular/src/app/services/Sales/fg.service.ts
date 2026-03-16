import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { UserCreateModel } from '../../Models/UserCreateModel';
import { FG_AddModel } from '../../Models/Sales/FGModel';

@Injectable({
  providedIn: 'root'
})
export class FgService {

  private Baseurl: string = environment.APIUrl;
  private APIKey: string = environment.APIKey;
  private ClientCode: string = environment.ClientCode;

  private API_Delete = 'Sales/FG/Delete';
  private API_Get = 'Sales/FG/Get';
  private API_Create = 'Sales/FG/Create';
  private API_GetOrderDetails = 'Sales/FG/GetOrderDetails';
  private API_GetPendingProcessIn = 'Sales/FG/GetPendingProcessIn';
  private API_GetPendingProcessInDetails = 'Sales/FG/GetPendingProcessInDetails';

  constructor(private http: HttpClient) {
  }

  Delete(FGID: number) {

    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID: " + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body = null;

    return this.http.post(this.Baseurl + this.API_Delete + "?FGID=" + FGID, body, { headers });
  }
  Get(model: {
    FGID: number,
    FromDate: Date | null,
    ToDate: Date | null,
    FGNo: string
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
  Create(model: FG_AddModel) {

    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID: " + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    if (model.FGDate)
      model.FGDate = this.normalizeDate(model.FGDate);

    const body = JSON.stringify(model);

    return this.http.post(this.Baseurl + this.API_Create, body, { headers });
  }
  GetOrderDetails(FGID: number) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("FGID", <any>FGID);

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
  GetPendingProcessIns() {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    return this.http.get(this.Baseurl + this.API_GetPendingProcessIn , { headers }).toPromise();

  }
  GetPendingProcessInDetails(ProcessInIDs: string, FGID: number) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("ProcessInIDs", <any>ProcessInIDs);
    queryParameters = queryParameters.set("FGID", <any>FGID);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    return this.http.get(this.Baseurl + this.API_GetPendingProcessInDetails, {
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
