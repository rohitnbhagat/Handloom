import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressTypeService } from '../../../services/Masters/addressType.service';
import { ToastrService } from 'ngx-toastr';
import { PartyAddress_ViewModel } from '../../../Models/Masters/PartyModel'
import { PartyAddress_AddModel } from '../../../Models/Masters/PartyModel'
import { AddressTypeMaster_ViewModel } from '../../../Models/Masters/AddressTypeModel';
import { PartyAddComponent } from '../../Party/party-add/party-add.component';
import { LocationService } from '../../../services/Masters/location.service';
import { Select2 } from 'ng-select2-component';

@Component({
  selector: 'app-party-address-add',
  templateUrl: './party-address-add.component.html',
  styleUrl: './party-address-add.component.css'
})
export class PartyAddressAddComponent implements OnInit {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Add Party Address";
  CountryID: number = 0;
  StateID: number = 0;
  CityID: number = 0;
  CountryName: string = "";
  StateName: string = "";
  CityName: string = "";

  AddressTypes: AddressTypeMaster_ViewModel[] = [];
  lstCountrys: any[] = [];
  lstStates: any[] = [];
  lstCitys: any[] = [];
  IsDropdownEventCall: boolean = true;

  @Output() SaveEvent = new EventEmitter<PartyAddress_ViewModel>();
  @Output() CloseEvent = new EventEmitter<void>();
  @ViewChild("country") cntCountry?: Select2;

  constructor(private fb: FormBuilder, private router: Router,
    private addressTypeService: AddressTypeService,
    private toastr: ToastrService,
  private locationService: LocationService) {
  }
  ngOnInit(): void {
    this.FillCountry();
    this.FillState();
    this.FillCity();
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: PartyAddress_ViewModel = new PartyAddress_ViewModel();
      loginmodel.PartyAddressID = Number(this.UserForm.controls.PartyAddressID.value);
      loginmodel.AddressTypeID = this.UserForm.controls.AddressTypeID.value;
      loginmodel.AddressTypeName = this.AddressTypes.filter(t=>t.AddressTypeID == this.UserForm.controls.AddressTypeID.value)[0].AddressTypeName;
      loginmodel.FirstName = this.UserForm.controls.FirstName.value;
      loginmodel.LastName = this.UserForm.controls.LastName.value;
      loginmodel.Company = this.UserForm.controls.Company.value;
      loginmodel.Address1 = this.UserForm.controls.Address1.value;
      loginmodel.Address2 = this.UserForm.controls.Address2.value;
      loginmodel.CityID = this.CityID;
      loginmodel.CityName = this.CityName;
      loginmodel.StateID = this.StateID;
      loginmodel.StateName = this.StateName;
      loginmodel.Postcode = this.UserForm.controls.Postcode.value;
      loginmodel.CountryID = this.CountryID;
      loginmodel.CountryName = this.CountryName;
      loginmodel.EmailID = this.UserForm.controls.EmailID.value;
      loginmodel.PhoneNo = this.UserForm.controls.PhoneNo.value;

      this.SaveEvent.emit(loginmodel);
      this.CloseModel();
    }
  }

  async FillAddressType() {

    await this.addressTypeService.Get().subscribe(
      loginData => {
        let user: any = loginData;
        if (user.success) {
          this.AddressTypes = user.data;
        }
      });

  }

   async FillUser(model: PartyAddress_ViewModel | undefined) {
      this.IsDropdownEventCall = false;
      this.CountryID = Number(model ? model.CountryID : 0);
      this.CountryName = String(model ? model.CountryName : '');
      this.FillState().then(
        () => {
          this.StateID = Number(model ? model.StateID : 0);
          this.StateName = String(model ? model.StateName : '');
          
          this.FillCity().then(() => {
            this.CityID = Number(model ? model.CityID : 0);
            this.CityName = String(model ? model.CityName : '');
            this.IsDropdownEventCall = true;
          });
        }
      );
      
      

      this.UserForm = this.fb.group(
        {
          PartyAddressID: [(model ? model.PartyAddressID : 0)],
          AddressTypeID: [(model ? model.AddressTypeID : 0), Validators.required],
          FirstName: [(model ? model.FirstName : "")],
          LastName: [(model ? model.LastName : "")],
          Company: [(model ? model.Company : "")],
          Address1: [(model ? model.Address1 : ""), Validators.required],
          Address2: [(model ? model.Address2 : "")],
          City: [(model ? model.CityName : "")],
          State: [(model ? model.StateName : "")],
          Postcode: [(model ? model.Postcode : "")],
          Country: [(model ? model.CountryName : "")],
          EmailID: [(model ? model.EmailID : "")],
          PhoneNo: [(model ? model.PhoneNo : "")],
        }
      );
      this.isModalOpen = true;

  }

  async OpenModel(model: PartyAddress_ViewModel | undefined) {
    await this.FillAddressType();
    if (model)
      this.header = "Edit Party Address";
    else
      this.header = "Add Party Address";
    await this.FillUser(model);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }

  async FillCountry() {
    await this.locationService.GetCountry(0).then(users => {
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
  async FillState() {
     if(this.CountryID > 0)
    {
      await this.locationService.GetState(this.CountryID, 0).then(users => {

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
      this.StateName = "";
    }
    
  }
  async FillCity() {
    if(this.CountryID > 0 && this.StateID > 0)
    {
      await this.locationService.GetCity(this.CountryID, this.StateID, 0).then(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          const a: any[] = d.data;
  
          this.lstCitys = a.map((party) => ({
            value: party.CityID,
            label: party.CityName,
            data: party,
          }));
  
          this.lstCitys.unshift({
            value: 0,
            label: "Please Select",
            data: { CityID: 0, CityName: "Please Select" },
          });
  
        }
  
      });
    }
    else
    {
      this.lstCitys = [];
      this.lstCitys.push({
        value: 0,
        label: "Please Select",
        data: { CityID: 0, CityName: "Please Select" },
      });
      this.CityID = 0;
      this.CityName = "";
    }
    
  }

  CountryDropdownSelectionChange(event: any)
  {
    if (event && event.options && this.IsDropdownEventCall) 
    {  
      this.CountryID = event.options[0].data.CountryID;
      this.CountryName = event.options[0].data.CountryName;
      this.StateID = 0;
      this.StateName = "";
      this.FillState();
    }
  }
  StateDropdownSelectionChange(event: any)
  {
    if (event && event.options && this.IsDropdownEventCall) 
    {  
      this.StateID = event.options[0].data.StateID;
      this.StateName = event.options[0].data.StateName;
      this.CityID = 0;
      this.CityName = "";
      this.FillCity();
    }
  }
  CityDropdownSelectionChange(event: any)
  {
    if (event && event.options && this.IsDropdownEventCall) 
    {  
      this.CityID = event.options[0].data.CityID;
      this.CityName = event.options[0].data.CityName;
    }
  }
}
