import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../services/client.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoading:boolean = true;
  lstList:{SrNo:number, Title: string, TotalCnt: number }[] = [];
  lstListDetails:any[] = [];
  isModalOpen: boolean = false;
  header: string = '';
  SrNo: number = 0;

  constructor(private fb: FormBuilder, private router: Router, private clientService: ClientService, private toastr: ToastrService, private el: ElementRef) {
  }
  ngOnInit(): void {
    this.loadPendingCounts();    
  }

  loadPendingCounts(isReload: boolean = false) {
    this.isLoading = true;
    this.clientService.Dashboard_GetPendingCounts().subscribe(users => {
      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
        this.isLoading = false;
      }
      else {
        this.lstList = d.data;
        this.isLoading = false;
      }

    });
  }

  OpenList(item:any){
    this.isLoading = true;
    this.clientService.Dashboard_GetPendingCountsDetails(item.SrNo).subscribe(users => {
      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
        this.isLoading = false;
      }
      else {
        this.lstListDetails = d.data;
        this.isLoading = false;
        this.SrNo = item.SrNo;
        this.header = item.Title;
        this.isModalOpen = true;
      }

    });
  }

  CloseModel(){
    this.lstListDetails = [];
    this.header = '';
    this.isModalOpen = false;
    this
  }


}
