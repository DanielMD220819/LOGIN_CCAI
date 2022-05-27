import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  items: Observable<any[]>;
  datauser: any;

  constructor(firestore: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router) {
    this.items = firestore.collection('items').valueChanges();
  }

  ngOnInit(): void {
    this.afAuth.currentUser.then(user => {
      if(user && user.emailVerified) {
        this.datauser = user;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logOut() {
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }
}
