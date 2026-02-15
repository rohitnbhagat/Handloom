import { Stock_Used_ViewModel } from "./StockModel";

export class GDN_AddModel {
    GDNID?:number;
    VoucherType?:string;
    GDNNo?:string;
    GDNDate?:Date;
    BrandID?:number;
    PartyID?:number;
    ConsigneeID?:number;
    AgentID?:number;
    PONo?:string;
    PODate?:Date | null;
    DeliveryDate?:Date | null;
    SalesLocationID?:number;
    Priority?:string;
    DueDays?:number;
    Remarks?:string;
    TotalQty?:number;
    GrossTotal?:number;
    TotalTax?:number;
    TotalAmount?:number;
    Items:GDN_Item_AddModel[] = [];
    Taxes: GDN_Tax_AddModel [] = [];

    Billing_FirstName?: string;
    Billing_LastName?: string;
    Billing_Company?: string;
    Billing_Address1?: string;
    Billing_Address2?: string;
    Billing_Postcode?: string;
    Billing_EmailID?: string;
    Billing_PhoneNo?: string;
    Billing_CountryID?: number;
    Billing_StateID?: number;
    Billing_CityID?: number;
    Billing_Country?: string;
    Billing_State?: string;
    Billing_City?: string;

    Shipping_FirstName?: string;
    Shipping_LastName?: string;
    Shipping_Company?: string;
    Shipping_Address1?: string;
    Shipping_Address2?: string;
    Shipping_Postcode?: string;
    Shipping_EmailID?: string;
    Shipping_PhoneNo?: string;
    Shipping_CountryID?: number;
    Shipping_StateID?: number;
    Shipping_CityID?: number;
    Shipping_Country?: string;
    Shipping_State?: string;
    Shipping_City?: string;

    ExhibitionID?: number;
    CreditTypeID?: number;
    Status?: string;
}

export class GDN_Item_AddModel {
    ID?:number;
    SalesOrderItemID?:number;
    SrNo?:number;
    ParentProductID?:number;
    ProductID?:number;
    AttributeValues:{ProductAttributeID: number, ProductAttributeValueID: number} [] = [];
    Qty?:number;
    Price?:number;
    TotalAmount?:number;
    HSNCodeID?:number;
    Remarks?:string;
    Taxes: {TaxRateID:number,TaxClassID:number, name:string, rate:number, Amount:number} [] = [];
    Stock: Stock_Used_ViewModel[] = []
}

export class GDN_Item{
    ID: number = 0;
    SalesOrderItemID: number = 0;
    SalesOrderNo?: string;
    SalesOrderDate?: Date;
    SrNo: number = 0;
    ParentProductID: number = 0;
    ProductID: number = 0;
    sku?: string;
    ProductName?: string;
    AttributeValues: {
      ProductAttributeID: number,
      ProductAttributeValueID: number,
      Name: string,
      Option: string
    }[] = [];
    Qty: number = 0;
    Price: number = 0;
    TotalAmount: number = 0;
    TotalTaxAmount: number = 0;
    FinalAmount: number = 0;
    HSNCodeID?: number;
    HSNCodeName?: string;
    Remarks?: string;
    Photo?: string;
    Taxes: {
      TaxRateID: number,
      TaxClassID: number,
      name: string,
      rate: number,
      Amount: number
    }[] = [];
    Stock: Stock_Used_ViewModel[] = []
}

export class GDN_Tax_AddModel {
  TaxRateID?:number;
  TaxClassID?:number;
  name?:string;
  rate?:number; 
  Amount?:number;
}