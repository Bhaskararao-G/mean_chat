import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

	activeUser: any;
	users = [];
	chatUser: any;

	message: string;
  messages:Array<string> = [];

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
  	if (localStorage.userLogin) {
  		this.activeUser = JSON.parse(localStorage.userLogin);
  	} else {
  		this.router.navigate(['/login']);
  	}

  	this.getAllUsers();
  	this.getMessages();
    this.getNewUser();
  }

  getMessages() {
  	this.chatService.getMessages().subscribe((message: string) => {
      	console.log(message);
        this.messages.push(message);
      });
  }

  sendMessage() {
  	let data = { 
  		sender_id: this.activeUser._id,
  		receiver_id: this.chatUser._id,
  		message: this.message
    }

    this.chatService.sendMessage(data);
    this.message = '';
  }

  onClickUser(user) {
  	this.chatUser = user;

  	let data = { 
  		sender_id: this.activeUser._id,
  		receiver_id: this.chatUser._id
    }

  	this.chatService.getChatByUser(data).subscribe((res: any) => {
  		if (res.success) {
  			this.messages = res.chat
  		}
    });
  }

  onLogout(user_id: string) {
    this.chatService.logoutUser(user_id).subscribe((res: any) => {
      if (res.success) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    })
  }

  getAllUsers() {
  	this.chatService.getAllUsers().subscribe((res: any) => {
  		if (res.success) {
  			this.users = res.users;
  		}
    });
  }

  async getNewUser() {
    await this.chatService.getNewUser().subscribe((users: any) => {
      if (users) {
        this.users = users;
      }
    });
  }

}
