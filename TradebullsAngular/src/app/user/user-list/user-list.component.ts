import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserListModel } from '../../Models/UserListModel';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { ToggleOnOffComponent } from '../../controls/toggle-on-off/toggle-on-off.component';
import { ModelComponent } from '../../controls/model/model.component';
import { CreateuserComponent } from '../createuser/createuser.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['ClientCode', 'FullName', 'Gender', 'PhoneNo', 'EmailID', "IsLocked", 'Actions'];
  dataSource: MatTableDataSource<UserListModel> = new MatTableDataSource<UserListModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  UserList!: UserListModel[];
  IsCheckboxinit: boolean = false;
  @ViewChild("usercomp") usercomp?: CreateuserComponent;

  isLoading:boolean = false;
  

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private el: ElementRef) {
    
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.loadUsers();
  }

  updateCheckedStatus(userID: number, newValue: boolean) {
    
    this.isLoading = true;
    this.userService.LockUnlock(userID).subscribe(users => {

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
    this.userService.GetUsers(0, 0).subscribe(users => {

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
    this.UserList = this.UserList.filter(obj => obj.UserID !== item.UserID);
  }
  DeleteRow(item: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.UserList = this.UserList.filter(obj => obj.UserID !== item.UserID);

      this.userService.Delete(<number>item.UserID).subscribe(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '');
        }
        else {
          this.toastr.success(item.FullName + ' successfully deleted', '', { enableHtml: true, closeButton: true });
          this.loadUsers(true);
        }

      });
    }
  }


  CreateUser(UserID: number = 0) {
    this.usercomp?.OpenModel(UserID);
  }

}
