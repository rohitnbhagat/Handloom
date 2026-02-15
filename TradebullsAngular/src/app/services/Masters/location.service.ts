import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { ExhitionMaster_AddModel } from '../../Models/Masters/ExhitionModel';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { CountryMaster_AddModel, StateMaster_AddModel, CityMaster_AddModel } from '../../Models/Masters/LocationModel';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private Baseurl:string = environment.APIUrl;
  private APIKey:string = environment.APIKey;
  private ClientCode:string = environment.ClientCode;

  private API_Country_Get = 'Masters/Location/GetCountry';
  private API_Country_Delete = 'Masters/Location/DeleteCountry';
  private API_Country_Create = 'Masters/Location/CreateCountry';

  private API_State_Get = 'Masters/Location/GetState';
  private API_State_Delete = 'Masters/Location/DeleteState';
  private API_State_Create = 'Masters/Location/CreateState';

  private API_City_Get = 'Masters/Location/GetCity';
  private API_City_Delete = 'Masters/Location/DeleteCity';
  private API_City_Create = 'Masters/Location/CreateCity';

  constructor(private http: HttpClient) { 
  }

  GetCountry(CountryID:number = 0){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("CountryID", <any>CountryID);
      
    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    return this.http.get(this.Baseurl + this.API_Country_Get,{ 
      params: queryParameters,
      headers: headers
    }).toPromise();
  }
  GetState(CountryID:number = 0,StateID:number = 0){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("CountryID", <any>CountryID);
    queryParameters = queryParameters.set("StateID", <any>StateID);
      
    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    return this.http.get(this.Baseurl + this.API_State_Get,{ 
      params: queryParameters,
      headers: headers
    }).toPromise();
  }
  GetCity(CountryID:number = 0,StateID:number = 0,CityID:number = 0){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams( { encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("CountryID", <any>CountryID);
    queryParameters = queryParameters.set("StateID", <any>StateID);
    queryParameters = queryParameters.set("CityID", <any>CityID);
      
    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID:"+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    
    return this.http.get(this.Baseurl + this.API_City_Get,{ 
      params: queryParameters,
      headers: headers
    }).toPromise();
  }

  DeleteCountry(CountryID:number){
    
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=null;
    
    return this.http.post(this.Baseurl + this.API_Country_Delete + "?CountryID="+ CountryID, body,{ headers});
  }
  DeleteState(StateID:number){
    
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=null;
    
    return this.http.post(this.Baseurl + this.API_State_Delete + "?StateID="+ StateID, body,{ headers});
  }
  DeleteCity(CityID:number){
    
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=null;
    
    return this.http.post(this.Baseurl + this.API_City_Delete + "?CityID="+ CityID, body,{ headers});
  }

  CreateCountry(model:CountryMaster_AddModel){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=JSON.stringify(model);
    
    return this.http.post(this.Baseurl + this.API_Country_Create, body,{ headers});
  }
  CreateState(model:StateMaster_AddModel){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=JSON.stringify(model);
    
    return this.http.post(this.Baseurl + this.API_State_Create, body,{ headers});
  }
  CreateCity(model:CityMaster_AddModel){
      
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
    headers = headers.set("XApiKey", this.APIKey);
    
    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body=JSON.stringify(model);
    
    return this.http.post(this.Baseurl + this.API_City_Create, body,{ headers});
  }
}
