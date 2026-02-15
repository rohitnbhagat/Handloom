import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../services/Masters/brand.service';
import { ToastrService } from 'ngx-toastr';
import { BrandMaster_AddModel } from '../../../Models/Masters/BrandModel'

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrl: './brand-add.component.css'
})
export class BrandAddComponent {

  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create Brand";
  imageBase64: string = '';

  Usermodel: BrandMaster_AddModel = new BrandMaster_AddModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private brandService: BrandService, private toastr: ToastrService) {
  }

  get FormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if (this.UserForm.valid) {
      const loginmodel: BrandMaster_AddModel = new BrandMaster_AddModel();
      loginmodel.BrandID = Number(this.UserForm.controls.BrandID.value);
      loginmodel.BrandName = this.UserForm.controls.BrandName.value;
      loginmodel.BrandLogo = this.imageBase64;
      loginmodel.Remarks = this.UserForm.controls.Remarks.value;

      this.brandService.Create(loginmodel).subscribe(data => {
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

  FillUser(BrandID: number = 0) {
    if (BrandID > 0) {
      this.brandService.Get(BrandID).subscribe(
        loginData => {
          let user: any = loginData;
          this.imageBase64 = user.data[0].BrandLogo;
          this.UserForm = this.fb.group(
            {
              BrandID: [user.data[0].BrandID],
              BrandName: [user.data[0].BrandName, Validators.required],
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
          BrandID: [0],
          BrandName: ["", Validators.required],
          Remarks: [""]
        }
      );
      this.imageBase64 = "";
      this.isModalOpen = true;
    }
  }

  OpenModel(BrandID: number = 0) {
    this.imageBase64 = "";
    if(BrandID > 0)
      this.header = "Edit Brand";
    else
      this.header = "Create Brand";
    this.FillUser(BrandID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }

  

  // Function to handle file input change event
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to base64 string

      reader.onload = () => {
        // Once the file is loaded, set the base64 string to imageBase64
        this.imageBase64 = reader.result as string;
      };

      reader.onerror = (error) => {
        console.error('Error converting file to base64: ', error);
      };
    }
  }

}
