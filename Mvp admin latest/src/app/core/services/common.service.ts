import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { constants } from './../utils/constant';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public http: HttpClient) { }

  get(url) {
    let headers = new HttpHeaders()
    headers = headers.append('content-type', 'application/json')
    headers = headers.append('content-type', 'application/x-www-form-urlencoded')
    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);
    const finalUrl = constants.apiBaseURL + url;
    // headers = headers.append('customer-header', 'custom')
    return this.http.get<any[]>(finalUrl, { 'headers': headers }).pipe(
      map((data) => {
        //You can perform some transformation here
        return data;
      }),
      catchError((err) => {
        console.error("err",err);
        throw err;
      })
    )
  }
  post(url, body) {
    let headers = new HttpHeaders()
    console.log("url in common",url)
   // headers = headers.append('content-type', 'application/json')
   // headers = headers.append('content-type', 'application/x-www-form-urlencoded')
    // headers = headers.append('customer-header', 'custom')
    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);
    const finalUrl = constants.apiBaseURL + url;
    console.log("url in common",finalUrl)

    let value: HttpParams = new HttpParams();
    if (body) {
      Object.keys(body).forEach(key => {
        value = value.append(key, body[key]);
      });
    }
    return this.http.post(finalUrl, body, { 'headers': headers })
      .pipe(
        map((data) => {
          //You can perform some transformation here
          return data;
        }),
        catchError((err) => {
          console.error("error",err);
          throw err;
        })
      )
  }

  /*function for calling put Apis's*/
  put(url, body) {
    let headers = new HttpHeaders()
    // headers = headers.append('content-type', 'application/json')
    // headers = headers.append('content-type', 'application/x-www-form-urlencoded')
    // headers = headers.append('customer-header', 'custom')
    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);

    const finalUrl = constants.apiBaseURL + url;

    let value: HttpParams = new HttpParams();
    if (body) {
      Object.keys(body).forEach(key => {
        value = value.append(key, body[key]);
      });
    }
    return this.http.put(finalUrl, body, { 'headers': headers })
      .pipe(
        map((data) => {
          //You can perform some transformation here
          return data;
        }),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      )
    

  }

  /*function for calling patch Apis's*/
  patch(url, body) {
    let headers = new HttpHeaders()
    // headers = headers.append('content-type', 'application/json')
    // headers = headers.append('content-type', 'application/x-www-form-urlencoded')

    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);

    const finalUrl = constants.apiBaseURL + url;

    // headers = headers.append('customer-header', 'custom')
    let value: HttpParams = new HttpParams();
    if (body) {
      Object.keys(body).forEach(key => {
        value = value.append(key, body[key]);
      });
    }
    return this.http.patch(finalUrl, body, { 'headers': headers })
      .pipe(
        map((data) => {
          //You can perform some transformation here
          return data;
        }),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      )

  }

  /*function for calling delete Apis's*/
  delete(url, id: string) {
    let headers = new HttpHeaders()
    // headers = headers.append('content-type', 'application/json')
    // headers = headers.append('content-type', 'application/x-www-form-urlencoded')

    let token=localStorage.getItem('token') ? localStorage.getItem('token') : '';
    headers = headers.append('token', token);

    const finalUrl = constants.apiBaseURL + url+'/';

    return this.http.delete(finalUrl+id, { 'headers': headers })
      .pipe(
        map((data) => {
          //You can perform some transformation here
          return data;
        }),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      )

  }



}
