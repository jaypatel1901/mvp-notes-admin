import { Component, OnInit } from '@angular/core';
import axios from 'axios';
// import Freshdesk from 'freshdesk-api'
// var freshdesk = new Freshdesk('https://newaccount1611297342692.freshdesk.com', 't5O5kyOG9YAJ0izzCRs')

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CMSComponent implements OnInit {
chatList:any
  constructor() { }

  ngOnInit(): void {
    this.getAllTickets()
  }

  getAllTickets() {
    axios.get("https://newaccount1611297342692.freshdesk.com/api/v2/tickets/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic dDVPNWt5T0c5WUFKMGl6ekNSczpY"
      }
    })
      .then(res => {
        console.log("resss", res)
        this.chatList =res.data
      })
      .catch(error => {
        console.log("error", error)
      })
  }
}
