import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcessoutService } from '../../../services/Sales/processout.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { ProcessOutAddComponent } from '../process-out-add/process-out-add.component';
import { ProcessOutPrintComponent } from '../process-out-print/process-out-print.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-process-out-list',
  templateUrl: './process-out-list.component.html',
  styleUrl: './process-out-list.component.css'
})
export class ProcessOutListComponent implements OnInit {

  displayedColumns = ['Actions', 'ProcessOutID', 'ProcessOutNo', 'ProcessOutDate', 'ProcessName', 'PartyName', 'IssueType', 'WorkType','StartDate','EndDate','TotalQty', 'ModifiedByName', 'ModifiedDate'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("ProcessOutAdd") ProcessOutAdd?: ProcessOutAddComponent;
  @ViewChild("ProcessOutPrint") ProcessOutPrint?: ProcessOutPrintComponent;

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
      private processoutService: ProcessoutService, 
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
      ProcessOutID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      ProcessOutNo: string
    } = {
      ProcessOutID: 0,
      FromDate: this.FromDate ?? null,
      ToDate: this.ToDate ?? null,
      ProcessOutNo: this.VoucherNo ?? ""
    }
    this.processoutService.Get(model).then(users => {

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
      this.OrderList = this.OrderList.filter(obj => obj.ProcessOutID !== item.ProcessOutID);

      this.processoutService.Delete(<number>item.ProcessOutID).subscribe(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '');
        }
        else {
          this.toastr.success(item.ProcessOutNo + ' successfully deleted', '', { enableHtml: true, closeButton: true });
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
    const FileName: string = "ProcessOut_" + todayDate.getDate() + todayDate.getMonth() + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + ".xlsx";

    const filteredData = this.OrderList.map(item => ({
      'Process Out ID': item.ProcessOutID,
      'Process Out No': item.ProcessOutNo,
      'Process Out Date': this.formatDate(item.ProcessOutDate),
      'Process': item.ProcessName,
      'Worker': item.PartyName,
      'Issue Type': item.IssueType,
      'Work Type': item.WorkType,
      'Start Date': this.formatDate(item.StartDate),
      'End Date': this.formatDate(item.EndDate),
      'DueDays': item.DueDays,
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

  OpenProcessOut(ProcessOutID: number) {
     this.IsAddNew = true;
      this.ProcessOutAdd?.OpenProcessOut(ProcessOutID);
  }

  ProcessOutBackEvent(){
    this.IsAddNew = false;
  }
  PrintRow(item: any) {
    this.IsPrint = true;
    this.ProcessOutPrint?.OpenProcessOut(item.ProcessOutID);
  }
  PrintClose_Click(){
    this.IsPrint = false;
  }

}
