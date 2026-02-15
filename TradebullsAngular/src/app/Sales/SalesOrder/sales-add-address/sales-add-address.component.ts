import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, output } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PartyAddress_ViewModel } from '../../../Models/Masters/PartyModel'
import { PartyAddress_AddModel } from '../../../Models/Masters/PartyModel'
import { AddressTypeMaster_ViewModel } from '../../../Models/Masters/AddressTypeModel';
import { PartyAddComponent } from '../../../Masters/Party/party-add/party-add.component';
import { LocationService } from '../../../services/Masters/location.service';
import { Select2 } from 'ng-select2-component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-sales-add-address',
  templateUrl: './sales-add-address.component.html',
  styleUrl: './sales-add-address.component.css'
})
export class SalesAddAddressComponent  implements OnInit {

  AddressData: {
          FirstName:string,
          LastName:string,
          Address1:string,
          Address2:string,
          CountryID: number,
          StateID: number,
          CityID: number,
          CountryName: string,
          StateName: string,
          CityName: string,
          Postcode:string,
          EmailID:string,
          PhoneNo:string
    } = {
      FirstName:"",
          LastName:"",
          Address1:"",
          Address2:"",
          CountryID: 0,
          StateID: 0,
          CityID: 0,
          CountryName: "",
          StateName: "",
          CityName: "",
          Postcode:"",
          EmailID:"",
          PhoneNo:""
    }
  
  
  lstCountrys: any[] = [];
  lstStates: any[] = [];
  lstCitys: any[] = [];
  IsDropdownEventCall: boolean = true;

  @Output() GetAddressDataEvent = new EventEmitter<{
    FirstName:string,
    LastName:string,
    Address1:string,
    Address2:string,
    CountryID: number,
    StateID: number,
    CityID: number,
    CountryName: string,
    StateName: string,
    CityName: string,
    Postcode:string,
    EmailID:string,
    PhoneNo:string
} >();
  @Output() StateChanged = new EventEmitter<MatSelectChange>();
  @Output() CloseEvent = new EventEmitter<void>();
  @ViewChild("country") cntCountry?: Select2;

  constructor(private fb: FormBuilder, private router: Router,
    private toastr: ToastrService,
  private locationService: LocationService) {
  }
  ngOnInit(): void {
    this.FillCountry();
    this.FillState();
    this.FillCity();
  }

  
  GetAddressData(): any {
      return this.AddressData;
  }

  
   async FillAddressData(model: {
    FirstName:string,
    LastName:string,
    Address1:string,
    Address2:string,
    CountryID: number,
    StateID: number,
    CityID: number,
    CountryName: string,
    StateName: string,
    CityName: string,
    Postcode:string,
    EmailID:string,
    PhoneNo:string
} | undefined) {
 
      this.IsDropdownEventCall = false;
      this.AddressData.FirstName = model ? model.FirstName : "";
      this.AddressData.LastName = model ? model.LastName : "";
      this.AddressData.Address1 = model ? model.Address1 : "";
      this.AddressData.Address2 = model ? model.Address2 : "";
      this.AddressData.CountryID = model ? model.CountryID : 0;
      this.AddressData.StateID = model ? model.StateID : 0;
      this.AddressData.CityID = model ? model.CityID : 0;
      this.AddressData.CountryName = model ? model.CountryName : "";
      this.AddressData.StateName = model ? model.StateName : "";
      this.AddressData.CityName = model ? model.CityName : "";
      this.AddressData.Postcode = model ? model.Postcode : "";
      this.AddressData.EmailID = model ? model.EmailID : "";
      this.AddressData.PhoneNo = model ? model.PhoneNo : "";

      this.AddressData.CountryID = Number(model ? model.CountryID : 0);
      this.AddressData.CountryName = String(model ? model.CountryName : '');
      this.FillState().then(
        () => {
          this.AddressData.StateID = Number(model ? model.StateID : 0);
          this.AddressData.StateName = String(model ? model.StateName : '');
          
          this.FillCity().then(() => {
            this.AddressData.CityID = Number(model ? model.CityID : 0);
            this.AddressData.CityName = String(model ? model.CityName : '');
            this.IsDropdownEventCall = true;
          });
        }
      );
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
     if(this.AddressData.CountryID > 0)
    {
      await this.locationService.GetState(this.AddressData.CountryID, 0).then(users => {

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
      this.AddressData.StateID = 0;
      this.AddressData.StateName = "";
    }
    
  }
  async FillCity() {
    if(this.AddressData.CountryID > 0 && this.AddressData.StateID > 0)
    {
      await this.locationService.GetCity(this.AddressData.CountryID, this.AddressData.StateID, 0).then(users => {

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
      this.AddressData.CityID = 0;
      this.AddressData.CityName = "";
    }
    
  }

  CountryDropdownSelectionChange(event: MatSelectChange)
  {
    if (event) 
    {  
      console.log('Selection changed:', event);
      this.AddressData.CountryID = event.value;
      //this.AddressData.CountryName = event.options[0].data.CountryName;
      this.AddressData.StateID = 0;
      this.AddressData.StateName = "";
      this.FillState();
    }
  }
  StateDropdownSelectionChange(event: MatSelectChange)
  {
    if (event) 
    {  
      this.AddressData.StateID = event.value;
      //this.AddressData.StateName = event.options[0].data.StateName;
      this.AddressData.CityID = 0;
      this.AddressData.CityName = "";
      this.FillCity();
      this.StateChanged.emit(event);
    }
  }
  
FormClear(){
  this.AddressData ={
    FirstName:"",
    LastName:"",
    Address1:"",
    Address2:"",
    CountryID: 0,
    StateID: 0,
    CityID: 0,
    CountryName: "",
    StateName: "",
    CityName: "",
    Postcode:"",
    EmailID:"",
    PhoneNo:""
  }
}

}
