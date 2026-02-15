import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { ExhitionService } from '../../../services/Masters/exhition.service';
import { CreditTypeService } from '../../../services/Masters/creditType.service';
import { BrandService } from '../../../services/Masters/brand.service';
import { PartyService } from '../../../services/Masters/party.service';
import { SalesLocationService } from '../../../services/Masters/salesLocation.service';
import { ProductService } from '../../../services/Masters/product.service';
import { SalesAddProductComponent } from '../../SalesOrder/sales-add-product/sales-add-product.component';
import { GDN_AddModel, GDN_Item_AddModel, GDN_Tax_AddModel, GDN_Item } from '../../../Models/Sales/GDNModel';
import { GDNService } from '../../../services/Sales/gdn.service';
import { SalesAddAddressComponent } from '../../SalesOrder/sales-add-address/sales-add-address.component';
import { PartyAddress_ViewModel } from '../../../Models/Masters/PartyModel';
import { MatSelectChange } from '@angular/material/select';
import { Editor, Toolbar } from 'ngx-editor';
import { HSNCodeService } from '../../../services/Masters/hSNCode.service';
import { BarcodeScannerComponent } from '../../../barcode-scanner/barcode-scanner.component';
import { PartyAddComponent } from '../../../Masters/Party/party-add/party-add.component';
import { Stock_Used_ViewModel, Stock_FilterModel, Stock_ViewModel, Stock_View_response_Model } from '../../../Models/Sales/StockModel';
import { StockService } from '../../../services/Sales/stock.service';

@Component({
  selector: 'app-gdn-add',
  templateUrl: './gdn-add.component.html',
  styleUrl: './gdn-add.component.css'
})
export class GdnAddComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("partycomp") partycomp?: PartyAddComponent;
  @ViewChild("consigneecomp") consigneecomp?: PartyAddComponent;
  @ViewChild("agentcomp") agentcomp?: PartyAddComponent;

  IsPicVisible: boolean = true;
  strSOProductFilter: string = "";
  strSOFilter: string = "";

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  IsOpenSaveOrder: boolean = false;
  IsOpenSaveOrderItem: boolean = false;
  lstSalesOrder: any[] = [];
  IsDropdownEventCall: boolean = true;
  IsAddNew: boolean = false;
  GDNID: number = 0;
  
  VoucherNo: string = "";
  VoucherType: string = "local";
  VoucherDate: Date | null = new Date();
  
  BrandID: number = 0;
  PartyID: number = 0;
  ConsigneeID: number = 0;
  AgentID: number = 0;
  SalesLocationID: number = 0;
  Priority: string = "Low";
  PONo: string = "";
  PODate: Date | null = null;
  DeliveryDate: Date | null = null;
  DeliveryDueDays: number | null = null;
  Remarks: string = "";
  ProductDetails: GDN_Item[] = [];
  Taxes: GDN_Tax_AddModel[] = [];
  TotalQty: number = 0;
  GrossTotal: number = 0;
  TotalTax: number = 0;
  TotalAmount: number = 0;
  IsOnline: boolean = false;
  ExhibitionID: number = 0;
  CreditTypeID: number = 0;
  Status: string = "";

  @Output() BackEvent = new EventEmitter<void>();
  @ViewChild("CntProduct") CntProduct?: SalesAddProductComponent;
  @ViewChild("BillingAddress") BillingAddress?: SalesAddAddressComponent;
  @ViewChild("ShippingAddress") ShippingAddress?: SalesAddAddressComponent;
  @ViewChild("scanner") barcodeScannerComponent?: BarcodeScannerComponent;

  lstBrands: any[] = [];
  lstPartys: any[] = [];
  lstConsignees: any[] = [];
  lstAgents: any[] = [];
  lstSalesLocations: any[] = [];
  lstPriority: any[] = [];
  lstExhibition: any[] = [];
  lstCreditType: any[] = [];
  lstStatus: any[] = [];
  lstSelectedSalesOrder: { SalesOrderID: number, SalesOrderNo: string, SalesOrderDate: Date }[] = [];
  lstSelectedSalesOrderDetails: { Select: boolean, Data: GDN_Item }[] = [];
  lstHSNCode: any[] = [];

  constructor(private toastr: ToastrService,
    private brandService: BrandService,
    private partyService: PartyService,
    private salesLocationService: SalesLocationService,
    private gdnService: GDNService,
    private productService: ProductService,
    private exhitionService: ExhitionService,
    private creditTypeService: CreditTypeService,
    private hSNCodeService: HSNCodeService,
    private stockService: StockService
  ) {

  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  ngAfterViewInit(): void {
    this.FillHSNCode();
  }


  ngOnInit(): void {
    this.editor = new Editor();
    this.FillBrand();
    this.FillExhition();
    this.FillCreditType();
    this.FillParty();
    this.FillConsignee();
    this.FillAgent();
    this.FillPriority();
    this.FillStatus();
    this.FillSalesLocation();
  }

  GetHeaderText() {
    let s = "Create GDN (Challan)";
    if (this.GDNID > 0 && this.IsOnline)
      s = "View GDN (Challan)";
    else if (this.GDNID > 0 && !this.IsOnline)
      s = "Edit GDN (Challan)";
    return s;;
  }

  FillHSNCode() {
    this.hSNCodeService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstHSNCode = a.map((prod) => ({
          value: prod.HSNCodeID,
          label: prod.HSNCodeName,
          data: prod,
        }));

        this.lstHSNCode.unshift({
          value: 0,
          label: "Please Select",
          data: { HSNCodeID: 0, HSNCodeName: "Please Select" },
        });

      }

    });
  }

  async OpenGDN(gdnid: number) {
    this.IsAddNew = true;
    this.GDNID = gdnid;
    if (gdnid > 0) {
      const model: {
        GDNID: number,
        FromDate: Date | null,
        ToDate: Date | null,
        GDNNo: string,
        BrandID: number,
        PartyID: number,
        ConsigneeID: Number,
        AgentID: Number,
        SalesLocationID: Number,
        Priority: string,
        Status: string,
        ExhibitionID: Number,
        CreditTypeID: Number
      } = {
        GDNID: this.GDNID,
        FromDate: null,
        ToDate: null,
        GDNNo: "",
        BrandID: 0,
        PartyID: 0,
        ConsigneeID: 0,
        AgentID: 0,
        SalesLocationID: 0,
        Priority: "",
        Status: "",
        ExhibitionID: 0,
        CreditTypeID: 0
      };

      await this.gdnService.Get(model).then(
        (response: any) => {

          if (!response.success) {
            this.toastr.error(response.message, '', {
              enableHtml: true,
              closeButton: true
            });
          }
          else {
            const order = response.data[0];
            if (order) {
              this.VoucherType = order.VoucherType ?? "Local";
              this.VoucherNo = order.GDNNo;
              this.VoucherDate = order.GDNDate;
              this.BrandID = order.BrandID;
              this.PartyID = order.PartyID;
              this.ConsigneeID = order.ConsigneeID;
              this.AgentID = order.AgentID;
              this.SalesLocationID = order.SalesLocationID;
              this.Priority = order.Priority;
              this.PONo = order.PONo;
              this.PODate = order.PODate;
              this.DeliveryDate = order.DeliveryDate;
              this.DeliveryDueDays = order.DueDays;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.GrossTotal = order.GrossTotal;
              this.TotalTax = order.TotalTax;
              this.TotalAmount = order.TotalAmount;
              this.IsOnline = order.IsOnline;
              this.ExhibitionID = order.ExhibitionID;
              this.CreditTypeID = order.CreditTypeID;
              this.Status = order.Status;
              this.ProductDetails = [];

              const billingAddress = {
                FirstName: order.Billing_first_name,
                LastName: order.Billing_last_name,
                Address1: order.Billing_address_1,
                Address2: order.Billing_address_2,
                CountryID: order.Billing_CountryID,
                StateID: order.Billing_StateID,
                CityID: order.Billing_CityID,
                CountryName: order.Billing_country,
                StateName: order.Billing_state,
                CityName: order.Billing_city,
                Postcode: order.Billing_postcode,
                EmailID: order.Billing_email,
                PhoneNo: order.Billing_phone
              }
              this.BillingAddress?.FillAddressData(billingAddress);

              const shippingAddress = {
                FirstName: order.Shipping_first_name,
                LastName: order.Shipping_last_name,
                Address1: order.Shipping_address_1,
                Address2: order.Shipping_address_2,
                CountryID: order.Shipping_CountryID,
                StateID: order.Shipping_StateID,
                CityID: order.Shipping_CityID,
                CountryName: order.Shipping_country,
                StateName: order.Shipping_state,
                CityName: order.Shipping_city,
                Postcode: order.Shipping_postcode,
                EmailID: order.Shipping_email,
                PhoneNo: order.Shipping_phone
              }
              this.ShippingAddress?.FillAddressData(shippingAddress);

              this.gdnService.GetOrderDetails(this.GDNID).then(
                (responseDetail: any) => {
                  if (!responseDetail.success) {
                    this.toastr.error(response.message, '', {
                      enableHtml: true,
                      closeButton: true
                    });
                  }
                  else {
                    this.ProductDetails = responseDetail.data.map(
                      (t: any) => (
                        {
                          ID: t.ID,
                          SalesOrderItemID: t.SalesOrderItemID,
                          SalesOrderNo: t.SalesOrderNo,
                          SrNo: t.SrNo,
                          ParentProductID: t.ParentProductID,
                          ProductID: t.ProductID,
                          sku: t.sku,
                          ProductName: t.ProductName,
                          AttributeValues: t.AttributeValues.map((m: any) => ({
                            ProductAttributeID: m.ProductAttributeID,
                            ProductAttributeValueID: m.ProductAttributeValueID,
                            Name: m.name,
                            Option: m.option
                          })),
                          Qty: t.Qty,
                          Price: t.Price,
                          TotalAmount: t.Subtotal,
                          TotalTaxAmount: t.Total_tax,
                          FinalAmount: t.Total,
                          HSNCodeID: t.HSNCodeID,
                          HSNCodeName: t.HSNCodeName,
                          Remarks: t.Remarks,
                          Photo: t.Photo,
                          Taxes: t.Taxes ? t.Taxes.map((m: any) => ({
                            TaxRateID: m.TaxRateID,
                            TaxClassID: m.TaxClassID,
                            name: m.TaxName,
                            rate: m.Rate,
                            Amount: m.Total
                          })) : [],
                          Stock: t.Stock ? t.Stock : []
                        }
                      )
                    );

                    this.Taxes = responseDetail.Taxes.map((m: any) => (
                      {
                        TaxRateID: m.TaxRateID,
                        TaxClassID: m.TaxClassID,
                        name: m.TaxName,
                        rate: m.Rate,
                        Amount: m.Total
                      }
                    ));

                    this.lstSelectedSalesOrder = responseDetail.SalesOrder.map((m: any) => (
                      {
                        SalesOrderID: m.SalesOrderID,
                        SalesOrderNo: m.SalesOrderNo,
                        SalesOrderDate: m.SalesOrderDate
                      }
                    ));

                  }
                }
              );

            }
          }

        });
    }
    else {
      this.ClearForm();
    }
  }

  BackClick() {
    if(confirm('Are you sure you want to go back?'))
    {
      this.IsAddNew = false;
      this.BackEvent.emit();
    }
  }

  FillCreditType() {
    this.creditTypeService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstCreditType = a.map((brand) => ({
          value: brand.CreditTypeID,
          label: brand.CreditTypeName,
          data: brand,
        }));

        this.lstCreditType.unshift({
          value: 0,
          label: "Please Select",
          data: { CreditTypeID: 0, CreditTypeName: "Please Select" },
        });

      }

    });
  }

  FillExhition() {
    this.exhitionService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstExhibition = a.map((brand) => ({
          value: brand.ExhitionID,
          label: brand.ExhitionName,
          data: brand,
        }));

        this.lstExhibition.unshift({
          value: 0,
          label: "Please Select",
          data: { ExhitionID: 0, ExhitionName: "Please Select" },
        });

      }

    });
  }

  FillBrand() {
    this.brandService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstBrands = a.map((brand) => ({
          value: brand.BrandID,
          label: brand.BrandName,
          data: brand,
        }));

        this.lstBrands.unshift({
          value: 0,
          label: "Please Select",
          data: { BrandID: 0, BrandName: "Please Select" },
        });

      }

    });
  }

  FillParty() {
    this.partyService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstPartys = a.filter(t => t.PartyTypeID == 1).map((party) => ({
          value: party.PartyID,
          label: party.PartyName,
          data: party,
        }));

        this.lstPartys.unshift({
          value: 0,
          label: "Please Select",
          data: { PartyID: 0, PartyName: "Please Select" },
        });

      }

    });
  }

  FillConsignee() {
    this.partyService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstConsignees = a.filter(t => t.PartyTypeID == 2 || t.PartyTypeID == 1).map((party) => ({
          value: party.PartyID,
          label: party.PartyName,
          data: party,
        }));

        this.lstConsignees.unshift({
          value: 0,
          label: "Please Select",
          data: { PartyID: 0, PartyName: "Please Select" },
        });

      }

    });
  }

  FillAgent() {
    this.partyService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstAgents = a.filter(t => t.PartyTypeID == 5).map((party) => ({
          value: party.PartyID,
          label: party.PartyName,
          data: party,
        }));

        this.lstAgents.unshift({
          value: 0,
          label: "Please Select",
          data: { PartyID: 0, PartyName: "Please Select" },
        });

      }

    });
  }

  FillPriority() {
    this.lstPriority = [];
    this.lstPriority.push({
      value: "Low",
      label: "Low",
      data: { ID: "Low", Name: "Low" },
    });
    this.lstPriority.push({
      value: "Medium",
      label: "Medium",
      data: { ID: "Medium", Name: "Medium" },
    });
    this.lstPriority.push({
      value: "High",
      label: "High",
      data: { ID: "High", Name: "High" },
    });

  }

  FillStatus() {
    this.lstStatus = [];
    this.lstStatus.push({
      value: "",
      label: "NA",
      data: { ID: "", Name: "NA" },
    });
    this.lstStatus.push({
      value: "pending",
      label: "Pending payment",
      data: { ID: "pending", Name: "Pending payment" },
    });
    this.lstStatus.push({
      value: "processing",
      label: "Processing",
      data: { ID: "processing", Name: "Processing" },
    });
    this.lstStatus.push({
      value: "on-hold",
      label: "On hold",
      data: { ID: "on-hold", Name: "On hold" },
    });
    this.lstStatus.push({
      value: "completed",
      label: "Completed",
      data: { ID: "completed", Name: "Completed" },
    });
    this.lstStatus.push({
      value: "cancelled",
      label: "Cancelled",
      data: { ID: "cancelled", Name: "Cancelled" },
    });
    this.lstStatus.push({
      value: "refunded",
      label: "Refunded",
      data: { ID: "refunded", Name: "Refunded" },
    });
    this.lstStatus.push({
      value: "failed",
      label: "Failed",
      data: { ID: "failed", Name: "Failed" },
    });
    this.lstStatus.push({
      value: "partial-shipped",
      label: "Partially Shipped",
      data: { ID: "partial-shipped", Name: "Partially Shipped" },
    });
    this.lstStatus.push({
      value: "checkout-draft",
      label: "Draft",
      data: { ID: "checkout-draft", Name: "Draft" },
    });
  }


  FillSalesLocation() {
    this.salesLocationService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstSalesLocations = a.map((SL) => ({
          value: SL.SalesLocationID,
          label: SL.SalesLocationName,
          data: SL,
        }));

        this.lstSalesLocations.unshift({
          value: 0,
          label: "Please Select",
          data: { SalesLocationID: 0, SalesLocationName: "Please Select" },
        });

      }

    });
  }

  OpenProduct(product: any) {
    this.CntProduct?.OpenProduct(product, this.BrandID, this.GDNID, "GDN");
  }

  AddeditProductSave(product: any) {
    console.log(product);
    if (product) {
      if (product.SrNo == 0) {
        const maxSrNo = Math.max(...this.ProductDetails.map(product => product.SrNo));
        product.SrNo = (this.ProductDetails.length == 0) ? 1 : maxSrNo + 1;

        let p: GDN_Item =
        {
          ID: product.ID,
          SalesOrderItemID: 0,
          SalesOrderNo: "",
          SrNo: product.SrNo,
          ParentProductID: product.ParentProductID,
          ProductID: product.ProductID,
          sku: product.sku,
          ProductName: product.ProductName,
          AttributeValues: product.AttributeValues,
          Qty: product.Qty,
          Price: product.Price,
          TotalAmount: product.TotalAmount,
          TotalTaxAmount: 0,
          FinalAmount: 0,
          HSNCodeID: product.HSNCodeID,
          HSNCodeName: product.HSNCodeName,
          Remarks: product.Remarks,
          Photo: product.Photo,
          Taxes: [],
          Stock: product.Stock
        }
        const shippingAddress = this.BillingAddress?.GetAddressData();
        this.productService.GetTaxRate({ CountryID: shippingAddress.CountryID, StateID: shippingAddress.StateID, ProductIDs: String(product.ProductID) }).then(
          (res: any) => {
            if (res.success) {
              p.Taxes = res.data.map((element: any) => (
                {
                  TaxRateID: element.TaxRateID,
                  TaxClassID: element.TaxClassID,
                  name: element.name,
                  rate: element.rate,
                  Amount: (product.TotalAmount * element.rate) / 100
                }
              ));
            }
          }
        ).finally(
          () => {
            const totalTaxAmount = p.Taxes.reduce((sum, element) => sum + element.Amount, 0);
            p.TotalTaxAmount = Number(totalTaxAmount.toFixed(2));
            p.FinalAmount = Number((p.TotalAmount + p.TotalTaxAmount).toFixed(2));
            this.ProductDetails.push(p);
            this.RefreshTaxDetails();
            this.CalculateAmount();
          }
        );


      }
      else {
        this.ProductDetails.forEach(p => {
          if (p.SrNo == product.SrNo) {
            p.ID = product.ID;
            p.SrNo = product.SrNo;
            p.ParentProductID = product.ParentProductID;
            p.ProductID = product.ProductID;
            p.sku = product.sku;
            p.ProductName = product.ProductName;
            p.AttributeValues = product.AttributeValues;
            p.Qty = product.Qty;
            p.Price = product.Price;
            p.TotalAmount = product.TotalAmount;
            p.HSNCodeID = product.HSNCodeID;
            p.HSNCodeName = product.HSNCodeName;
            p.Remarks = product.Remarks;
            p.Photo = product.Photo;
            p.Taxes = [];
            p.Stock = product.Stock;

            const shippingAddress = this.BillingAddress?.GetAddressData();
            this.productService.GetTaxRate({ CountryID: shippingAddress.CountryID, StateID: shippingAddress.StateID, ProductIDs: String(product.ProductID) }).then(
              (res: any) => {
                if (res.success) {
                  p.Taxes = res.data.map((element: any) => (
                    {
                      TaxRateID: element.TaxRateID,
                      TaxClassID: element.TaxClassID,
                      name: element.name,
                      rate: element.rate,
                      Amount: (product.TotalAmount * element.rate) / 100
                    }
                  ));
                }
              }
            ).finally(
              () => {
                const totalTaxAmount = p.Taxes.reduce((sum, element) => sum + element.Amount, 0);
                p.TotalTaxAmount = Number(totalTaxAmount.toFixed(2));
                p.FinalAmount = Number((p.TotalAmount + p.TotalTaxAmount).toFixed(2));
                this.RefreshTaxDetails();
                this.CalculateAmount();
              }
            );

          }
        });
      }
    }
  }

   FillTax(){
    this.ProductDetails.forEach(p => {
        p.Taxes = [];

        const shippingAddress = this.BillingAddress?.GetAddressData();
        this.productService.GetTaxRate({ CountryID: shippingAddress.CountryID, StateID: shippingAddress.StateID, ProductIDs: String(p.ProductID) }).then(
          (res: any) => {
            if (res.success) {
              p.Taxes = res.data.map((element: any) => (
                {
                  TaxRateID: element.TaxRateID,
                  TaxClassID: element.TaxClassID,
                  name: element.name,
                  rate: element.rate,
                  Amount: (p.TotalAmount * element.rate) / 100
                }
              ));
            }
          }
        ).finally(
          () => {
            const totalTaxAmount = p.Taxes.reduce((sum, element) => sum + element.Amount, 0);
            p.TotalTaxAmount = Number(totalTaxAmount.toFixed(2));
            p.FinalAmount = Number((p.TotalAmount + p.TotalTaxAmount).toFixed(2));
            this.RefreshTaxDetails();
            this.CalculateAmount();
          }
        );

    });
  }

  DeleteProduct(product: any) {
    this.ProductDetails = this.ProductDetails.filter(t => t.SrNo != product.SrNo);
    this.ProductDetails.forEach((product, index) => { product.SrNo = index + 1 });
    this.RefreshTaxDetails();
    this.CalculateAmount();
  }

  SaveClick() {
    if (!this.FormValidate())
      return;

    const Items: GDN_Item_AddModel[] = this.ProductDetails.map(t => (
      {
        ID: t.ID,
        SalesOrderItemID: t.SalesOrderItemID,
        SrNo: t.SrNo,
        ParentProductID: t.ParentProductID,
        ProductID: t.ProductID,
        AttributeValues: t.AttributeValues.map(m => ({ ProductAttributeID: m.ProductAttributeID, ProductAttributeValueID: m.ProductAttributeValueID })),
        Taxes: t.Taxes.map(m => (
          { TaxRateID: m.TaxRateID, TaxClassID: m.TaxClassID, name: m.name, rate: m.rate, Amount: m.Amount }
        )),
        Qty: t.Qty,
        Price: t.Price,
        TotalAmount: t.TotalAmount,
        TotalTaxAmount: t.TotalTaxAmount,
        FinalAmount: t.FinalAmount,
        HSNCodeID: t.HSNCodeID,
        Remarks: t.Remarks,
        Stock: t.Stock
      }
    ));

    this.RefreshTaxDetails();
    this.CalculateAmount();

    const billingAddress = this.BillingAddress?.GetAddressData();
    const shippingAddress = this.ShippingAddress?.GetAddressData();

    let model: GDN_AddModel = {
      GDNID: this.GDNID ?? 0,
      VoucherType: this.VoucherType ?? "Local",
      GDNNo: this.VoucherNo ?? "",
      GDNDate: this.VoucherDate ? this.VoucherDate : new Date(),
      BrandID: this.BrandID ?? 0,
      PartyID: this.PartyID ?? 0,
      ConsigneeID: this.ConsigneeID ?? 0,
      AgentID: this.AgentID ?? 0,
      PONo: this.PONo ?? "",
      PODate: this.PODate,
      DeliveryDate: this.DeliveryDate,
      SalesLocationID: this.SalesLocationID ?? 0,
      Priority: this.Priority ?? "",
      DueDays: this.DeliveryDueDays ? Number(this.DeliveryDueDays) : 0,
      Remarks: this.Remarks ?? "",
      TotalQty: this.TotalQty ?? 0,
      GrossTotal: this.GrossTotal ?? 0,
      TotalTax: this.TotalTax ?? 0,
      TotalAmount: this.TotalAmount ?? 0,
      ExhibitionID: this.ExhibitionID ?? 0,
      CreditTypeID: this.CreditTypeID ?? 0,
      Status: this.Status ?? "",
      Items: Items,
      Taxes: this.Taxes,

      Billing_FirstName: billingAddress.FirstName,
      Billing_LastName: billingAddress.LastName,
      Billing_Company: "",
      Billing_Address1: billingAddress.Address1,
      Billing_Address2: billingAddress.Address2,
      Billing_Postcode: billingAddress.Postcode,
      Billing_EmailID: billingAddress.EmailID,
      Billing_PhoneNo: billingAddress.PhoneNo,
      Billing_CountryID: billingAddress.CountryID,
      Billing_StateID: billingAddress.StateID,
      Billing_CityID: billingAddress.CityID,
      Billing_Country: (billingAddress.CountryID == 0) ? "" : billingAddress.CountryName,
      Billing_State: (billingAddress.StateID == 0) ? "" : billingAddress.StateName,
      Billing_City: (billingAddress.CityID == 0) ? "" : billingAddress.CityName,

      Shipping_FirstName: shippingAddress.FirstName,
      Shipping_LastName: shippingAddress.LastName,
      Shipping_Company: "",
      Shipping_Address1: shippingAddress.Address1,
      Shipping_Address2: shippingAddress.Address2,
      Shipping_Postcode: shippingAddress.Postcode,
      Shipping_EmailID: shippingAddress.EmailID,
      Shipping_PhoneNo: shippingAddress.PhoneNo,
      Shipping_CountryID: shippingAddress.CountryID,
      Shipping_StateID: shippingAddress.StateID,
      Shipping_CityID: shippingAddress.CityID,
      Shipping_Country: (shippingAddress.CountryID == 0) ? "" : shippingAddress.CountryName,
      Shipping_State: (shippingAddress.StateID == 0) ? "" : shippingAddress.StateName,
      Shipping_City: (shippingAddress.CityID == 0) ? "" : shippingAddress.CityName
    };

    this.gdnService.Create(model).subscribe(
      data => {
        console.log(data);
        let d: any = data;
        if (!d.success) {
          this.toastr.error(d.message, '', { enableHtml: true, closeButton: true });
        }
        else {
          this.toastr.success(d.message, '', { enableHtml: true, closeButton: true });
          this.ClearForm();
        }
      },
      error => {
        console.log(error);
        this.toastr.error(error.error.message, '');
      }
    );


  }
  PartyDropdownSelectionChange(event: MatSelectChange) {
    this.ConsigneeID = event.value;
    this.FillConsigneeAddress();
  }
  ConsigneeDropdownSelectionChange(event: MatSelectChange) {
    this.FillConsigneeAddress();
  }
  ClearForm() {

    this.GDNID = 0;
    this.VoucherType = "Local";
    this.VoucherNo = "";
    this.VoucherDate = new Date();
    this.BrandID = 0;
    this.PartyID = 0;
    this.ConsigneeID = 0;
    this.AgentID = 0;
    this.SalesLocationID = 0;
    this.Priority = "Low";
    this.Status = "";
    this.PONo = "";
    this.PODate = null;
    this.DeliveryDate = null;
    this.DeliveryDueDays = null;
    this.Remarks = "";
    this.ProductDetails = [];
    this.BillingAddress?.FormClear();
    this.ShippingAddress?.FormClear();
    this.Taxes = [];
    this.TotalQty = 0;
    this.GrossTotal = 0;
    this.TotalTax = 0;
    this.TotalAmount = 0;
    this.IsOnline = false;
    this.ExhibitionID = 0;
    this.CreditTypeID = 0;
    this.lstSelectedSalesOrder = [];
    this.lstSelectedSalesOrderDetails = [];
  }

  async FillConsigneeAddress() {
    if (this.BillingAddress && this.ShippingAddress) {
      let isBilling: boolean = false;
      let isShipping: boolean = false;
      const blankmodel = {
        FirstName: "",
        LastName: "",
        Address1: "",
        Address2: "",
        CountryID: 0,
        StateID: 0,
        CityID: 0,
        CountryName: "",
        StateName: "",
        CityName: "",
        Postcode: "",
        EmailID: "",
        PhoneNo: ""
      };

      await this.partyService.GetAddress(this.ConsigneeID).subscribe(
        data => {
          let s: any = data;
          let PartyAddress: PartyAddress_ViewModel[] = s.data;

          PartyAddress.forEach((t: PartyAddress_ViewModel) => {
            const model = {
              FirstName: t.FirstName ?? "",
              LastName: t.LastName ?? "",
              Address1: t.Address1 ?? "",
              Address2: t.Address2 ?? "",
              CountryID: t.CountryID ?? 0,
              StateID: t.StateID ?? 0,
              CityID: t.CityID ?? 0,
              CountryName: t.CountryName ?? "",
              StateName: t.StateName ?? "",
              CityName: t.CityName ?? "",
              Postcode: t.Postcode ?? "",
              EmailID: t.EmailID ?? "",
              PhoneNo: t.PhoneNo ?? ""
            };
            if (t.AddressTypeID == 1) {
              this.BillingAddress?.FillAddressData(model);
              isBilling = true;
            }
            else if (t.AddressTypeID == 2) {
              this.ShippingAddress?.FillAddressData(model);
              isShipping = true;
            }

          });

        }
      );
      if (!isBilling)
        this.BillingAddress?.FillAddressData(blankmodel);
      if (!isShipping)
        this.ShippingAddress?.FillAddressData(blankmodel);
    }
  }
  onSelectionChange(event: MatSelectChange): void {
    console.log('Selection changed:', event);
    console.log('Selected fruit:', event.value);  // event.value will give the selected value
  }

  IsDisplayTax: boolean = false;
  TaxDetail: any;
  ShowTaxDetails(item: any) {
    this.TaxDetail = item;
    this.IsDisplayTax = true;
  }
  CloseTaxModel() {
    this.IsDisplayTax = false;
    this.TaxDetail = null;
  }

  RefreshTaxDetails() {
    if (this.ProductDetails) {
      let lstTaxes: { TaxRateID: number, TaxClassID: number, name: string, rate: number, Amount: number }[] = [];
      this.ProductDetails.forEach(product => {
        if (product.Taxes) {
          product.Taxes.forEach(tax => {
            lstTaxes.push(
              { TaxRateID: tax.TaxRateID, TaxClassID: tax.TaxClassID, name: tax.name, rate: tax.rate, Amount: tax.Amount }
            );
          });
        }
      });

      const groupedMap = new Map<string, { TaxRateID: number, TaxClassID: number, name: string, rate: number, Amount: number }>();
      lstTaxes.forEach(item => {
        // Create a unique key based on the grouping fields
        const key = `${item.TaxRateID}-${item.TaxClassID}-${item.name}-${item.rate}`;

        if (groupedMap.has(key)) {
          // If key exists, add to the existing Amount
          let existing = groupedMap.get(key);
          if (existing)
            existing.Amount += item.Amount;
        } else {
          // Otherwise, create a new entry with the current item
          groupedMap.set(key, {
            TaxRateID: item.TaxRateID,
            TaxClassID: item.TaxClassID,
            name: item.name,
            rate: item.rate,
            Amount: item.Amount
          });
        }
      });

      // Convert the Map to an array
      this.Taxes = Array.from(groupedMap.values());

    }
    else {
      this.Taxes = [];
    }
  }

  CalculateAmount() {
    const qty = this.ProductDetails.reduce((sum, element) => sum + element.Qty, 0);
    const grossAmount = this.ProductDetails.reduce((sum, element) => sum + element.TotalAmount, 0);
    const totalTaxAmount = this.Taxes.reduce((sum, element) => sum + (element.Amount ?? 0), 0);
    this.TotalQty = Number(qty.toFixed(2));
    this.GrossTotal = Number(grossAmount.toFixed(2));
    this.TotalTax = Number(totalTaxAmount.toFixed(2));
    this.TotalAmount = Number((this.GrossTotal + this.TotalTax).toFixed(2));
  }

  FormValidate(): boolean {
    let result: boolean = true;
    let msg: string = "";
    if (!this.VoucherDate) {
      result = false;
      msg += "Please select voucher date." + "<br/>"
    }
    if (!this.BrandID) {
      result = false;
      msg += "Please select brand." + "<br/>"
    }
    if (!this.PartyID) {
      result = false;
      msg += "Please select party." + "<br/>"
    }
    if (!this.ConsigneeID) {
      result = false;
      msg += "Please select consignee." + "<br/>"
    }
    if (!this.PONo) {
      result = false;
      msg += "Please enter PO No." + "<br/>"
    }
    if (!this.PODate) {
      result = false;
      msg += "Please enter PO Date." + "<br/>"
    }
    if (!this.SalesLocationID) {
      result = false;
      msg += "Please select sales location." + "<br/>"
    }
    if (this.VoucherDate && this.PODate) {
      const v = new Date(this.VoucherDate);
      if(new Date(v.getFullYear(),v.getMonth(), v.getDate()) < this.PODate)
      {
        result = false;
        msg += "PO Date should not be greater then Voucher Date." + "<br/>"
      }
    }
    if (!this.ProductDetails || this.ProductDetails.length == 0) {
      result = false;
      msg += "Please enter product details." + "<br/>"
    }
    const billingAddress = this.BillingAddress?.GetAddressData();
    if(!billingAddress)
    {
       result = false;
        msg += "Please enter billing address." + "<br/>"
    }
    if(billingAddress && !billingAddress.CountryID)
    {
        result = false;
        msg += "Please select billing address - country." + "<br/>"
    }
    if(billingAddress && !billingAddress.StateID)
    {
        result = false;
        msg += "Please select billing address - state." + "<br/>"
    }
    if(this.ProductDetails){
      let totalQty: number = 0;
      let stockqty: number = 0;
      this.ProductDetails.forEach( p => {
        totalQty = 0;
        stockqty = 0;

        totalQty = p.Qty;
        if(p.Stock && p.Stock.length > 0){
          p.Stock.forEach(
            s=> {
              stockqty = stockqty + s.Qty;
            }
          );
        }

        if (stockqty == 0){
          result = false;
          msg += "Please select stock for product - "+ p.ProductName +" ." + "<br/>"
        }
        else if (totalQty > stockqty){
          result = false;
          msg += "Stock qty should not be less then order qty for product - "+ p.ProductName +" ." + "<br/>"
        }
        else if (totalQty < stockqty){
          result = false;
          msg += "order qty should not be less then Stock qty for product - "+ p.ProductName +" ." + "<br/>"
        }

      });
    }


    if (!result) {
      this.toastr.error(msg, '', {
        enableHtml: true,
        closeButton: true
      });
    }

    return result;
  }


  CloseSalesorderModel() {
    this.IsOpenSaveOrder = false;
    this.IsOpenSaveOrderItem = false;
  }
  CloseSalesorderItemModel() {
    if(this.GDNID > 0)
    {
      this.IsOpenSaveOrder = false;
      this.IsOpenSaveOrderItem = false;
    }
    else
    {
      this.IsOpenSaveOrder = true;
      this.IsOpenSaveOrderItem = false;
    }
  }
  OpenSalesOrder() {
    if(this.lstSelectedSalesOrderDetails && this.lstSelectedSalesOrderDetails.length > 0)
    {
      this.IsOpenSaveOrderItem = true;
      return;
    }

    if(confirm("Are you sure, you want to change from Local to Sales Order?"))
    {

    const model: {
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
    } = {
      SalesOrderID: 0,
      FromDate: null,
      ToDate: null,
      SalesOrderNo: "",
      BrandID: 0,
      PartyID: this.PartyID,
      ConsigneeID: 0,
      AgentID: 0,
      SalesLocationID: 0,
      Priority: "",
      Status: "",
      ExhibitionID: 0,
      CreditTypeID: 0
    }

    this.gdnService.GetPendingSalesOrder(model).then(
      (response: any) => {

        if (!response.success) {
          this.toastr.error(response.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          this.lstSalesOrder = response.data.map((row: any) => (
            {
              Select: false,
              Order: row
            }
          ));
          this.IsOpenSaveOrder = true;
        }

      });
    }
  }
  SubmitSalesorderModel() {
    if (this.lstSalesOrder) {
      const lst = this.lstSalesOrder.filter(t => t.Select == true);
      if (lst && lst.length > 0) {
        this.lstSelectedSalesOrder = lst.map((data: any) => (
          {
            SalesOrderID: data.Order.SalesOrderID,
            SalesOrderNo: data.Order.SalesOrderNo,
            SalesOrderDate: data.Order.SalesOrderDate
          }
        ));
        const SalesOrderIDs: string = this.lstSelectedSalesOrder.map(order => order.SalesOrderID).join(',');

        this.BrandID = lst[0].Order.BrandID;
        this.PartyID = lst[0].Order.PartyID;
        this.ConsigneeID = lst[0].Order.ConsigneeID;
        this.AgentID = lst[0].Order.AgentID;
        this.PONo = lst[0].Order.PONo;
        this.PODate = lst[0].Order.PODate;
        this.DeliveryDate = lst[0].Order.DeliveryDate;
        this.SalesLocationID = lst[0].Order.SalesLocationID;
        this.Priority = lst[0].Order.Priority;
        this.DeliveryDueDays = lst[0].Order.DueDays;
        this.ExhibitionID = lst[0].Order.ExhibitionID;
        this.CreditTypeID = lst[0].Order.CreditTypeID;
        const billingAddress = {
          FirstName: lst[0].Order.Billing_first_name,
          LastName: lst[0].Order.Billing_last_name,
          Address1: lst[0].Order.Billing_address_1,
          Address2: lst[0].Order.Billing_address_2,
          CountryID: lst[0].Order.Billing_CountryID,
          StateID: lst[0].Order.Billing_StateID,
          CityID: lst[0].Order.Billing_CityID,
          CountryName: lst[0].Order.Billing_country,
          StateName: lst[0].Order.Billing_state,
          CityName: lst[0].Order.Billing_city,
          Postcode: lst[0].Order.Billing_postcode,
          EmailID: lst[0].Order.Billing_email,
          PhoneNo: lst[0].Order.Billing_phone
        }
        this.BillingAddress?.FillAddressData(billingAddress);
        const shippingAddress = {
          FirstName: lst[0].Order.Shipping_first_name,
          LastName: lst[0].Order.Shipping_last_name,
          Address1: lst[0].Order.Shipping_address_1,
          Address2: lst[0].Order.Shipping_address_2,
          CountryID: lst[0].Order.Shipping_CountryID,
          StateID: lst[0].Order.Shipping_StateID,
          CityID: lst[0].Order.Shipping_CityID,
          CountryName: lst[0].Order.Shipping_country,
          StateName: lst[0].Order.Shipping_state,
          CityName: lst[0].Order.Shipping_city,
          Postcode: lst[0].Order.Shipping_postcode,
          EmailID: lst[0].Order.Shipping_email,
          PhoneNo: lst[0].Order.Shipping_phone
        }
        this.ShippingAddress?.FillAddressData(shippingAddress);

        this.gdnService.GetPendingSalesOrderDetails(SalesOrderIDs, this.GDNID).then(
          (response: any) => {
            if (!response.success) {
              this.toastr.error("Error while getting Sales Order Details.", '', {
                enableHtml: true,
                closeButton: true
              });
            }
            else {
              this.lstSelectedSalesOrderDetails = response.data.map(
                (t: any) => (
                  {
                    Select: false,
                    Data: {
                      ID: 0,
                      SalesOrderItemID: t.ID,
                      SalesOrderNo: t.SalesOrderNo,
                      SalesOrderDate: t.SalesOrderDate,
                      SrNo: t.SrNo,
                      ParentProductID: t.ParentProductID,
                      ProductID: t.ProductID,
                      sku: t.sku,
                      ProductName: t.ProductName,
                      AttributeValues: t.AttributeValues.map((m: any) => ({
                        ProductAttributeID: m.ProductAttributeID,
                        ProductAttributeValueID: m.ProductAttributeValueID,
                        Name: m.name,
                        Option: m.option
                      })),
                      Qty: t.Qty,
                      Price: t.Price,
                      TotalAmount: t.Subtotal,
                      TotalTaxAmount: t.Total_tax,
                      FinalAmount: t.Total,
                      HSNCodeID: t.HSNCodeID,
                      HSNCodeName: t.HSNCodeName,
                      Remarks: t.Remarks,
                      Photo: t.Photo,
                      Taxes: t.Taxes ? t.Taxes.map((m: any) => ({
                        TaxRateID: m.TaxRateID,
                        TaxClassID: m.TaxClassID,
                        name: m.TaxName,
                        rate: m.Rate,
                        Amount: m.Total
                      })) : []
                    }
                  }
                )
              );

              // this.Taxes = response.Taxes.map((m: any) => (
              //   {
              //     TaxRateID: m.TaxRateID,
              //     TaxClassID: m.TaxClassID,
              //     name: m.TaxName,
              //     rate: m.Rate,
              //     Amount: m.Total
              //   }
              // ));

            }
          }
        ).finally(() => {
          this.CloseSalesorderModel();
          this.checkSalesOrderItemSelectAllStatus();
          this.IsOpenSaveOrderItem = true;
        });

      }
      else {
        this.toastr.error("Please select sales order.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }
  onradioSelectionChange(row: any) {
    this.lstSalesOrder.forEach((data: any) => {
      if (row.Order.SalesOrderID !== data.Order.SalesOrderID) {
        data.Select = false; // Deselect other rows
      }
      else {
        data.Select = true;
      }
    });
  }
  isSOAllSelected: boolean = false;
  toggleSalesOrderSelectAll(){
    this.lstSalesOrder.forEach(order => order.Select = this.isSOAllSelected);
  }
  checkSalesOrderSelectAllStatus(){
    this.isSOAllSelected = this.lstSalesOrder.every(order => order.Select);
  }
  isAllSelected: boolean = false;
  IsPicVisibleInSalesOrderItem: boolean = false;
  toggleSalesOrderItemSelectAll(){
    if (!this.strSOProductFilter) {
      this.lstSelectedSalesOrderDetails.forEach(order => order.Select = this.isAllSelected);
    }
    this.lstSelectedSalesOrderDetails.filter(order => order.Data.ProductName?.toLowerCase().includes(this.strSOProductFilter.toLowerCase())).forEach(order => order.Select = this.isAllSelected);
  }
  checkSalesOrderItemSelectAllStatus(){
    this.isAllSelected = this.lstSelectedSalesOrderDetails.every(order => order.Select);
  }
  SubmitSalesorderItemModel() {
    if (this.lstSelectedSalesOrderDetails) {
      const lst = this.lstSelectedSalesOrderDetails.filter(t => t.Select == true);
      if (lst && lst.length > 0) {
      const lstHSNCode = lst.filter(t => t.Data.HSNCodeID == 0);
        if(lstHSNCode.length > 0)
        {
          this.toastr.error("Please select HSNCode for all selected products.", '', {
            enableHtml: true,
            closeButton: true
          });
          return;
        }
        
        this.ProductDetails = lst.map( (t:any, i) => (
          {
            ID: 0,
            SalesOrderItemID: t.Data.SalesOrderItemID,
            SalesOrderNo: t.Data.SalesOrderNo,
            SalesOrderDate: t.Data.SalesOrderDate,
            SrNo: i + 1,
            ParentProductID: t.Data.ParentProductID,
            ProductID: t.Data.ProductID,
            sku: t.Data.sku,
            ProductName: t.Data.ProductName,
            AttributeValues: t.Data.AttributeValues.map((m: any) => ({
              ProductAttributeID: m.ProductAttributeID,
              ProductAttributeValueID: m.ProductAttributeValueID,
              Name: m.name,
              Option: m.option
            })),
            Qty: t.Data.Qty,
            Price: t.Data.Price,
            TotalAmount: t.Data.TotalAmount,
            TotalTaxAmount: t.Data.TotalTaxAmount,
            FinalAmount: t.Data.FinalAmount,
            HSNCodeID: t.Data.HSNCodeID,
            HSNCodeName: t.Data.HSNCodeName,
            Remarks: t.Data.Remarks,
            Photo: t.Data.Photo,
            Taxes: t.Data.Taxes ?? [],
            Stock: []
          }
        )
        );
        this.AutoStockDeduct();
        this.RefreshTaxDetails();
        this.CalculateAmount();
        this.VoucherType = "Sales Order";
        this.IsOpenSaveOrder = false;
        this.IsOpenSaveOrderItem = false;
      }
      else {
        this.toastr.error("Please select sales order.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }
  LocalButtonClick() {
    if(confirm("Are you sure, you want to change from Sales Order to Local?"))
      {
    this.VoucherType = "Local";
    this.lstSelectedSalesOrder = [];
    this.lstSelectedSalesOrderDetails = [];
    this.ProductDetails = [];
    this.Taxes = [];
    this.RefreshTaxDetails();
    this.CalculateAmount();
      }
  }

  GetSalesOrderDetails() : string{
    let str = "";
    this.lstSelectedSalesOrder.forEach( (order) => {
      let SOdate = this.formatDate(new Date(order.SalesOrderDate));
      str = str + ((str.length > 0) ? "\n" : "") + order.SalesOrderNo;
      str = str + " - " + SOdate;
    });
    return str;
  }
  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2); // Adds leading zero if necessary
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adds leading zero if necessary
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  filteredSalesOrders(){
    if (!this.strSOFilter) {
      return this.lstSalesOrder; // If no filter is applied, return all orders
    }

    // Apply filter to SalesOrderNo and SalesOrderDate
    return this.lstSalesOrder.filter(order => order.Order.SalesOrderNo?.toLowerCase().includes(this.strSOFilter.toLowerCase()) 
    || order.Order.SalesOrderDate?.toLocaleString().includes(this.strSOFilter.toLowerCase())
    || order.Order.PartyName?.toLowerCase().includes(this.strSOFilter.toLowerCase())
    || order.Order.PONo?.toLowerCase().includes(this.strSOFilter.toLowerCase())
    || order.Order.PODate?.toLowerCase().includes(this.strSOFilter.toLowerCase()));
    
  }

  HSNCodeDropdownSelectionChange(event: MatSelectChange, item: any)
  {
    const HSNCodeID = event.value;
    const HSNCode = this.lstHSNCode.filter(t=>t.value == HSNCodeID);
    if(HSNCode)
    {
      item.Data["HSNCodeID"] = HSNCodeID;
      item.Data["HSNCodeName"] = HSNCode[0].label;
    }
  }
  CopyHSNCode(HSNCodeID:number){
    this.lstSelectedSalesOrderDetails.filter(t=>t.Select == true).forEach(order => order.Data.HSNCodeID = HSNCodeID);
  }

  OnSuccessfulScan(ScanValue: string){
    //this.strSOProductFilter = ScanValue;
    if (ScanValue.length > 0) {
      this.lstSelectedSalesOrderDetails.filter(t=> String(t.Data.ProductID) == ScanValue).forEach(order => order.Select = true);
    }

  }

  StateSelectedIndexChange(event: MatSelectChange){
      this.FillTax();
  }

  CreateParty() {
    this.partycomp?.OpenModel(-1, 'Create Party', 1);
  }
  CreateConsignee() {
    this.consigneecomp?.OpenModel(-1, 'Create Consignee', 2);
  }
  CreateAgent() {
    this.agentcomp?.OpenModel(-1, 'Create Agent', 5);
  }


  IsDisplayStock: boolean = false;
  StockDetail: any;
  ShowStockDetails(item: any) {
    this.StockDetail = item;
    this.IsDisplayStock = true;
  }
  CloseStockModel() {
    this.IsDisplayStock = false;
    this.StockDetail = null;
  }
  GetItemTotalStockQty(selectedStocks:Stock_Used_ViewModel[]|null): number{
    if(selectedStocks)
    {
    let total = selectedStocks.reduce((sum, element) => sum + element.Qty, 0);
    return total;
    }
    return 0;
  }
  AutoStockDeduct(){
    
    this.ProductDetails.forEach( p=> {
          let selectedStocks: Stock_Used_ViewModel[] = [];
          let lstStocks: Stock_ViewModel[] = [];

          const filter: Stock_FilterModel = {
            BrandID: 0,
            ParentProductID: 0,
            ProductID: p.ProductID,
            ProductName: "",
            Sku: "",
            ProductIDs: "",
            TransID: this.GDNID,
            TransType: "GDN",
            Remarks: p.Remarks??"",
            IsRemarks: 1
          };
          this.stockService.Get(filter).then(
            (res: any) => {
              const response: Stock_View_response_Model = res;
              if (!response.success || response.data == null) {
                this.toastr.error(response.message, '', {
                  enableHtml: true,
                  closeButton: true
                });
              }
              else {
                lstStocks = response.data.map((data: Stock_ViewModel) => ({
                  StockItemID: data.StockItemID,
                  BrandID: data.BrandID,
                  BrandName: data.BrandName,
                  ProductID: data.ProductID,
                  ParentProductID: data.ParentProductID,
                  SKU: data.SKU,
                  ProductName: data.ProductName,
                  Remarks: data.Remarks,
                  Qty: data.Qty,
                  UsedQty: 0
                }));
      
              }
            }
          ).finally( ()=> {
      
              let totalAllocatedQty = p.Qty;
              let q: number = 0;
      
              if(lstStocks.length > 0){
                  lstStocks.filter(t=>t.BrandID == this.BrandID).forEach( i => {
                    q = 0;
                    if(totalAllocatedQty > 0)
                    {
      
                      if(i.Qty <= totalAllocatedQty){
                        q = i.Qty;
                      }
                      else{
                        q = totalAllocatedQty;
                      }
                      if(q > 0){
                        selectedStocks.push({
                        StockItemID: i.StockItemID,
                        BrandID: i.BrandID,
                        BrandName: i.BrandName,
                        ProductID: i.ProductID,
                        ParentProductID: i.ParentProductID,
                        SKU: i.SKU,
                        ProductName: i.ProductName,
                        Remarks: i.Remarks,
                        Qty: q
                      });
                      totalAllocatedQty = totalAllocatedQty - q;
                      }
      
                    }
      
                  });
                  lstStocks.filter(t=>t.BrandID != this.BrandID).forEach( i => {
                    q = 0;
                    if(totalAllocatedQty > 0)
                    {
      
                      if(i.Qty <= totalAllocatedQty){
                        q = i.Qty;
                      }
                      else{
                        q = totalAllocatedQty 
                      }
                      if(q > 0){
                        selectedStocks.push({
                        StockItemID: i.StockItemID,
                        BrandID: i.BrandID,
                        BrandName: i.BrandName,
                        ProductID: i.ProductID,
                        ParentProductID: i.ParentProductID,
                        SKU: i.SKU,
                        ProductName: i.ProductName,
                        Remarks: i.Remarks,
                        Qty: q
                      });
                      totalAllocatedQty = totalAllocatedQty - q;
                      }
      
                    }
      
                  });
              }
              if(selectedStocks.length > 0)
              {
                p.Stock = selectedStocks;
              }
          });
    });
  }

}
