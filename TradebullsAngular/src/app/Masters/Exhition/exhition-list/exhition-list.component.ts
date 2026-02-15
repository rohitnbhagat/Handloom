import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExhitionService } from '../../../services/Masters/exhition.service';
import { ExhitionMaster_ViewModel } from '../../../Models/Masters/ExhitionModel';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { ExhitionAddComponent } from '../../Exhition/exhition-add/exhition-add.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exhition-list',
  templateUrl: './exhition-list.component.html',
  styleUrl: './exhition-list.component.css'
})
export class ExhitionListComponent  implements AfterViewInit {

  displayedColumns = ['ExhitionID', 'ExhitionName', 'Remarks','ModifiedByName', 'ModifiedDate', 'Actions'];
  dataSource: MatTableDataSource<ExhitionMaster_ViewModel> = new MatTableDataSource<ExhitionMaster_ViewModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  UserList!: ExhitionMaster_ViewModel[];
  IsCheckboxinit: boolean = false;
  @ViewChild("usercomp") usercomp?: ExhitionAddComponent;

  isLoading:boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private exhitionService: ExhitionService, private toastr: ToastrService, private el: ElementRef) {
  }

  ngAfterViewInit() {
    this.loadUsers();
  }

  loadUsers(isReload: boolean = false) {
    this.isLoading = true;
    this.exhitionService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
        this.isLoading = false;
      }
      else {
        this.UserList = d.data;
        this.dataSource = new MatTableDataSource(this.UserList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }

    });
  }

  EditRow(item: any) {
    this.UserList = this.UserList.filter(obj => obj.ExhitionID !== item.ExhitionID);
  }
  DeleteRow(item: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.UserList = this.UserList.filter(obj => obj.ExhitionID !== item.ExhitionID);

      this.exhitionService.Delete(<number>item.ExhitionID).subscribe(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '');
        }
        else {
          this.toastr.success(item.ExhitionName + ' successfully deleted', '', { enableHtml: true, closeButton: true });
          this.loadUsers(true);
        }

      });
    }
  }


  CreateUser(ExhitionID: number = 0) {
    this.usercomp?.OpenModel(ExhitionID);
  }
  formatDate(date?: Date): string {
    if(date)
    {
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
    }else{
      return "";
    }
  }
  ExportToExcel(){
    const todayDate = new Date();
    const FileName:string = "Exhition_"+ todayDate.getDate() + todayDate.getMonth() + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + ".xlsx";

    const filteredData = this.UserList.map(item => ({
      ID: item.ExhitionID,
      'Exhition Name': item.ExhitionName,
      'Remarks': item.Remarks,
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

}

