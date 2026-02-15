import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UserCreateModel } from '../../Models/UserCreateModel'

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css'
})
export class CreateuserComponent implements OnInit {

  UserForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create User";

  Usermodel: UserCreateModel = new UserCreateModel();

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  get UserFormControl() {
    return this.UserForm.controls;
  }

  SaveUser() {
    this.submitted = true;
    if(this.UserForm.controls.userTypeID.value == "0"){
      this.UserForm.controls.userTypeID.setErrors({ required:true, message: 'Please select user type.'});
    }
    else if (this.UserForm.valid) {
      const loginmodel: UserCreateModel = new UserCreateModel();
      loginmodel.UserID = Number(this.UserForm.controls.userID.value);
      loginmodel.UserTypeID = Number(this.UserForm.controls.userTypeID.value),
      loginmodel.FirstName = this.UserForm.controls.firstName.value;
      loginmodel.LastName = this.UserForm.controls.lastName.value;
      loginmodel.MiddleName = this.UserForm.controls.middleName.value;
      loginmodel.ClientCode = this.UserForm.controls.clientCode.value;
      loginmodel.UserName = this.UserForm.controls.userName.value;
      loginmodel.Password = this.UserForm.controls.password.value;


      this.userService.Create(loginmodel).subscribe(data => {
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

  FillUser(UserID: number = 0) {
    if (UserID > 0) {
      this.userService.GetUsers(UserID, 0).subscribe(
        loginData => {
          let user: any = loginData;
          this.UserForm = this.fb.group(
            {
              userID: [user.data[0].UserID],
              userTypeID: [user.data[0].UserTypeID, Validators.required],
              userName: [user.data[0].UserName, Validators.required],
              password: [user.data[0].Password, Validators.required],
              clientCode: [user.data[0].ClientCode, Validators.required],
              firstName: [user.data[0].FirstName, Validators.required],
              middleName: [user.data[0].MiddleName, Validators.required],
              lastName: [user.data[0].LastName, Validators.required]
            }   
          );
          this.isModalOpen = true;
        }
      );
    }
    else {
      this.UserForm = this.fb.group(
        {
          userID: [0],
          userTypeID: [3, Validators.required],
          userName: ["", Validators.required],
          password: ["", Validators.required],
          clientCode: ["", Validators.required],
          firstName: ["", Validators.required],
          middleName: ["", Validators.required],
          lastName: ["", Validators.required]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(UserID: number = 0) {
    if(UserID > 0)
      this.header = "Edit User";
    else
      this.header = "Create User";
    this.FillUser(UserID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }

}
