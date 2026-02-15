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

}
