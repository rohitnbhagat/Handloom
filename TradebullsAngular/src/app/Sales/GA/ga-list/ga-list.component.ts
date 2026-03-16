import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GaService } from '../../../services/Sales/ga.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { GaAddComponent } from '../ga-add/ga-add.component';
import { GaPrintComponent } from '../ga-print/ga-print.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-ga-list',
  templateUrl: './ga-list.component.html',
  styleUrl: './ga-list.component.css'
})
export class GaListComponent implements OnInit {

  displayedColumns = ['Actions', 'GAID', 'GANo', 'GADate', 'TotalQty', 'ModifiedByName', 'ModifiedDate'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("GaAdd") GaAdd?: GaAddComponent;
  @ViewChild("GaPrint") GaPrint?: GaPrintComponent;

  OrderList!: any[];
  isLoading: boolean = false;
  IsAddNew: boolean = false;
  IsPrint: boolean = false;

  VoucherNo: string = "";
  FromDate: Date | null = null;
  ToDate: Date | null = null;
  
  constructor(
      private fb: FormBuilder, 
      private router: Router, 
      private gaService: GaService, 
      private toastr: ToastrService, 
      private el: ElementRef,
      private userService: UserService
  ) {
  }
  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.loadOrders();
  }
   
  loadOrders(isReload: boolean = false) {
    this.isLoading = true;
    const model:{
      GAID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      GANo: string
    } = {
      GAID: 0,
      FromDate: this.FromDate ?? null,
      ToDate: this.ToDate ?? null,
      GANo: this.VoucherNo ?? ""
    }
    this.gaService.Get(model).then(users => {
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
      this.OrderList = this.OrderList.filter(obj => obj.GAID !== item.GAID);

      this.gaService.Delete(<number>item.GAID).subscribe(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '');
        }
        else {
          this.toastr.success(item.GANo + ' successfully deleted', '', { enableHtml: true, closeButton: true });
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
    const FileName: string = "GoodsAssembly_" + todayDate.getDate() + todayDate.getMonth() + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + ".xlsx";

    const filteredData = this.OrderList.map(item => ({
      'Assembly ID': item.GAID,
      'Assembly No': item.GANo,
      'Assembly Date': this.formatDate(item.GADate),
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

  OpenGA(GAID: number) {
    this.IsAddNew = true;
    this.GaAdd?.OpenGA(GAID);
  }

  GABackEvent(){
    this.IsAddNew = false;
  }
  PrintRow(item: any) {
    this.IsPrint = true;
    this.GaPrint?.OpenGA(item.GAID);
  }
  PrintClose_Click(){
    this.IsPrint = false;
  }

}
