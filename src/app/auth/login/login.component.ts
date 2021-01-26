import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
  loginForm: FormGroup;
  passwordType: any = false;
  error: any;
  user: any;
  constructor(private commonService: CommonService, private _router: Router, private formBuilder: FormBuilder,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")

      ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.pattern(/^\S*$/)
        ]
      ],
    });
  }
  get formControls() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner.show();

    let body = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }
    this.commonService.post('adminLogin', body).subscribe((data: any) => {
      console.log("data", data)
      this.spinner.hide();

      if (data.status == 200) {


        let token = data.token;
        localStorage.setItem('firstName', data.data.firstName);
        localStorage.setItem('lastName', data.data.lastName);
        localStorage.setItem('email', data.data.email);


        localStorage.setItem('adminToken', token);
        this._router.navigate(["dashboard"]);
      } else {
        this.error = data.message
        alert(this.error)
      }

    },
      (error) => {
        // this.error=error.error.error;
        // this.error='Invalid email or password';
        // this.spinner.hide();
        // this.toastr.warning('something went wrong', 'error');

      })
  }

}
