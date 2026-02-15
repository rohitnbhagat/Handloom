import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesLocationService } from '../../../services/Masters/salesLocation.service';
import { ToastrService } from 'ngx-toastr';
import { SalesLocationMaster_AddModel } from '../../../Models/Masters/SalesLocationModel'
@Component({
  selector: 'app-sales-location-add',
  templateUrl: './sales-location-add.component.html',
  styleUrl: './sales-location-add.component.css'
})
export class SalesLocationAddComponent {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Sales Location";

  Usermodel: SalesLocationMaster_AddModel = new SalesLocationMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private salesLocationService: SalesLocationService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: SalesLocationMaster_AddModel = new SalesLocationMaster_AddModel();
      loginmodel.SalesLocationID = Number(this.UserForm.controls.SalesLocationID.value);
      loginmodel.SalesLocationName = this.UserForm.controls.SalesLocationName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.salesLocationService.Create(loginmodel).subscribe(data => {
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

  FillUser(SalesLocationID: number = 0) {
    if (SalesLocationID > 0) {
      this.salesLocationService.Get(SalesLocationID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              SalesLocationID: [user.data[0].SalesLocationID],
              SalesLocationName: [user.data[0].SalesLocationName, Validators.required],
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
          SalesLocationID: [0],
          SalesLocationName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(SalesLocationID: number = 0) {
    if(SalesLocationID > 0)
      this.header = "Edit Sales Location";
    else
      this.header = "Create Sales Location";
    this.FillUser(SalesLocationID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
