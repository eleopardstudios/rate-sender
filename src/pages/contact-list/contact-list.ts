import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {
  private title: string;
  private contactList = [];
  private isWeb: boolean;
  private searchString: string;  
  private search = false;


  constructor(public navCtrl: NavController,
    public platform: Platform,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.title = "";
    this.platform.ready().then(() => {
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isWeb = true;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
    this.title = this.navParams.get("title");
    this.contactList = this.navParams.get("contactList");
  }

  closeModal() {
    this.viewCtrl.dismiss(null);
  }

  selectContact(contact) {
    this.viewCtrl.dismiss(contact);
  } 
}
