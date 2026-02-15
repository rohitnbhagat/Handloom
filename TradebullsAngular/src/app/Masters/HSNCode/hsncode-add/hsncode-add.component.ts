import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HSNCodeService } from '../../../services/Masters/hSNCode.service';
import { ToastrService } from 'ngx-toastr';
import { HSNCodeMaster_AddModel } from '../../../Models/Masters/HSNCodeModel'

@Component({
  selector: 'app-hsncode-add',
  templateUrl: './hsncode-add.component.html',
  styleUrl: './hsncode-add.component.css'
})
export class HSNCodeAddComponent {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create HSNCode";

  Usermodel: HSNCodeMaster_AddModel = new HSNCodeMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private hSNCodeService: HSNCodeService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: HSNCodeMaster_AddModel = new HSNCodeMaster_AddModel();
      loginmodel.HSNCodeID = Number(this.UserForm.controls.HSNCodeID.value);
      loginmodel.HSNCodeName = this.UserForm.controls.HSNCodeName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.hSNCodeService.Create(loginmodel).subscribe(data => {
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

  FillUser(HSNCodeID: number = 0) {
    if (HSNCodeID > 0) {
      this.hSNCodeService.Get(HSNCodeID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              HSNCodeID: [user.data[0].HSNCodeID],
              HSNCodeName: [user.data[0].HSNCodeName, Validators.required],
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
          HSNCodeID: [0],
          HSNCodeName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(HSNCodeID: number = 0) {
    if(HSNCodeID > 0)
      this.header = "Edit HSNCode";
    else
      this.header = "Create HSNCode";
    this.FillUser(HSNCodeID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
