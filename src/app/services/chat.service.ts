import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// const API = 'http://localhost:3000';
const API = 'http://10.90.90.55:3000';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    //   private url = 'http://localhost:3000';
  	private url = 'http://10.90.90.55:3000';
    private socket;    

    constructor(private http:HttpClient) {
        this.socket = io(this.url);
    }

    public onLogin(username: string) {
        return this.http.post(API+'/login', {name: username});
    }

    public getAllUsers() {
        return this.http.get(API+'/get_all_users');
    }

    public getChatByUser(data: any) {
        return this.http.post(API+'/get_chat_by_user', data);
    }

    public sendMessage(data: any) {
        this.socket.emit('new-message', data);
    }


    public getMessages = () => {
        return Observable.create((observer: any) => {
            this.socket.on('new-message', (message: any) => {
                observer.next(message);
            });
        });
    }

    public getNewUser = () => {
        return Observable.create((observer: any) => {
            this.socket.on('new-user', (user: any) => {
                console.log('new user', user);
                observer.next(user);
            });
        });
    }

    public logoutUser(user_id: string) {
        return this.http.post(API+'/logout', {user_id: user_id});
    }
}
