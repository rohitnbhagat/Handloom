import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../../../services/Masters/location.service';
import { ToastrService } from 'ngx-toastr';
import { CountryMaster_AddModel } from '../../../Models/Masters/LocationModel';

@Component({
  selector: 'app-country-add',
  templateUrl: './country-add.component.html',
  styleUrl: './country-add.component.css'
})
export class CountryAddComponent {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Credit Type";

  Usermodel: CountryMaster_AddModel = new CountryMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private locationService: LocationService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: CountryMaster_AddModel = new CountryMaster_AddModel();
      loginmodel.CountryID = Number(this.UserForm.controls.CountryID.value);
      loginmodel.CountryName = this.UserForm.controls.CountryName.value;
      loginmodel.CountryCode = this.UserForm.controls.CountryCode.value;

      this.locationService.CreateCountry(loginmodel).subscribe(data => {
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

  FillUser(CountryID: number = 0) {
    if (CountryID > 0) {
      this.locationService.GetCountry(CountryID).then(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              CountryID: [user.data[0].CountryID],
              CountryCode: [user.data[0].CountryCode, Validators.required],
              CountryName: [user.data[0].CountryName, Validators.required]
            }   
          );
          this.isModalOpen = true;
        }
      );
    }
    else {
      this.UserForm = this.fb.group(
        {
          CountryID: [0],
          CountryCode: ["", Validators.required],
          CountryName: ["", Validators.required]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(CountryID: number = 0) {
    if(CountryID > 0)
      this.header = "Edit Country";
    else
      this.header = "Create Country";
    this.FillUser(CountryID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }

  

}
