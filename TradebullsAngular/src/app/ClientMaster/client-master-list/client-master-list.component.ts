import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { ClientListModel } from '../../Models/ClientListModel';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { ToggleOnOffComponent } from '../../controls/toggle-on-off/toggle-on-off.component';
import { ModelComponent } from '../../controls/model/model.component';
import { ClientMasterCreateComponent } from '../../ClientMaster/client-master-create/client-master-create.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-client-master-list',
  templateUrl: './client-master-list.component.html',
  styleUrl: './client-master-list.component.css'
})
export class ClientMasterListComponent  implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['ClientCode', 'ClientName', 'DematAccountNo', 'EmailID', 'IsActive', "IsLocked", 'actions'];
  dataSource: MatTableDataSource<ClientListModel> = new MatTableDataSource<ClientListModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  UserList!: ClientListModel[];
  IsCheckboxinit: boolean = false;
  @ViewChild("usercomp") usercomp?: ClientMasterCreateComponent;

  isLoading:boolean = false;
  

  constructor(private fb: FormBuilder, private router: Router, private clientService: ClientService, private toastr: ToastrService, private el: ElementRef) {
    
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.loadUsers();
  }

  updateCheckedStatus(clientID: number, newValue: boolean) {
    
    this.isLoading = true;
    this.clientService.LockUnlock(clientID).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '');
      }
      else {
        if (newValue)
          this.toastr.success('Successfully locked', '', {
            enableHtml: true,
            closeButton: true
          });
        else
          this.toastr.success('Successfully unlocked', '', {
            enableHtml: true,
            closeButton: true
          });
      }
      this.isLoading = false;
    });

  }


  loadUsers(isReload: boolean = false) {
    this.isLoading = true;
    this.clientService.Get(0).subscribe(users => {

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
    this.UserList = this.UserList.filter(obj => obj.ClientID !== item.ClientID);
  }
  DeleteRow(item: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.UserList = this.UserList.filter(obj => obj.ClientID !== item.ClientID);

      this.clientService.Delete(<number>item.ClientID).subscribe(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '');
        }
        else {
          this.toastr.success(item.ClientCode + ' successfully deleted', '', { enableHtml: true, closeButton: true });
          this.loadUsers();
        }

      });
    }
  }


  CreateUser(ClientID: number = 0) {
    this.usercomp?.OpenModel(ClientID);
  }

}
