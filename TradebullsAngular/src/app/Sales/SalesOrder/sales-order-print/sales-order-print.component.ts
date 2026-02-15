import { Component, OnInit, AfterContentInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrderService } from '../../../services/Sales/sales-order.service';
import { ToastrService } from 'ngx-toastr';
import { SalesOrder_Item } from '../../../Models/Sales/SalesOrderModel';
import { SalesOrder_AddModel, SalesOrder_Item_AddModel, SalesOrder_Tax_AddModel } from '../../../Models/Sales/SalesOrderModel';
import { LabelprintsettinsService } from '../../../services/Masters/labelprintsettins.service';
import { BrandService } from '../../../services/Masters/brand.service';
import { MatSelectChange } from '@angular/material/select';

declare var JsBarcode: any;

@Component({
  selector: 'app-sales-order-print',
  templateUrl: './sales-order-print.component.html',
  styleUrl: './sales-order-print.component.css'
})
export class SalesOrderPrintComponent implements OnInit, AfterContentInit, AfterViewInit {

  SettingID: number = 0;
  IsOpen: boolean = false;
  isModalOpen: boolean = false;
  barcodeValue = '1234567890';
  lstPrinterSettings: {
    SettingID: number,
    SettingName: string,
    printerDPI: string,
    width: string,
    height: string,
    columns: number,
    columnSpace: string,
    rowSpace: string
  }[] = [];
  IsPicVisible: boolean = true;

  @Output() BackEvent = new EventEmitter<void>();
  PrintType: number = 1;
  SalesOrderID: number = 0;
  VoucherNo: string = "";
  VoucherDate: Date | null = null;
  BrandID: number = 0;
  BrandName: string = "";
  PartyID: number = 0;
  PartyName: string = "";
  ConsigneeID: number = 0;
  AgentID: number = 0;
  SalesLocationID: number = 0;
  SalesLocationName: string = "";
  Priority: string = "Low";
  PONo: string = "";
  PODate: Date | null = null;
  DeliveryDate: Date | null = null;
  DeliveryDueDays: number | null = null;
  Remarks: string = "";
  ParentProductDetails: any[] = [];
  ProductDetails: SalesOrder_Item[] = [];
  Taxes: SalesOrder_Tax_AddModel[] = [];
  GrossTotal: number = 0;
  TotalTax: number = 0;
  TotalAmount: number = 0;
  billingAddress: any = null;
  shippingAddress: any = null;
  Brand:any = null;

  PrintSetting: {
    printerDPI: string,
    width: string,
    height: string,
    columns: number,
    columnSpace: string,
    rowSpace: string
  } = {
      printerDPI: '203',
      width: '50mm',
      height: '25mm',
      columns: 2,
      columnSpace: '2mm',
      rowSpace: '2mm'
    };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesOrderService: SalesOrderService,
    private toastr: ToastrService,
    private labelprintsettinsService: LabelprintsettinsService,
    private brandService: BrandService
  ) { }
  ngAfterViewInit(): void {

  }
  ngAfterContentInit(): void {
    //this.OpenSalesOrder();
  }

  ngOnInit(): void {
    this.labelprintsettinsService.Get(0).subscribe(users => {
      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.lstPrinterSettings = d.data.map((element: any) => ({
          SettingID: element.SettingID,
          SettingName: element.SettingName,
          printerDPI: element.printerDPI,
          width: element.width + "mm",
          height: element.height + "mm",
          columns: element.columns,
          columnSpace: element.columnSpace + "mm",
          rowSpace: element.rowSpace + "mm"
        }));
        if (this.lstPrinterSettings.length > 0) {
          this.SettingID = this.lstPrinterSettings[0].SettingID;
          this.PrintSetting = {
            printerDPI: this.lstPrinterSettings[0].printerDPI,
            width: this.lstPrinterSettings[0].width,
            height: this.lstPrinterSettings[0].height,
            columns: this.lstPrinterSettings[0].columns,
            columnSpace: this.lstPrinterSettings[0].columnSpace,
            rowSpace: this.lstPrinterSettings[0].rowSpace
          }
        }

      }

    });
  }
  CloseModel() {
    this.isModalOpen = false;
    this.IsOpen = false;
    this.BackEvent.emit();
  }
  BacktoList() {
    //this.router.navigate(['/dashboard/Sales/OrderList']);
    this.IsOpen = false;
    this.BackEvent.emit();
  }

  btnOkay_Click() {
    this.IsOpen = true;
    this.isModalOpen = false;
  }

  OpenSalesOrder(SID: number) {
    this.isModalOpen = true;
    this.SalesOrderID = SID;
    if (this.SalesOrderID > 0) {
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
        SalesOrderID: this.SalesOrderID,
        FromDate: null,
        ToDate: null,
        SalesOrderNo: "",
        BrandID: 0,
        PartyID: 0,
        ConsigneeID: 0,
        AgentID: 0,
        SalesLocationID: 0,
        Priority: "",
        Status: "",
        ExhibitionID: 0,
        CreditTypeID: 0
      }
      this.salesOrderService.Get(model).then(
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
              this.VoucherNo = order.SalesOrderNo;
              this.VoucherDate = order.SalesOrderDate;
              this.BrandID = order.BrandID;
              this.BrandName = order.BrandName;
              this.PartyID = order.PartyID;
              this.PartyName = order.PartyName;
              this.ConsigneeID = order.ConsigneeID;
              this.AgentID = order.AgentID;
              this.SalesLocationID = order.SalesLocationID;
              this.SalesLocationName = order.SalesLocationName;
              this.Priority = order.Priority;
              this.PONo = order.PONo;
              this.PODate = order.PODate;
              this.DeliveryDate = order.DeliveryDate;
              this.DeliveryDueDays = order.DueDays;
              this.Remarks = order.Remarks;
              this.GrossTotal = order.GrossTotal;
              this.TotalTax = order.TotalTax;
              this.TotalAmount = order.TotalAmount;
              this.ProductDetails = [];

              this.billingAddress = {
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

              this.shippingAddress = {
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

              this.salesOrderService.GetOrderDetails(this.SalesOrderID).then(
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
                          SrNo: t.SrNo,
                          ParentProductID: t.ParentProductID,
                          ProductID: t.ProductID,
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

                    this.ParentProductDetails = responseDetail.ParentProduct.map(
                      (t: any) => (
                        {
                          SrNo: t.SrNo,
                          ProductID: t.ProductID,
                          ProductName: t.ProductName,
                          Qty: t.Qty,
                          TotalAmount: t.Subtotal,
                          TotalTaxAmount: t.Total_tax,
                          FinalAmount: t.Total,
                          Photo: t.Photo
                        }
                      )
                    );
                  }
                }
              );

              this.brandService.Get(this.BrandID).subscribe(users => {

                let d: any = users;
                if (!d.success) {
                  this.toastr.error(d.message, '', {
                    enableHtml: true,
                    closeButton: true
                  });
                }
                else {
                  const a: any[] = d.data;
                  if(a)
                    this.Brand = a[0];
                }

              });


            }
          }

        });
    }
  }

  GetBillingAddress(): string {
    let str = "";
    if (this.billingAddress) {
      //str = this.billingAddress.FirstName + " " + this.billingAddress.LastName;
      let strAddress: string[] = [];
      let strAddressCity: string[] = [];

      //strAddress.push(this.billingAddress.FirstName + " " + this.billingAddress.LastName);
      if (this.billingAddress.Address1)
        strAddress.push(this.billingAddress.Address1);
      if (this.billingAddress.Address2)
        strAddress.push(this.billingAddress.Address2);

      if (this.billingAddress.CityName)
        strAddressCity.push(this.billingAddress.CityName);
      if (this.billingAddress.StateName)
        strAddressCity.push(this.billingAddress.StateName);
      if (this.billingAddress.CountryName)
        strAddressCity.push(this.billingAddress.CountryName);
      if (this.billingAddress.Postcode)
        strAddressCity.push("Postcode: " + this.billingAddress.Postcode);

      str = strAddress.join(",<br>");
      if (strAddress.length == 0)
        str = strAddressCity.join(", ");
      else
        str = str + "<br>" + strAddressCity.join(", ");

    }

    return str;
  }

  GetTotalQty(): number {
    const TotalQty = this.ProductDetails.reduce((sum, element) => sum + element.Qty, 0);
    return TotalQty;
  }

  GetProductDetails(ProductID: number): SalesOrder_Item[] {
    const filter = this.ProductDetails.filter(t => t.ParentProductID == ProductID);
    return filter;
  }

  Print(): void {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    // Get the content from the div
    const content = document.getElementById('contenttoprint')?.innerHTML;

    const iframeDocument = iframe.contentWindow?.document;
    iframeDocument?.open();
    iframeDocument?.write('<html><head><title>Print</title>');


    iframeDocument?.write('<link rel="stylesheet" href="../../styles.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/bootstrap/dist/css/bootstrap.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/font-awesome/css/font-awesome.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/nprogress/nprogress.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/iCheck/skins/flat/green.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/google-code-prettify/bin/prettify.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/select2/dist/css/select2.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/switchery/dist/switchery.min.cs" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/starrr/dist/starrr.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/jqvmap/dist/jqvmap.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/bootstrap-daterangepicker/daterangepicker.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/animate.css/animate.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/build/css/custom.css" type="text/css">');

    // let strScript: string = "<script>";
    //  strScript = strScript + "window.onload = function() { window.print(); window.close();};";
    //  strScript = strScript + "</script>";
    //  iframeDocument?.write(strScript);

    if (this.PrintType == 2) {
      let strStyle: string = "<style>";
      strStyle = strStyle + "body{background:red;}";
      strStyle = strStyle + "@media print {";
      strStyle = strStyle + "@page {size: " + this.PrintSetting.width + " " + this.PrintSetting.height + ";padding:0px;margin: 0px;}";
      strStyle = strStyle + "}";
      strStyle = strStyle + "</style>";
      iframeDocument?.write(strStyle);
    }
    // else
    // {
    //   let strStyle: string = "<style>";
    //   strStyle = strStyle + "body{background:red;}";
    //   strStyle = strStyle + "@media print {";
    //   strStyle = strStyle + "@page {size: "+ this.PrintSetting.width + " " + this.PrintSetting.height +";padding:0px;margin: 0px;}";
    //   strStyle = strStyle + "}";
    //   strStyle = strStyle + "</style>";
    //   iframeDocument?.write(strStyle);
    // }

    iframeDocument?.write('</head><body>');
    if (this.PrintType != 2)
      iframeDocument?.write('<div class="container body"><div class="main_container"><div class="right_col m-0 p-0">');
    iframeDocument?.write(content || '');
    if (this.PrintType != 2)
      iframeDocument?.write('</div></div></div>');
    iframeDocument?.write('</body></html>');
    iframeDocument?.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();  // Ensure the iframe has focus
      iframe.contentWindow?.print();  // Trigger print dialog
      document.body.removeChild(iframe);  // Clean up by removing iframe after print
    };

  }

  forloop(num: number): number[] {
    let row: number[] = [];
    for (let i = 0; i < num; i++) {
      row.push(i);
    }
    return row;
  }

  DropdownSelectionChange(event: MatSelectChange) {
    this.SettingID = event.value;
    this.lstPrinterSettings.filter(t => t.SettingID == event.value).forEach(
      (data: any) => {
        this.PrintSetting = {
          printerDPI: data.printerDPI,
          width: data.width,
          height: data.height,
          columns: data.columns,
          columnSpace: data.columnSpace,
          rowSpace: data.rowSpace
        }
      }
    );

  }

  GetAddress(): string{
    let address: string = "";
    if(this.Brand)
      address = this.Brand.Remarks.replace(/\n/g, '<br>');
    return address;
  }
}
