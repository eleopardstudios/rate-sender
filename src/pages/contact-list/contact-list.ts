import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {
  private title: string;
  private isWeb: boolean;
  private searchString: string;
  private contactsFound = [];
  private search = false;

  constructor(public navCtrl: NavController,
    public platform: Platform,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private contacts: Contacts) {

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
  }

  closeModal() {
    this.viewCtrl.dismiss(null);
  }

  selectContact(contact) {
    this.viewCtrl.dismiss(contact);
  }


  findContacts($event) {
    if (this.isWeb) {
      console.log("On Web");
      return;
    }
    let fields: ContactFieldType[] = ['displayName'];
    const options = new ContactFindOptions();
    options.filter = this.searchString;
    options.multiple = true;
    options.hasPhoneNumber = true;

    this.contacts.find(fields, options).then((contacts) => {
      this.contactsFound = contacts;
      console.log(JSON.stringify(contacts[0]));
    });
    if (this.contactsFound.length == 0) {
      this.contactsFound.push({ displayName: 'No Contacts found' });
    }
    this.search = true;
  }
}
