import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InsertStockService } from '../../../services/Sales/insertstock.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { InsertStockAddComponent } from '../insertstock-add/insertstock-add.component';
import { InsertStockPrintComponent } from '../insertstock-print/insertstock-print.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx';

import { ExhitionService } from '../../../services/Masters/exhition.service';
import { CreditTypeService } from '../../../services/Masters/creditType.service';
import { PartyService } from '../../../services/Masters/party.service';
import { SalesLocationService } from '../../../services/Masters/salesLocation.service';
import { BrandService } from '../../../services/Masters/brand.service';

@Component({
  selector: 'app-insertstock-list',
  templateUrl: './insertstock-list.component.html',
  styleUrl: './insertstock-list.component.css'
})
export class InsertStockListComponent implements OnInit {

  displayedColumns = ['Actions', 'InsertStockID', 'InsertStockNo', 'InsertStockDate', 'PartyName', 'BrandName', 'TotalQty', 'ModifiedByName', 'ModifiedDate'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("InsertStockAdd") InsertStockAdd?: InsertStockAddComponent;
  @ViewChild("InsertStockPrint") InsertStockPrint?: InsertStockPrintComponent;

  OrderList!: any[];
  isLoading: boolean = false;
  IsAddNew: boolean = false;
  IsPrint: boolean = false;

  VoucherNo: string = "";
  FromDate: Date | null = null;
  ToDate: Date | null = null;
  PartyID: number = 0;
  BrandID: number = 0;
  
  lstPartys: any[] = [];
  lstBrands: any[] = [];
  
  constructor(private fb: FormBuilder, private router: Router, private insertStockService: InsertStockService, private toastr: ToastrService, private el: ElementRef,
        private partyService: PartyService, private brandService: BrandService
  ) {
  }
  ngOnInit(): void {
    this.FillParty();
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
      InsertStockID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      InsertStockNo: string,
      PartyID: number,
      BrandID: number
    } = {
      InsertStockID: 0,
      FromDate: this.FromDate ?? null,
      ToDate: this.ToDate ?? null,
      InsertStockNo: this.VoucherNo ?? "",
      PartyID: this.PartyID ?? 0,
      BrandID: this.BrandID ?? 0
    }
    this.insertStockService.Get(model).then(users => {

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
      this.OrderList = this.OrderList.filter(obj => obj.InsertStockID !== item.InsertStockID);

      this.insertStockService.Delete(<number>item.InsertStockID).subscribe(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '');
        }
        else {
          this.toastr.success(item.InsertStockNo + ' successfully deleted', '', { enableHtml: true, closeButton: true });
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
    const FileName: string = "InsertStock_" + todayDate.getDate() + todayDate.getMonth() + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + ".xlsx";

    const filteredData = this.OrderList.map(item => ({
      'Insert Stock ID': item.InsertStockID,
      'Insert Stock No': item.InsertStockNo,
      'Insert Stock Date': this.formatDate(item.InsertStockDate),
      'Supplier': item.PartyName,
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

  OpenInsertStock(InsertStockID: number) {
    this.IsAddNew = true;
    this.InsertStockAdd?.OpenSalesOrder(InsertStockID);
  }

  InsertStockBackEvent(){
    this.IsAddNew = false;
  }
  PrintRow(item: any) {
    this.IsPrint = true;
    this.InsertStockPrint?.OpenSalesOrder(item.InsertStockID);
  }
  PrintClose_Click(){
    this.IsPrint = false;
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

        this.lstPartys = a.filter(t => t.PartyTypeID == 3).map((party) => ({
          value: party.PartyID,
          label: party.PartyName,
          data: party,
        }));

        this.lstPartys.unshift({
          value: 0,
          label: "All",
          data: { PartyID: 0, PartyName: "All" },
        });

      }

    });
  }

}
