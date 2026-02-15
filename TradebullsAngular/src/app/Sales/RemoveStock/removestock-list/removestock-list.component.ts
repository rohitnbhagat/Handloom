import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RemoveStockService } from '../../../services/Sales/removestock.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { RemoveStockAddComponent } from '../removestock-add/removestock-add.component';
import { RemoveStockPrintComponent } from '../removestock-print/removestock-print.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx';

import { BrandService } from '../../../services/Masters/brand.service';

@Component({
  selector: 'app-removestock-list',
  templateUrl: './removestock-list.component.html',
  styleUrl: './removestock-list.component.css'
})
export class RemoveStockListComponent implements OnInit {

  displayedColumns = ['Actions', 'RemoveStockID', 'RemoveStockNo', 'RemoveStockDate', 'BrandName', 'TotalQty', 'ModifiedByName', 'ModifiedDate'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("RemoveStockAdd") RemoveStockAdd?: RemoveStockAddComponent;
  @ViewChild("RemoveStockPrint") RemoveStockPrint?: RemoveStockPrintComponent;

  OrderList!: any[];
  isLoading: boolean = false;
  IsAddNew: boolean = false;
  IsPrint: boolean = false;

  VoucherNo: string = "";
  FromDate: Date | null = null;
  ToDate: Date | null = null;
  BrandID: number = 0;
  
  lstBrands: any[] = [];
  
  constructor(private fb: FormBuilder, private router: Router, private removeStockService: RemoveStockService, private toastr: ToastrService, private el: ElementRef,
        private brandService: BrandService
  ) {
  }
  ngOnInit(): void {
    this.FillBrand();
  }

  ngAfterViewInit() {
    this.loadOrders();
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
          label: "All",
          data: { BrandID: 0, BrandName: "All" },
        });

      }

    });
  }

  loadOrders(isReload: boolean = false) {
    this.isLoading = true;
    const model:{
      RemoveStockID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      RemoveStockNo: string,
      BrandID: number
    } = {
      RemoveStockID: 0,
      FromDate: this.FromDate ?? null,
      ToDate: this.ToDate ?? null,
      RemoveStockNo: this.VoucherNo ?? "",
      BrandID: this.BrandID ?? 0
    }
    this.removeStockService.Get(model).then(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
        this.isLoading = false;
      }
      else {
        this.OrderList = d.data;
        this.dataSource = new MatTableDataSource(this.OrderList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }

    });
  }

  DeleteRow(item: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.OrderList = this.OrderList.filter(obj => obj.RemoveStockID !== item.RemoveStockID);

      this.removeStockService.Delete(<number>item.RemoveStockID).subscribe(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '');
        }
        else {
          this.toastr.success(item.RemoveStockNo + ' successfully deleted', '', { enableHtml: true, closeButton: true });
          this.loadOrders(true);
        }

      });
    }
  }

  formatDate(date?: Date): string {
    if (date) {
      const d = new Date(date);
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const seconds = d.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const day = ("0" + d.getDate()).slice(-2);
      const month = ("0" + (d.getMonth() + 1)).slice(-2); // getMonth() returns month from 0 to 11
      const year = d.getFullYear();
      const formattedHours = ("0" + (hours % 12)).slice(-2); // 12-hour format
      const formattedMinutes = ("0" + minutes).slice(-2);
      const formattedSeconds = ("0" + seconds).slice(-2);

      return `${day}-${month}-${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    } else {
      return "";
    }
  }
  ExportToExcel() {
    const todayDate = new Date();
    const FileName: string = "RemoveStock_" + todayDate.getDate() + todayDate.getMonth() + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + ".xlsx";

    const filteredData = this.OrderList.map(item => ({
      'Remove Stock ID': item.RemoveStockID,
      'Remove Stock No': item.RemoveStockNo,
      'Remove Stock Date': this.formatDate(item.RemoveStockDate),
      'Brand': item.BrandName,
      'Total Qty': item.TotalQty,
      'Modified By': item.ModifiedByName,
      'Modified Date': this.formatDate(item.ModifiedDate)
    }));

    // Convert the filtered data into a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData); //, { header: customHeaders });

    // Create a new workbook and append the worksheet to it
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the workbook to an Excel file
    XLSX.writeFile(wb, FileName);
  }

  OpenRemoveStock(RemoveStockID: number) {
    this.IsAddNew = true;
    this.RemoveStockAdd?.OpenSalesOrder(RemoveStockID);
  }

  RemoveStockBackEvent(){
    this.IsAddNew = false;
  }
  PrintRow(item: any) {
    this.IsPrint = true;
    this.RemoveStockPrint?.OpenSalesOrder(item.RemoveStockID);
  }
  PrintClose_Click(){
    this.IsPrint = false;
  }

}
