import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelprintsettinsService } from '../../../services/Masters/labelprintsettins.service';
import { ToastrService } from 'ngx-toastr';
import { Labelprintsettins_AddModel } from '../../../Models/Masters/LabelprintsettinsModel'

@Component({
  selector: 'app-labelprint-settings-add',
  templateUrl: './labelprint-settings-add.component.html',
  styleUrl: './labelprint-settings-add.component.css'
})
export class LabelprintsettingsAddComponent {

  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Label Print Setting";

  Usermodel: Labelprintsettins_AddModel = new Labelprintsettins_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private labelprintsettinsService: LabelprintsettinsService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: Labelprintsettins_AddModel = new Labelprintsettins_AddModel();
      loginmodel.SettingID = Number(this.UserForm.controls.SettingID.value);
      loginmodel.SettingName = this.UserForm.controls.SettingName.value;
      loginmodel.printerDPI = Number(this.UserForm.controls.printerDPI.value);
      loginmodel.width = Number(this.UserForm.controls.width.value);
      loginmodel.height = Number(this.UserForm.controls.height.value);
      loginmodel.columns = Number(this.UserForm.controls.columns.value);
      loginmodel.columnSpace = Number(this.UserForm.controls.columnSpace.value);
      loginmodel.rowSpace = Number(this.UserForm.controls.rowSpace.value);
      this.labelprintsettinsService.Create(loginmodel).subscribe(data => {
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

  FillUser(SettingID: number = 0) {
    if (SettingID > 0) {
      this.labelprintsettinsService.Get(SettingID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              SettingID: [user.data[0].SettingID],
              SettingName: [user.data[0].SettingName, Validators.required],
              printerDPI: [user.data[0].printerDPI, Validators.required],
              width: [user.data[0].width, Validators.required],
              height: [user.data[0].height, Validators.required],
              columns: [user.data[0].columns, Validators.required],
              columnSpace: [user.data[0].columnSpace, Validators.required],
              rowSpace: [user.data[0].rowSpace, Validators.required],
            }   
          );
          this.isModalOpen = true;
        }
      );
    }
    else {
      this.UserForm = this.fb.group(
        {
          SettingID: [0],
          SettingName: ["", Validators.required],
          printerDPI: [null, Validators.required],
          width: [null, Validators.required],
          height: [null, Validators.required],
          columns: [null, Validators.required],
          columnSpace: [null, Validators.required],
          rowSpace: [null, Validators.required]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(SettingID: number = 0) {
    if(SettingID > 0)
      this.header = "Edit Label Print Setting";
    else
      this.header = "Create Label Print Setting";
    this.FillUser(SettingID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }

  


}
