import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	username: string;

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
  	if (localStorage.userLogin) {
  		this.router.navigate(['/']);
  	}
  }

  onLogin() {
  	this.chatService.onLogin(this.username).subscribe((res: any) => {
    if (res.success) {
      		this.username = '';
      		localStorage.setItem('userLogin', JSON.stringify(res.user));
      		this.router.navigate(['/']);
      	}
    });
  }

}
