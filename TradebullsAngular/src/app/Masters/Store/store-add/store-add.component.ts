import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../services/Masters/store.service';
import { ToastrService } from 'ngx-toastr';
import { StoreMaster_AddModel, StoreLocationMaster_AddModel } from '../../../Models/Masters/StoreModel'

@Component({
  selector: 'app-store-add',
  templateUrl: './store-add.component.html',
  styleUrl: './store-add.component.css'
})
export class StoreAddComponent {

  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Store";

  Usermodel: StoreMaster_AddModel = new StoreMaster_AddModel();
  StoreLocations: StoreLocationMaster_AddModel[] = [];

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private storeService: StoreService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: StoreMaster_AddModel = new StoreMaster_AddModel();
      loginmodel.StoreID = Number(this.UserForm.controls.StoreID.value);
      loginmodel.StoreName = this.UserForm.controls.StoreName.value;
      loginmodel.Address1 = this.UserForm.controls.Address1.value;
      loginmodel.Address2 = this.UserForm.controls.Address2.value;
      loginmodel.City = this.UserForm.controls.City.value;
      loginmodel.State = this.UserForm.controls.State.value;
      loginmodel.Postcode = this.UserForm.controls.Postcode.value;
      loginmodel.Country = this.UserForm.controls.Country.value;
      loginmodel.EmailID = this.UserForm.controls.EmailID.value;
      loginmodel.PhoneNo = this.UserForm.controls.PhoneNo.value;
      loginmodel.ContactPerson = this.UserForm.controls.ContactPerson.value;
      loginmodel.Locations = this.StoreLocations.filter(t=> (t.LocationName) ? t.LocationName.length : 0 > 0);

      this.storeService.Create(loginmodel).subscribe(data => {
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

  FillUser(StoreID: number = 0) {
    const _this = this;
    if (StoreID > 0) {
      this.storeService.Get(StoreID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              StoreID: [user.data[0].StoreID],
              StoreName: [user.data[0].StoreName, Validators.required],
              Address1: [user.data[0].Address1],
              Address2: [user.data[0].Address2],
              City: [user.data[0].City],
              State: [user.data[0].State],
              Postcode: [user.data[0].Postcode],
              Country: [user.data[0].Country],
              EmailID: [user.data[0].EmailID],
              PhoneNo: [user.data[0].PhoneNo],
              ContactPerson: [user.data[0].ContactPerson]
            }   
          );

          _this.storeService.GetLocation(StoreID).subscribe(
            data => {
              const result:any = data;
              if(result.success)
              {
                  this.StoreLocations = result.data;
                  this.StoreLocations.forEach( (l, index) => {
                    l.SrNo = index + 1;
                  });
              }
            });

          this.isModalOpen = true;
        }
      );
    }
    else {
      this.UserForm = this.fb.group(
        {
          StoreID: [0],
          StoreName: ["", Validators.required],
          Address1: [""],
          Address2: [""],
          City: [""],
          State: [""],
          Postcode: [""],
          Country: [""],
          EmailID: [""],
          PhoneNo: [""],
          ContactPerson: [""]
        }
      );
      this.StoreLocations = [];
      this.isModalOpen = true;
    }
  }

  OpenModel(StoreID: number = 0) {
    if(StoreID > 0)
      this.header = "Edit Store";
    else
      this.header = "Create Store";
    this.FillUser(StoreID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }

  AddRow(){
    const count:number = this.StoreLocations.length;
    let location: StoreLocationMaster_AddModel = { SrNo : count + 1, StoreLocationID: 0, LocationCode : "",LocationName: ""  };
    this.StoreLocations.push(location);
  }

  DeleteRow(location: StoreLocationMaster_AddModel){
    this.StoreLocations =  this.StoreLocations.filter(t=>t.SrNo != location.SrNo);
    this.StoreLocations.forEach( (l, index) => {
      l.SrNo = index + 1;
    });
  }

}
