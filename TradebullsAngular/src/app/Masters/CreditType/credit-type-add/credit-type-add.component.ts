import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CreditTypeService } from '../../../services/Masters/creditType.service';
import { ToastrService } from 'ngx-toastr';
import { CreditTypeMaster_AddModel } from '../../../Models/Masters/CreditTypeModel'

@Component({
  selector: 'app-credit-type-add',
  templateUrl: './credit-type-add.component.html',
  styleUrl: './credit-type-add.component.css'
})
export class CreditTypeAddComponent {

  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Credit Type";

  Usermodel: CreditTypeMaster_AddModel = new CreditTypeMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private creditTypeService: CreditTypeService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: CreditTypeMaster_AddModel = new CreditTypeMaster_AddModel();
      loginmodel.CreditTypeID = Number(this.UserForm.controls.CreditTypeID.value);
      loginmodel.CreditTypeName = this.UserForm.controls.CreditTypeName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.creditTypeService.Create(loginmodel).subscribe(data => {
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

  FillUser(CreditTypeID: number = 0) {
    if (CreditTypeID > 0) {
      this.creditTypeService.Get(CreditTypeID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              CreditTypeID: [user.data[0].CreditTypeID],
              CreditTypeName: [user.data[0].CreditTypeName, Validators.required],
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
          CreditTypeID: [0],
          CreditTypeName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(CreditTypeID: number = 0) {
    if(CreditTypeID > 0)
      this.header = "Edit Credit Type";
    else
      this.header = "Create Credit Type";
    this.FillUser(CreditTypeID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }

  


}
