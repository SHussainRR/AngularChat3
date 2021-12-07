import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};


@Component({
  selector: 'app-one-chatroom',
  templateUrl: './one-chatroom.component.html',
  styleUrls: ['./one-chatroom.component.css']
})
export class OneChatroomComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number = null;

  chatForm: FormGroup;
  nickname = '';
  roomname = '';
  message = '';
  users = [];
  chats = [];
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public datepipe: DatePipe) {
                this.nickname = localStorage.getItem('nickname');
                this.roomname = this.route.snapshot.params.roomname;
                firebase.database().ref('Onechats/'+this.roomname).on('value', resp => {
                  this.chats = [];
                  this.chats = snapshotToArray(resp);
                  setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
                });
                firebase.database().ref('Oneroomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp2: any) => {
                  const roomusers = snapshotToArray(resp2);
                  // this.users = roomusers.filter(x => x.status === 'online');
                });


                // firebase.database().ref('OnetoOne/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp12: any) => {
                //   const roomdetails = snapshotToArray(resp12);
                //   this.users = roomdetails.filter(x => x.roomname === this.roomname);
                // });

                

              }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(),'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    const newMessage = firebase.database().ref('Onechats/'+this.roomname).push();
    newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }

  exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} leave the room`;
    chat.type = 'exit';
    // start Here Checking gg 
    const newMessage = firebase.database().ref('Onechats/'+this.roomname).push();
    newMessage.set(chat);

    firebase.database().ref('Oneroomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('Oneroomusers/' + user.key);
        userRef.update({status: 'offline'});
      }
    });

    this.router.navigate(['/roomlist']);
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) {}                 
}

}





