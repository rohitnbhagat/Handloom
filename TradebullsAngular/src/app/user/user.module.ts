import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { DataTablesModule } from 'angular-datatables';
import { UsergroupListComponent } from './usergroup-list/usergroup-list.component';
import { UsergroupCreateComponent } from './usergroup-create/usergroup-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsergroupAdduserComponent } from './usergroup-adduser/usergroup-adduser.component';

@NgModule({
  declarations: [
    UserListComponent,
    CreateuserComponent,
    UsergroupListComponent,
    UsergroupCreateComponent,
    UsergroupAdduserComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class UserModule { }
