import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { ToastrService } from 'ngx-toastr';
import { ClientCreateModel } from '../../Models/ClientCreateModel'

@Component({
  selector: 'app-client-master-create',
  templateUrl: './client-master-create.component.html',
  styleUrl: './client-master-create.component.css'
})
export class ClientMasterCreateComponent implements OnInit{
  ClientForm: any;
  submitted = false;
  isModalOpen: boolean = false;
  header: string = "Create User";

  @Output() SaveEvent = new EventEmitter<void>();
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router, private clientService: ClientService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  get ClientMasterFormControl() {
    return this.ClientForm.controls;
  }

  Save() {
    this.submitted = true;
   if (this.ClientForm.valid) {
      const loginmodel: ClientCreateModel = new ClientCreateModel();
      loginmodel.ClientID = Number(this.ClientForm.controls.ClientID.value);
      loginmodel.ClientCode = this.ClientForm.controls.ClientCode.value,
      loginmodel.TOTP = this.ClientForm.controls.TOTP.value;
      loginmodel.Password = this.ClientForm.controls.Password.value;
      loginmodel.IsActive = this.ClientForm.controls.IsActive.value;


      this.clientService.Create(loginmodel).subscribe(data => {
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

  FillUser(ClientID: number = 0) {
    if (ClientID > 0) {
      this.clientService.Get(ClientID).subscribe(
        loginData => {
          let user: any = loginData;
          this.ClientForm = this.fb.group(
            {
              ClientID: [user.data[0].ClientID],
              ClientCode: [user.data[0].ClientCode, Validators.required],
              TOTP: [user.data[0].TOTP, Validators.required],
              Password: [user.data[0].Password, Validators.required],
              IsActive: [user.data[0].IsActive, Validators.required]
            }
          );
          this.isModalOpen = true;
        }
      );
    }
    else {
      this.ClientForm = this.fb.group(
        {
          ClientID: [0],
          ClientCode: ["", Validators.required],
          TOTP: ["", Validators.required],
          Password: ["", Validators.required],
          IsActive: [true, Validators.required]
        }
      );
      this.isModalOpen = true;
    }
  }

  OpenModel(ClientID: number = 0) {
    if(ClientID > 0)
      this.header = "Edit Client";
    else
      this.header = "Create Client";
    this.FillUser(ClientID);
    this.submitted = false;
  }

  CloseModel() {
    this.isModalOpen = false;
    this.CloseEvent.emit();
  }
}
