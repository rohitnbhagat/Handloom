import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../../../services/Masters/location.service';
import { ToastrService } from 'ngx-toastr';
import { StateMaster_AddModel } from '../../../Models/Masters/LocationModel'

@Component({
  selector: 'app-state-add',
  templateUrl: './state-add.component.html',
  styleUrl: './state-add.component.css'
})
export class StateAddComponent implements OnInit {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create State";
  lstCountrys: any[] = [];
  CountryID: number = 0;

  Usermodel: StateMaster_AddModel = new StateMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private locationService: LocationService, private toastr: ToastrService) {
  }
  ngOnInit(): void {
    this.FillCountry();
  }

  FillCountry() {
    this.locationService.GetCountry(0).then(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstCountrys = a.map((party) => ({
          value: party.CountryID,
          label: party.CountryName,
          data: party,
        }));

        this.lstCountrys.unshift({
          value: 0,
          label: "Please Select",
          data: { CountryID: 0, CountryName: "Please Select" },
        });

      }

    });
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: StateMaster_AddModel = new StateMaster_AddModel();
      loginmodel.StateID = Number(this.UserForm.controls.StateID.value);
      loginmodel.CountryID = this.CountryID;
      loginmodel.StateName = this.UserForm.controls.StateName.value;
      loginmodel.StateCode = this.UserForm.controls.StateCode.value;

      this.locationService.CreateState(loginmodel).subscribe(data => {
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

  FillUser(StateID: number = 0) {
    if (StateID > 0) {
      this.locationService.GetState(0, StateID).then(
        loginData => {
          let user: any = loginData;
          this.CountryID = user.data[0].CountryID;
          this.UserForm = this.fb.group(
            {
              StateID: [user.data[0].StateID],
              CountryID: [user.data[0].CountryID, Validators.required],
              StateCode: [user.data[0].StateCode, Validators.required],
              StateName: [user.data[0].StateName, Validators.required]
            }   
          );
          this.isModalOpen = true;
        }
      );
    }
    else {
      this.CountryID = 0;
      this.UserForm = this.fb.group(
        {
          StateID: [0],
          CountryID: [0, Validators.required],
          StateCode: ["", Validators.required],
          StateName: ["", Validators.required]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(StateID: number = 0) {
    if(StateID > 0)
      this.header = "Edit State";
    else
      this.header = "Create State";
    this.FillUser(StateID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
  CountryDropdownSelectionChange(event: any)
  {
    if (event && event.options) 
      this.CountryID = event.options[0].data.CountryID;
  }

}
