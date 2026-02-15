import { Component, OnInit } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoginModel } from '../Models/LoginModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  currentDate = new Date();

  loginForm: any;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router,private userService: UserService, private toastr: ToastrService){
  }

  get loginFormControl(){
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        username: ["", Validators.required],
        password: ["", Validators.required]
      }
    );
  }

  Login(){


    
    this.submitted = true;
    if(this.loginForm.valid)
    {
      console.log(this.loginForm);

      const loginmodel:LoginModel = new LoginModel(); 
      loginmodel.Username = this.loginForm.controls.username.value;
      loginmodel.Password = this.loginForm.controls.password.value;

      this.userService.Login(loginmodel).subscribe(data => {
        console.log(data);
        let d:any = data;
        if(!d.success)
        {
          this.toastr.error(d.message, '',{enableHtml: true,
            closeButton: true });
        }
        else
        {
          this.userService.GetLoginUserInfo(d.data).subscribe(
                loginData => {  
                  console.log(loginData);
                  localStorage.setItem("userSession", JSON.stringify(loginData));
                  this.router.navigate(['dashboard']);
                }
          );
        }
      },
      error => {
        console.log(error);
        this.toastr.error(error.error.message, '');
    }
      );
      
      
    }
    else{
      
    }

  }


}
