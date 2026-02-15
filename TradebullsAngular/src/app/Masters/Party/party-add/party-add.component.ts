import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PartyService } from '../../../services/Masters/party.service';
import { PartyTypeService } from '../../../services/Masters/partyType.service';
import { ToastrService } from 'ngx-toastr';
import { PartyMaster_AddModel, PartyMaster_ViewModel, PartyAddress_AddModel, PartyAddress_ViewModel } from '../../../Models/Masters/PartyModel'
import { PartyTypeMaster_ViewModel } from '../../../Models/Masters/PartyTypeModel'
import { PartyAddressAddComponent } from '../../Party/party-address-add/party-address-add.component';

@Component({
  selector: 'app-party-add',
  templateUrl: './party-add.component.html',
  styleUrl: './party-add.component.css'
})
export class PartyAddComponent implements OnInit {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Party";
  @ViewChild("usercomp") addresscontrol?: PartyAddressAddComponent;
  Usermodel: PartyMaster_AddModel = new PartyMaster_AddModel();
  PartyTypes: PartyTypeMaster_ViewModel[] = [];
  PartyAddress: PartyAddress_ViewModel[] = [];

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();
  

  constructor(private fb: FormBuilder, private router: Router,
    private partyService: PartyService,
    private partyTypeService: PartyTypeService,
    private toastr: ToastrService) {
  }
  async ngOnInit(): Promise<void> {

  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: PartyMaster_AddModel = new PartyMaster_AddModel();
      loginmodel.PartyID = Number(this.UserForm.controls.PartyID.value);
      loginmodel.PartyTypeID = Number(this.UserForm.controls.PartyTypeID.value);
      loginmodel.PartyName = this.UserForm.controls.PartyName.value;
      loginmodel.FirstName = this.UserForm.controls.FirstName.value;
      loginmodel.LastName= this.UserForm.controls.LastName.value;
      loginmodel.PartyCode= this.UserForm.controls.PartyCode.value;
      loginmodel.Alias= this.UserForm.controls.Alias.value;
      loginmodel.EmailID= this.UserForm.controls.EmailID.value;
      loginmodel.GSTNo= this.UserForm.controls.GSTNo.value;
      loginmodel.PANNo= this.UserForm.controls.PANNo.value;
      loginmodel.StateCode= this.UserForm.controls.StateCode.value;
      loginmodel.ECCNo= this.UserForm.controls.ECCNo.value;
      loginmodel.Website= this.UserForm.controls.Website.value;
      loginmodel.BankName= this.UserForm.controls.BankName.value;
      loginmodel.BankAddress= this.UserForm.controls.BankAddress.value;
      loginmodel.BankAccountNo= this.UserForm.controls.BankAccountNo.value;
      loginmodel.BankIFSCCode= this.UserForm.controls.BankIFSCCode.value;
      loginmodel.Remarks= this.UserForm.controls.Remarks.value;
      loginmodel.PartyAddress= this.PartyAddress.map( t=> ({
        PartyAddressID: Number(t.PartyAddressID),
        AddressTypeID: Number(t.AddressTypeID),
        FirstName: t.FirstName,
        LastName: t.LastName,
        Company: t.Company,
        Address1: t.Address1,
        Address2: t.Address2,
        CityID: t.CityID,
        StateID: t.StateID,
        Postcode: t.Postcode,
        CountryID: t.CountryID,
        EmailID: t.EmailID,
        PhoneNo: t.PhoneNo
      }));

  console.log(loginmodel);

      this.partyService.Create(loginmodel).subscribe(data => {
        let d: any = data;
        if (!d.success) {
          this.toastr.error(d.message, '', { enableHtml: true, closeButton: true });
        }
        else {
          this.toastr.success(d.message, '', { enableHtml: true, closeButton: true });
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

  async FillPartyType() {

    await this.partyTypeService.Get().subscribe(
      loginData => {
        let user: any = loginData;
        if (user.success) {
          this.PartyTypes = user.data;
        }
      });

  }

  async FillUser(PartyID: number = 0, partytypeid: number = 0) {
    let party: PartyMaster_ViewModel;
    await this.partyService.GetAddress(PartyID).subscribe(
      data => {
        let s :any= data;
        this.PartyAddress = s.data;
      }
    );
      await this.partyService.Get(PartyID).subscribe(
        loginData => {
          let user: any = loginData;
          if (user.success) {
            party = user.data[0];
          }

           

          this.UserForm = this.fb.group(
            {
              PartyID: [(party ? party.PartyID : 0)],
              PartyTypeID: [(party ? party.PartyTypeID : partytypeid), Validators.required],
              PartyCode: [(party ? party.PartyCode : "")],
              PartyName: [(party ? party.PartyName : ""), Validators.required],
              FirstName: [(party ? party.FirstName : "")],
              LastName: [(party ? party.LastName : "")],
              Alias: [(party ? party.Alias : "")],
              EmailID: [(party ? party.EmailID : "")],
              GSTNo: [(party ? party.GSTNo : "")],
              PANNo: [(party ? party.PANNo : "")],
              StateCode: [(party ? party.StateCode : "")],
              ECCNo: [(party ? party.ECCNo : "")],
              Website: [(party ? party.Website : "")],
              BankName: [(party ? party.BankName : "")],
              BankAddress: [(party ? party.BankAddress : "")],
              BankAccountNo: [(party ? party.BankAccountNo : "")],
              BankIFSCCode: [(party ? party.BankIFSCCode : "")],
              Remarks: [(party ? party.Remarks : "")],
            }
          );
          this.isModalOpen = true;
        }
      );
    
  }

  async OpenModel(PartyID: number = 0, strheader: string = "", partyTypeID:number = 0) {
    await this.FillPartyType();
    if(strheader.length == 0)
    {
    if (PartyID > 0)
      this.header = "Edit Party";
    else
      this.header = "Create Party";
    }
    else
      this.header = strheader;

    await this.FillUser(PartyID, partyTypeID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }

  CreateNewAddress(){
    this.addresscontrol?.OpenModel(undefined);
  }

  EditAddress(model: PartyAddress_ViewModel){
    this.addresscontrol?.OpenModel(model);
  }

  SaveAddress(model: PartyAddress_ViewModel){
    if(model)
    {
      this.PartyAddress = this.PartyAddress.filter(t=>t.AddressTypeID != model.AddressTypeID);
      console.log("Party Add : ", model);
      this.PartyAddress.push(model);
    }
  }

}
