import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressTypeService } from '../../../services/Masters/addressType.service';
import { ToastrService } from 'ngx-toastr';
import { AddressTypeMaster_AddModel } from '../../../Models/Masters/AddressTypeModel'

@Component({
  selector: 'app-address-type-add',
  templateUrl: './address-type-add.component.html',
  styleUrl: './address-type-add.component.css'
})
export class AddressTypeAddComponent {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Address Type";

  Usermodel: AddressTypeMaster_AddModel = new AddressTypeMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private addressTypeService: AddressTypeService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: AddressTypeMaster_AddModel = new AddressTypeMaster_AddModel();
      loginmodel.AddressTypeID = Number(this.UserForm.controls.AddressTypeID.value);
      loginmodel.AddressTypeName = this.UserForm.controls.AddressTypeName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.addressTypeService.Create(loginmodel).subscribe(data => {
        console.log(data);
        let d:any = data;
        if(!d.success)
        {
          this.toastr.error(d.message, '',{enableHtml: true, closeButton: true });
        }
        else
        {
          this.toastr.success(d.message, '',{enableHtml: true, closeButton: true });
          this.SaveEvent.emit();
          this.CloseModel();
        }
      },
      error => {
        console.log(error);
        this.toastr.error(error.error.message, '');
    }
      );


      
    }
  }

  FillUser(AddressTypeID: number = 0) {
    if (AddressTypeID > 0) {
      this.addressTypeService.Get(AddressTypeID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              AddressTypeID: [user.data[0].AddressTypeID],
              AddressTypeName: [user.data[0].AddressTypeName, Validators.required],
              Remarks: [user.data[0].Remarks],
            }   
          );
          this.isModalOpen = true;
        }
      );
    }
    else {
      this.UserForm = this.fb.group(
        {
          AddressTypeID: [0],
          AddressTypeName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(AddressTypeID: number = 0) {
    if(AddressTypeID > 0)
      this.header = "Edit Address Type";
    else
      this.header = "Create Address Type";
    this.FillUser(AddressTypeID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
