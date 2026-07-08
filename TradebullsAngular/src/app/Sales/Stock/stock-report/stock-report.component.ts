import { Component, AfterContentInit, OnInit } from '@angular/core';
import { parseString } from 'xml2js';
import { ToastrService } from 'ngx-toastr';
import { StockService } from '../../../services/Sales/stock.service';
import * as XLSX from 'xlsx';
import { ProductService } from '../../../services/Masters/product.service';
import { BrandService } from '../../../services/Masters/brand.service';
import { Stock_Register_FilterModel } from '../../../Models/Sales/StockModel'

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrl: './stock-report.component.css'
})
export class StockReportComponent implements OnInit, AfterContentInit {
  ProductID: number = 0;
  ProductIDs: number[] = [];
  VariationID: number = 0;
  VariationIDs: number[] = [];
  orders: any[] = [];
  isLoading: boolean = false;
  lstParentProducts: any[] = [];
  lstProducts: any[] = [];
  BrandIDs: number[] = [];
  lstBrands: any[] = [];
  IsSearchClicked: boolean = false;
  IsPicVisible: boolean = false;

  // Array to hold selected values
  selectedOptions: string[] = [];

  constructor(private stockService: StockService, private toastr: ToastrService,
    private productService: ProductService,
    private brandService: BrandService
  ) {
    this.selectedOptions = []; // this.options.map(t => ( t.value));
  }
  ngOnInit(): void {
    this.FillParentProduct();
    this.FillProduct();
    this.FillBrand();
  }

  ngAfterContentInit(): void {

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
    if (this.ProductIDs.length > 0) {
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

        }

      });
    }
    else {
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

      }

    });
  }



  LoadReport() {
    this.IsSearchClicked = true;
    let model: Stock_Register_FilterModel = {
      BrandID: (this.BrandIDs) ? this.BrandIDs.join(",") : "",
      ProductID: this.ProductIDs.join(","),
      VariationID: this.VariationIDs.join(",")
    };
    this.isLoading = true;
    this.orders = [];

    this.stockService.GetRegister(model).then(
      (response: any) => {

        if (!response.success) {
          this.isLoading = false;
          this.toastr.error(response.message, '');
        }
        else {
          this.orders = response.data;
          this.orders = this.orders.filter(t=>t.InQty > 0);
          this.isLoading = false;
        }
      }
    );



  }



  GetTotalInQty(): number {
    let total = this.orders.reduce((sum, element) => sum + element.InQty, 0);
    return total;
  }
  GetTotalOutQty(): number {
    let total = this.orders.reduce((sum, element) => sum + element.OutQty, 0);
    return total;
  }
  GetTotalQty(): number {
    let total = this.orders.reduce((sum, element) => sum + element.Qty, 0);
    return total;
  }

  ExportToExcel() {
    const todayDate = new Date();
    const FileName: string = "Stock_" + todayDate.getDate() + todayDate.getMonth() + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + ".xlsx";

    const filteredData = this.orders.map(item => ({
      'Brand': item.BrandName,
      'SKU': item.SKU,
      'Product': item.ProductName,
      'In Qty': item.InQty,
      'Out Qty': item.OutQty,
      'Pend. Qty': item.Qty
    }));

    // Convert the filtered data into a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData); //, { header: customHeaders });

    // Create a new workbook and append the worksheet to it
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the workbook to an Excel file
    XLSX.writeFile(wb, FileName);
  }



  IsDisplayStock: boolean = false;
  StockDetail: any[] = [];
  ShowStockDetails(StockItemID: number, type: string) {
    this.isLoading = true;
    this.StockDetail = [];

    this.stockService.GetRegisterItem(StockItemID, type).then(
      (response: any) => {
        if (!response.success) {
          this.isLoading = false;
          this.toastr.error(response.message, '');
        }
        else {
          this.StockDetail = response.data;
          this.isLoading = false;
          this.IsDisplayStock = true;
        }
      }
    );

  }
  CloseStockModel() {
    this.IsDisplayStock = false;
    this.StockDetail = [];
  }
  GetItemTotalStockQty() {
    let total = this.StockDetail.reduce((sum, element) => sum + element.Qty, 0);
    return total;
  }
  GetItemTotalStockOutQty() {
    let total = this.StockDetail.reduce((sum, element) => sum + element.OutQty, 0);
    return total;
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

     iframeDocument?.write('</head><body>');
     iframeDocument?.write('<div class="container body"><div class="main_container"><div class="right_col m-0 p-0">');
     iframeDocument?.write(content || '');
     iframeDocument?.write('</div></div></div>');
     iframeDocument?.write('</body></html>');
     iframeDocument?.close();

     iframe.onload = () => {
      iframe.contentWindow?.focus();  // Ensure the iframe has focus
      iframe.contentWindow?.print();  // Trigger print dialog
      document.body.removeChild(iframe);  // Clean up by removing iframe after print
    };
    
  }

}
