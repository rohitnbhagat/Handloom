import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcessService } from '../../../services/Masters/process.service';
import { ToastrService } from 'ngx-toastr';
import { ProcessMaster_AddModel } from '../../../Models/Masters/ProcessModel'
@Component({
  selector: 'app-process-add',
  templateUrl: './process-add.component.html',
  styleUrl: './process-add.component.css'
})
export class ProcessAddComponent {
UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Process";
  Usermodel: ProcessMaster_AddModel = new ProcessMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private ProcessService: ProcessService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: ProcessMaster_AddModel = new ProcessMaster_AddModel();
      loginmodel.ProcessID = Number(this.UserForm.controls.ProcessID.value);
      loginmodel.ProcessName = this.UserForm.controls.ProcessName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.ProcessService.Create(loginmodel).subscribe(data => {
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

  FillUser(ProcessID: number = 0) {
    if (ProcessID > 0) {
      this.ProcessService.Get(ProcessID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              ProcessID: [user.data[0].ProcessID],
              ProcessName: [user.data[0].ProcessName, Validators.required],
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
          ProcessID: [0],
          ProcessName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(ProcessID: number = 0) {
    if(ProcessID > 0)
      this.header = "Edit Process";
    else
      this.header = "Create Process";
    this.FillUser(ProcessID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
