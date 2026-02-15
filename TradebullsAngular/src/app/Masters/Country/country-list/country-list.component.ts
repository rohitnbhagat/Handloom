import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../../../services/Masters/location.service';
import { CountryMaster_ViewModel } from '../../../Models/Masters/LocationModel';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { CountryAddComponent } from '../../Country/country-add/country-add.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.css'
})
export class CountryListComponent  implements AfterViewInit {

  displayedColumns = ['CountryID', 'CountryCode', 'CountryName','ModifiedByName', 'ModifiedDate', 'Actions'];
  dataSource: MatTableDataSource<CountryMaster_ViewModel> = new MatTableDataSource<CountryMaster_ViewModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  UserList!: CountryMaster_ViewModel[];
  IsCheckboxinit: boolean = false;
  @ViewChild("usercomp") usercomp?: CountryAddComponent;

  isLoading:boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private locationService: LocationService, private toastr: ToastrService, private el: ElementRef) {
  }

  ngAfterViewInit() {
    this.loadUsers();
  }

  loadUsers(isReload: boolean = false) {
    this.isLoading = true;
    this.locationService.GetCountry(0).then(users => {

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
    this.UserList = this.UserList.filter(obj => obj.CountryID !== item.CountryID);
  }
  DeleteRow(item: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.UserList = this.UserList.filter(obj => obj.CountryID !== item.CountryID);

      this.locationService.DeleteCountry(<number>item.CountryID).subscribe(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '');
        }
        else {
          this.toastr.success(item.CountryName + ' successfully deleted', '', { enableHtml: true, closeButton: true });
          this.loadUsers(true);
        }

      });
    }
  }

  CreateUser(CountryID: number = 0) {
    this.usercomp?.OpenModel(CountryID);
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
    const FileName:string = "Country_"+ todayDate.getDate() + todayDate.getMonth() + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + ".xlsx";

    const filteredData = this.UserList.map(item => ({
      ID: item.CountryID,
      'Country Code': item.CountryCode,
      'Country Name': item.CountryName,
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
