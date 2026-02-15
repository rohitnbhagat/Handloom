import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpUrlEncodingCodec } from '../../encoder';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private Baseurl: string = environment.APIUrl;
  private APIKey: string = environment.APIKey;
  private ClientCode: string = environment.ClientCode;

  private API_Get_TaxRate = 'Masters/Product/GetTaxRate';
  private API_Get = 'Masters/Product/Get';
  private API_GetAttribute = 'Masters/Product/GetAttribute';
  private API_GetAttributeValue = 'Masters/Product/GetAttributeValue';

  constructor(private http: HttpClient) { }

  Get(model: {
    ProductID: number,
    ParentProductID: number,
    ProductType: number,
    ProductName: string,
    ProductAttributeIDs: string,
    ProductAttributeValueIDs: string,
    ProductIDs: string
  }) {

    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID: " + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    const body = JSON.stringify(model);

    return this.http.post(this.Baseurl + this.API_Get, body, { headers }).toPromise();
  }

  GetAttribute(ProductID: number = 0, ProductAttributeID: number = 0) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("ProductID", <any>ProductID);
    queryParameters = queryParameters.set("ProductAttributeID", <any>ProductAttributeID);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    return this.http.get(this.Baseurl + this.API_GetAttribute, {
      params: queryParameters,
      headers: headers
    }).toPromise();
  }

  GetAttributeValue(ProductID: number = 0, ProductAttributeID: number = 0, ProductAttributeValueID: number = 0) {
    let userSession: any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    queryParameters = queryParameters.set("ProductID", <any>ProductID);
    queryParameters = queryParameters.set("ProductAttributeID", <any>ProductAttributeID);
    queryParameters = queryParameters.set("ProductAttributeValueID", <any>ProductAttributeValueID);

    let headers = new HttpHeaders();
    headers = headers.set("Context", "{ ClientCode: '" + this.ClientCode + "', UserID:" + context.data.UserID + " }");
    headers = headers.set("XApiKey", this.APIKey);

    headers = headers.set('content-type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");

    return this.http.get(this.Baseurl + this.API_GetAttributeValue, {
      params: queryParameters,
      headers: headers
    }).toPromise();
  }

  GetTaxRate(model:{CountryID: number, StateID: number, ProductIDs: string}){
        
      let userSession:any = localStorage.getItem("userSession");
      let context = JSON.parse(<string>userSession);
  
      let headers = new HttpHeaders();
      headers = headers.set("Context","{ ClientCode: '"+ this.ClientCode +"', UserID: "+ context.data.UserID +" }");
      headers = headers.set("XApiKey", this.APIKey);
      
      headers = headers.set('content-type', 'application/json')
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  
      const body=JSON.stringify(model);
      
      return this.http.post(this.Baseurl + this.API_Get_TaxRate, body,{ headers}).toPromise();
    }
}
