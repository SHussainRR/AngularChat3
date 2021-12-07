import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';

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
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {

  nickname = '';
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  OnetoOne = [];
  onlineUsers=[];
  offlineUsers=[];
  allUsers = [];
  isLoadingResults = true;
  displayStyle = "none";
  newArr=[];


 
  

  constructor(private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) {
    this.nickname = localStorage.getItem('nickname');
    firebase.database().ref('rooms/').on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
      this.isLoadingResults = false;
    });




    firebase.database().ref('OnetoOne/').on('value', resp => {
      this.OnetoOne = [];
      this.OnetoOne = snapshotToArray(resp);
      console.log("Logg ===> ", this.OnetoOne);
      this.OnetoOne = this.OnetoOne.filter(item => item.UserOne === this.nickname || item.UserTwo === this.nickname);
      
      console.log("Logg ===> ", this.OnetoOne);
      this.isLoadingResults = false;
    });



    // firebase.database().ref('OnetoOne/UserOne/' ||'OnetoOne/UserTwo/' ).on('value', resp => {
      
      
    //   if(snapshotToArray(resp).includes('ali')){
    //     this.OnetoOne.push(snapshotToArray(resp));
    //   };

    //   this.isLoadingResults = false;
    // });




    firebase.database().ref('roomusers/').orderByChild('roomname').on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);
      this.onlineUsers = roomusers.filter(x => x.status === 'online');
      this.offlineUsers = roomusers.filter(x => x.status === 'offline');
      this.allUsers = roomusers;
    });

  }

  ngOnInit(): void {
  }

  enterChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('roomusers/' + user.key);
        userRef.update({status: 'online'});
      } else {
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        newroomuser.status = 'online';
        const newRoomUser = firebase.database().ref('roomusers/').push();
        newRoomUser.set(newroomuser);
      }
    });

    this.router.navigate(['/chatroom', roomname]);

  }












 
 
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }


  enterOnetoOneChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';
    const newMessage = firebase.database().ref('Onechats/').push();
    newMessage.set(chat);

    firebase.database().ref('Oneroomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('Oneroomusers/' + user.key);
        // userRef.update({status: 'online'});
      } else {
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        // newroomuser.status = 'online';
        const newRoomUser = firebase.database().ref('Oneroomusers/').push();
        newRoomUser.set(newroomuser);
      }
    });

    this.router.navigate(['/chatroomone', roomname]);
  }

  

  logout(): void {
    localStorage.removeItem('nickname');
    this.router.navigate(['/login']);
  }

}
