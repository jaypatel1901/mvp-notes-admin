import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import SlimSelect from 'slim-select'
// import * as Swal from 'sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userDetails',
  templateUrl: './userDetail.component.html',
  styleUrls: ['./userDetail.component.css']
})
export class UsersDetailComponent implements OnInit {


  constructor() {

  }

  ngOnInit(): void {
  }
}
