import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PartyTypeService } from '../../../services/Masters/partyType.service';
import { ToastrService } from 'ngx-toastr';
import { PartyTypeMaster_AddModel } from '../../../Models/Masters/PartyTypeModel'

@Component({
  selector: 'app-party-type-add',
  templateUrl: './party-type-add.component.html',
  styleUrl: './party-type-add.component.css'
})
export class PartyTypeAddComponent {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Party Type";

  Usermodel: PartyTypeMaster_AddModel = new PartyTypeMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private partyTypeService: PartyTypeService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: PartyTypeMaster_AddModel = new PartyTypeMaster_AddModel();
      loginmodel.PartyTypeID = Number(this.UserForm.controls.PartyTypeID.value);
      loginmodel.PartyTypeName = this.UserForm.controls.PartyTypeName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.partyTypeService.Create(loginmodel).subscribe(data => {
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

  FillUser(PartyTypeID: number = 0) {
    if (PartyTypeID > 0) {
      this.partyTypeService.Get(PartyTypeID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              PartyTypeID: [user.data[0].PartyTypeID],
              PartyTypeName: [user.data[0].PartyTypeName, Validators.required],
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
          PartyTypeID: [0],
          PartyTypeName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(PartyTypeID: number = 0) {
    if(PartyTypeID > 0)
      this.header = "Edit Party Type";
    else
      this.header = "Create Party Type";
    this.FillUser(PartyTypeID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
