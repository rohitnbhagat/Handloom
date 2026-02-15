import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StockTypeService } from '../../../services/Masters/stock-type.service';
import { ToastrService } from 'ngx-toastr';
import { StockTypeMaster_AddModel } from '../../../Models/Masters/StockTypeModel'

@Component({
  selector: 'app-stock-type-add',
  templateUrl: './stock-type-add.component.html',
  styleUrl: './stock-type-add.component.css'
})
export class StockTypeAddComponent {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Stock Type";

  Usermodel: StockTypeMaster_AddModel = new StockTypeMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private StockTypeService: StockTypeService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: StockTypeMaster_AddModel = new StockTypeMaster_AddModel();
      loginmodel.StockTypeID = Number(this.UserForm.controls.StockTypeID.value);
      loginmodel.StockTypeName = this.UserForm.controls.StockTypeName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.StockTypeService.Create(loginmodel).subscribe(data => {
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

  FillUser(StockTypeID: number = 0) {
    if (StockTypeID > 0) {
      this.StockTypeService.Get(StockTypeID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              StockTypeID: [user.data[0].StockTypeID],
              StockTypeName: [user.data[0].StockTypeName, Validators.required],
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
          StockTypeID: [0],
          StockTypeName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(StockTypeID: number = 0) {
    if(StockTypeID > 0)
      this.header = "Edit Stock Type";
    else
      this.header = "Create Stock Type";
    this.FillUser(StockTypeID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
