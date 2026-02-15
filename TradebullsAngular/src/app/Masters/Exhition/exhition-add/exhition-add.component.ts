import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExhitionService } from '../../../services/Masters/exhition.service';
import { ToastrService } from 'ngx-toastr';
import { ExhitionMaster_AddModel } from '../../../Models/Masters/ExhitionModel'

@Component({
  selector: 'app-exhition-add',
  templateUrl: './exhition-add.component.html',
  styleUrl: './exhition-add.component.css'
})
export class ExhitionAddComponent {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Exhition";

  Usermodel: ExhitionMaster_AddModel = new ExhitionMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private exhitionService: ExhitionService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: ExhitionMaster_AddModel = new ExhitionMaster_AddModel();
      loginmodel.ExhitionID = Number(this.UserForm.controls.ExhitionID.value);
      loginmodel.ExhitionName = this.UserForm.controls.ExhitionName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.exhitionService.Create(loginmodel).subscribe(data => {
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

  FillUser(ExhitionID: number = 0) {
    if (ExhitionID > 0) {
      this.exhitionService.Get(ExhitionID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              ExhitionID: [user.data[0].ExhitionID],
              ExhitionName: [user.data[0].ExhitionName, Validators.required],
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
          ExhitionID: [0],
          ExhitionName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(ExhitionID: number = 0) {
    if(ExhitionID > 0)
      this.header = "Edit Exhition";
    else
      this.header = "Create Exhition";
    this.FillUser(ExhitionID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
