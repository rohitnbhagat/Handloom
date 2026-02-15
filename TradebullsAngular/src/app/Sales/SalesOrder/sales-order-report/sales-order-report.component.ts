import { Component, AfterContentInit, OnInit } from '@angular/core';
import { parseString } from 'xml2js';
import { ToastrService } from 'ngx-toastr';
import { SalesOrderService } from '../../../services/Sales/sales-order.service';
import * as XLSX from 'xlsx';
import { PartyService } from '../../../services/Masters/party.service';
import { ProductService } from '../../../services/Masters/product.service';

import { BrandService } from '../../../services/Masters/brand.service';
import { SalesLocationService } from '../../../services/Masters/salesLocation.service';
import { ExhitionService } from '../../../services/Masters/exhition.service';

@Component({
  selector: 'app-sales-order-report',
  templateUrl: './sales-order-report.component.html',
  styleUrl: './sales-order-report.component.css'
})
export class SalesOrderReportComponent implements OnInit, AfterContentInit {
  SalesOrderNo: string = "";
  PartyID: number = 0;
  PartyIDs: number[] = [];
  ProductID: number = 0;
  ProductIDs: number[] = [];
  VariationID: number = 0;
  VariationIDs: number[] = [];
  FromDate: Date = new Date();
  ToDate: Date = new Date();
  orders: any[] = [];
  columnNames: any[] = [];
  TotalRows:number = -1;
  isLoading:boolean = false;
  Summary: {Column:string, Total: number}[] = [];
  lstPartys: any[] = [];
  lstParentProducts: any[] = [];
  lstProducts: any[] = [];

  BrandIDs: number[] = [];
  SalesLocationIDs: number[] = [];
  ExhibitionIDs: number[] = [];

  lstBrands: any[] = [];
  lstSalesLocations: any[] = [];
  lstExhibition: any[] = [];

  options = [
    { value: 'SalesOrderID', viewValue: 'Sales Order ID', logic:"SalesOrderID", width:"150px", IsTotal: false },
    { value: 'SalesOrderNo', viewValue: 'Sales Order No', logic:"SalesOrderNo", width:"150px", IsTotal: false  },
    { value: 'SalesOrderDate', viewValue: 'Sales Order Date' , logic:"SalesOrderDate" , width:"150px", IsTotal: false},
    { value: 'PartyName', viewValue: 'Party', logic:"PartyName", width:"300px", IsTotal: false  },
    { value: 'ConsigneeName', viewValue: 'Consignee' , logic:"ConsigneeName" , width:"300px", IsTotal: false},
    { value: 'BillingName', viewValue: 'Billing Name', logic:"BillingName", width:"300px", IsTotal: false  },
    { value: 'BrandName', viewValue: 'Brand', logic:"BrandName" , width:"200px", IsTotal: false },
    { value: 'SalesLocationName', viewValue: 'Sales Location', logic:"SalesLocationName" , width:"200px", IsTotal: false },
    { value: 'ExhibitionName', viewValue: 'Exhibition', logic:"ExhibitionName" , width:"200px", IsTotal: false },
    // { value: 'ProductID', viewValue: 'Product ID' , logic:"ProductID" , width:"100px", IsTotal: false},
    { value: 'Image', viewValue: 'Image' , logic:"Image" , width:"150px", IsTotal: false},
    { value: 'ProductName', viewValue: 'Product Name' , logic:"ProductName" , width:"200px", IsTotal: false},
    // { value: 'VariationID', viewValue: 'Variation ID' , logic:"VariationID", width:"100px" , IsTotal: false},
    { value: 'sku', viewValue: 'SKU' , logic:"sku", width:"150px", IsTotal: false },
    { value: 'VariationName', viewValue: 'Variation Name' , logic:"VariationName", width:"300px", IsTotal: false },
    { value: 'Color', viewValue: 'Color' , logic:"Color", width:"150px", IsTotal: false },
    { value: 'Size', viewValue: 'Size' , logic:"Size", width:"150px", IsTotal: false },
    { value: 'Remarks', viewValue: 'Remarks' , logic:"Remarks", width:"150px", IsTotal: false },
    { value: 'SUM(Qty) AS Qty', viewValue: 'Qty' , logic:"Qty" , width:"100px", IsTotal: true},
    { value: 'SUM(GDNQty) AS GDNQty', viewValue: 'GDN Qty' , logic:"GDNQty" , width:"100px", IsTotal: true},
    { value: 'SUM(PendingGDNQty) AS PendingGDNQty', viewValue: 'Pend GDN Qty' , logic:"PendingGDNQty" , width:"130px", IsTotal: true},
    { value: 'Price', viewValue: 'Price' , logic:"Price" , width:"100px", IsTotal: false},
    { value: 'SUM(SubTotal) AS SubTotal', viewValue: 'Sub Total' , logic:"SubTotal", width:"130px", IsTotal: true},
    { value: 'SUM(Total_Tax) AS Total_Tax', viewValue: 'Total Tax' , logic:"Total_Tax" , width:"130px", IsTotal: true},
    { value: 'SUM(Total) AS Total', viewValue: 'Total Amount', logic:"Total" , width:"130px" , IsTotal: true}

  ];

  // Array to hold selected values
  selectedOptions: string[] = [];

  constructor(private salesOrderService: SalesOrderService, private toastr: ToastrService,
    private partyService: PartyService, private productService: ProductService,
    private brandService: BrandService,
    private exhitionService: ExhitionService,
    private salesLocationService: SalesLocationService
  ) {
    const d = new Date();
    this.FromDate = new Date(d.getFullYear(), 0, 1);
    this.selectedOptions = []; // this.options.map(t => ( t.value));
  }
  ngOnInit(): void {
    this.FillParty();
    this.FillParentProduct();
    this.FillProduct();
    this.FillBrand();
    this.FillExhition();
    this.FillSalesLocation();
  }

  ngAfterContentInit(): void {
    // this.LoadReport();
    const s = localStorage.getItem("reportColumns");
    if(s){
      const sl : {
        Columns: string,
        FromDate: Date,
        ToDate: Date
      } = JSON.parse(s)
      this.selectedOptions = sl.Columns.split(",");
      this.FromDate = sl.FromDate;
      this.ToDate = sl.ToDate;
    }
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

        // this.lstPartys.unshift({
        //   value: 0,
        //   label: "All",
        //   data: { PartyID: 0, PartyName: "All" },
        // });

      }

    });
  }

  FillParentProduct() {
    const model = {
      ProductID: 0,
      ParentProductID: 0,
      ProductType: 1,
      ProductName: "",
      ProductAttributeIDs: '',
      ProductAttributeValueIDs: '',
      ProductIDs: ''
    }

    this.productService.Get(model).then(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstParentProducts = a.map((prod) => ({
          value: prod.ProductID,
          label: prod.name,
          data: prod,
        }));

        // this.lstParentProducts.unshift({
        //   value: 0,
        //   label: "All",
        //   data: { ProductID: 0, name: "All" },
        // });

      }

    });
  }

  ProductSelectionChange(event: any) {
    this.VariationID = 0;   
    this.VariationIDs = []; 
    this.FillProduct();
  }

  FillProduct() {
    this.lstProducts = [];
    if(this.ProductIDs.length > 0)
    {
    const model = {
      ProductID: 0,
      ParentProductID: 0,
      ProductType: 2,
      ProductName: "",
      ProductAttributeIDs: '',
      ProductAttributeValueIDs: '',
      ProductIDs: this.ProductIDs.join(",")
    }

    this.productService.Get(model).then(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstProducts = a.map((prod) => ({
          value: prod.ProductID,
          label: prod.name,
          data: prod,
        }));

        // this.lstProducts.unshift({
        //   value: 0,
        //   label: "All",
        //   data: { ProductID: 0, name: "All" },
        // });

      }

    });
  }
  else
  {
    this.lstProducts.push({
      value: 0,
      label: "All",
      data: { ProductID: 0, name: "All" },
    });
  }
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

        // this.lstBrands.unshift({
        //   value: 0,
        //   label: "All",
        //   data: { BrandID: 0, BrandName: "All" },
        // });

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

        // this.lstExhibition.unshift({
        //   value: 0,
        //   label: "All",
        //   data: { ExhitionID: 0, ExhitionName: "All" },
        // });

      }

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

        // this.lstSalesLocations.unshift({
        //   value: 0,
        //   label: "All",
        //   data: { SalesLocationID: 0, SalesLocationName: "All" },
        // });

      }

    });
  }


GetColumnName(name: string): string{
  let s = "";
  if(name.toLocaleLowerCase() == "qty")
    s= "Qty";
  else
  {
  const f = this.options.filter(t=>t.logic == name);
  if(f.length > 0)
    s = f[0].viewValue;
  }
  return s;
}
GetColumnWidth(name: string): string{
  let s = "100px";
  
  const f = this.options.filter(t=>t.logic == name);
  if(f.length > 0)
    s = f[0].width;
  return s;
}
IsTotal(name: string): boolean{
  let s = false;
  const f = this.options.filter(t=>t.logic == name);
  if(f.length > 0)
    s = f[0].IsTotal;
  
  return s;
}

  LoadReport(){
    localStorage.setItem("reportColumns", JSON.stringify({
      Columns: this.selectedOptions.join(","),
      FromDate: this.FromDate,
      ToDate: this.ToDate
    }));

    if(this.selectedOptions.length == 0)
    {
      this.toastr.error("Please select atleast one column.", '');
      return;
    }
    let model:{
      SalesOrderNo: string,
      PartyIDs: string,
      ProductIDs: string,
      VariationIDs: string,
      Columns: string,
      FromDate: Date,
      ToDate: Date,
      BrandIDs: string,
      SalesLocationIDs: string,
      ExhibitionIDs: string
    } = {
      SalesOrderNo: this.SalesOrderNo,
      PartyIDs: this.PartyIDs.join(","),
      ProductIDs: this.ProductIDs.join(","),
      VariationIDs: this.VariationIDs.join(","),
      Columns: this.selectedOptions.join(","),
      FromDate: this.FromDate,
      ToDate: this.ToDate,
      BrandIDs: (this.BrandIDs) ? this.BrandIDs.join(",") : "",
      SalesLocationIDs: (this.SalesLocationIDs) ? this.SalesLocationIDs.join(",") : "",
      ExhibitionIDs: (this.ExhibitionIDs) ? this.ExhibitionIDs.join(",") : ""
    };
    this.isLoading = true;
    this.orders = [];
    this.columnNames = [];
    this.TotalRows = -1;
    this.Summary = [];

    this.salesOrderService.GetReport(model).subscribe(
      (response:any) => {

          if (!response.success) {
            this.isLoading = false;
            this.toastr.error(response.message, '');
          }
          else{
            const str = '<?xml version="1.0" encoding="UTF-8"?>' + response.data;
            parseString(str, (err, result) => {
              if (err) {
                console.error('Error parsing XML', err);
              } else {
                this.orders = result.Orders.Order;
                if(this.orders.length > 0)
                  this.columnNames = Object.keys(this.orders[0]); 
              }
              this.TotalRows = (this.columnNames.length > 0) ? this.orders.length : 0;
              
              this.columnNames.forEach(col => {
                if(this.IsTotal(col))
                {
                  const total = this.orders.reduce((sum, element) => sum + Number(element[col]), 0);
                  this.Summary.push({ Column: this.GetColumnName(col), Total: total });
                }
              });


              this.isLoading = false;
            });

          }

      }
    );

    

  }

   ExportToExcel() {
    const allColumns = new Set<string>();
    this.orders.forEach(order => {
      Object.keys(order).forEach(key => 
      {
        if(key != 'Image'){
            allColumns.add(key)
        }
      });
    });

    const columnsArray = Array.from(allColumns);
    const normalizedOrders = this.orders.map(order => {
      const normalizedOrder: any = {};
      
      // For each column, ensure it exists in the order (with a default empty value if missing)
      columnsArray.forEach(column => {
        if(order[column] && column != 'Image')
        {
          if(this.IsTotal(column))
            normalizedOrder[column] = (order[column][0]) ? Number(order[column][0]) : 0;
          else
            normalizedOrder[column] = order[column][0];
        }
        else
        normalizedOrder[column] = null;
      });

      return normalizedOrder;
    });


      const todayDate = new Date();
      const FileName: string = "SalesOrder_Report_" + todayDate.getDate() + todayDate.getMonth() + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + ".xlsx";
  
      // Convert the filtered data into a worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(normalizedOrders); //, { header: customHeaders });
  
      // Create a new workbook and append the worksheet to it
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      // Export the workbook to an Excel file
      XLSX.writeFile(wb, FileName);
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


    iframeDocument?.write('</head><body>');
    iframeDocument?.write('<div class="container body">');
    iframeDocument?.write(content || '');
    iframeDocument?.write('</div>');
    iframeDocument?.write('</body></html>');
    iframeDocument?.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();  // Ensure the iframe has focus
      iframe.contentWindow?.print();  // Trigger print dialog
      document.body.removeChild(iframe);  // Clean up by removing iframe after print
    };

  }
    

}
