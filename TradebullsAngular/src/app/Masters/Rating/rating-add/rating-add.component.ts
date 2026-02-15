import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RatingService } from '../../../services/Masters/rating.service';
import { ToastrService } from 'ngx-toastr';
import { RatingMaster_AddModel } from '../../../Models/Masters/RatingModel'

@Component({
  selector: 'app-rating-add',
  templateUrl: './rating-add.component.html',
  styleUrl: './rating-add.component.css'
})
export class RatingAddComponent {
  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Rating";

  Usermodel: RatingMaster_AddModel = new RatingMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private ratingService: RatingService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: RatingMaster_AddModel = new RatingMaster_AddModel();
      loginmodel.RatingID = Number(this.UserForm.controls.RatingID.value);
      loginmodel.RatingName = this.UserForm.controls.RatingName.value;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.ratingService.Create(loginmodel).subscribe(data => {
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

  FillUser(RatingID: number = 0) {
    if (RatingID > 0) {
      this.ratingService.Get(RatingID).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              RatingID: [user.data[0].RatingID],
              RatingName: [user.data[0].RatingName, Validators.required],
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
          RatingID: [0],
          RatingName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(RatingID: number = 0) {
    if(RatingID > 0)
      this.header = "Edit Rating";
    else
      this.header = "Create Rating";
    this.FillUser(RatingID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
