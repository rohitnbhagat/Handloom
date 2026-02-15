import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DueDaysService } from '../../../services/Masters/dueDays.service';
import { ToastrService } from 'ngx-toastr';
import { DueDaysMaster_AddModel } from '../../../Models/Masters/DueDaysModel'

@Component({
  selector: 'app-due-days-add',
  templateUrl: './due-days-add.component.html',
  styleUrl: './due-days-add.component.css'
})
export class DueDaysAddComponent {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Due Days";

  Usermodel: DueDaysMaster_AddModel = new DueDaysMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private dueDaysService: DueDaysService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: DueDaysMaster_AddModel = new DueDaysMaster_AddModel();
      loginmodel.DueDaysID = Number(this.UserForm.controls.DueDaysID.value);
      loginmodel.DueDaysName = this.UserForm.controls.DueDaysName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.dueDaysService.Create(loginmodel).subscribe(data => {
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

  FillUser(DueDaysID: number = 0) {
    if (DueDaysID > 0) {
      this.dueDaysService.Get(DueDaysID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              DueDaysID: [user.data[0].DueDaysID],
              DueDaysName: [user.data[0].DueDaysName, Validators.required],
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
          DueDaysID: [0],
          DueDaysName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(DueDaysID: number = 0) {
    if(DueDaysID > 0)
      this.header = "Edit Due Days";
    else
      this.header = "Create Due Days";
    this.FillUser(DueDaysID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
