import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../../../services/Masters/location.service';
import { ToastrService } from 'ngx-toastr';
import { CityMaster_AddModel } from '../../../Models/Masters/LocationModel'

@Component({
  selector: 'app-city-add',
  templateUrl: './city-add.component.html',
  styleUrl: './city-add.component.css'
})
export class CityAddComponent implements OnInit {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create City";
  lstCountrys: any[] = [];
  lstStates: any[] = [];
  CountryID: number = 0;
  StateID: number = 0;

  Usermodel: CityMaster_AddModel = new CityMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private locationService: LocationService, private toastr: ToastrService) {
  }
  ngOnInit(): void {
    this.FillCountry();
    this.FillState();
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
  FillState() {
    if(this.CountryID > 0)
    {
      this.locationService.GetState(this.CountryID, 0).then(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          const a: any[] = d.data;
  
          this.lstStates = a.map((party) => ({
            value: party.StateID,
            label: party.StateName,
            data: party,
          }));
  
          this.lstStates.unshift({
            value: 0,
            label: "Please Select",
            data: { StateID: 0, StateName: "Please Select" },
          });
  
        }
  
      });
    }
    else
    {
      this.lstStates = [];
      this.lstStates.push({
        value: 0,
        label: "Please Select",
        data: { StateID: 0, StateName: "Please Select" },
      });
      this.StateID = 0;

    }
    
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: CityMaster_AddModel = new CityMaster_AddModel();
      loginmodel.CityID = Number(this.UserForm.controls.CityID.value);
      loginmodel.CountryID = this.CountryID;
      loginmodel.StateID = this.StateID;
      loginmodel.CityName = this.UserForm.controls.CityName.value;

      this.locationService.CreateCity(loginmodel).subscribe(data => {
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

  FillUser(CityID: number = 0) {
    if (CityID > 0) {
      this.locationService.GetCity(0, 0, CityID).then(
        loginData => {
          let user: any = loginData;
          this.CountryID = user.data[0].CountryID;
          this.FillState();
          this.StateID = user.data[0].StateID;
          this.UserForm = this.fb.group(
            {
              CityID: [user.data[0].CityID],
              CountryID: [user.data[0].CountryID, Validators.required],
              StateID: [user.data[0].StateID, Validators.required],
              CityName: [user.data[0].CityName, Validators.required]
            }   
          );
          this.isModalOpen = true;
        }
      );
    }
    else {
      this.CountryID = 0;
      this.StateID = 0;
      this.UserForm = this.fb.group(
        {
          CityID: [0],
          CountryID: [0, Validators.required],
          StateID: [0, Validators.required],
          CityName: ["", Validators.required]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(CityID: number = 0) {
    if(CityID > 0)
      this.header = "Edit City";
    else
      this.header = "Create City";
    this.FillUser(CityID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
  CountryDropdownSelectionChange(event: any)
  {
    if (event && event.options) 
    {  
      this.CountryID = event.options[0].data.CountryID;
      this.FillState();
    }
  }
  StateDropdownSelectionChange(event: any)
  {
    if (event && event.options) 
      this.StateID = event.options[0].data.StateID;
  }

}
