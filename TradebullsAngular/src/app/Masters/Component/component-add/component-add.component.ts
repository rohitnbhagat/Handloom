import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentService } from '../../../services/Masters/component.service';
import { ToastrService } from 'ngx-toastr';
import { ComponentMaster_AddModel } from '../../../Models/Masters/ComponentModel'

@Component({
  selector: 'app-component-add',
  templateUrl: './component-add.component.html',
  styleUrl: './component-add.component.css'
})
export class ComponentAddComponent {
UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Component";

  Usermodel: ComponentMaster_AddModel = new ComponentMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private ComponentService: ComponentService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: ComponentMaster_AddModel = new ComponentMaster_AddModel();
      loginmodel.ComponentID = Number(this.UserForm.controls.ComponentID.value);
      loginmodel.ComponentName = this.UserForm.controls.ComponentName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.ComponentService.Create(loginmodel).subscribe(data => {
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

  FillUser(ComponentID: number = 0) {
    if (ComponentID > 0) {
      this.ComponentService.Get(ComponentID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              ComponentID: [user.data[0].ComponentID],
              ComponentName: [user.data[0].ComponentName, Validators.required],
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
          ComponentID: [0],
          ComponentName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(ComponentID: number = 0) {
    if(ComponentID > 0)
      this.header = "Edit Component";
    else
      this.header = "Create Component";
    this.FillUser(ComponentID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
