import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ContactProvider } from '../../providers/contact/contact';

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {
  contactList: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public contactProvider: ContactProvider) {
    this.contactList = [];
  }

  ngOnInit() {
    // Let's navigate from TabsPage to Page1
    this.contactList = [];
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
  }

  ionViewDidEnter() {    
    console.log('ionViewDidEnter ContactListPage');
    this.contactProvider.showLoading();
    this.contactProvider.getContactList().then((contacts) => {
      this.contactProvider.hideLoading();      
      console.log(JSON.stringify(contacts));      
      this.contactList = contacts;
    }, (obj) => {
      this.contactProvider.hideLoading();
      console.log("Error in getting contact list");
    });
  }

  removeContact(index) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure to remove this contact.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.contactList.splice(index, 1);
            this.contactProvider.showLoading();
            this.contactProvider.updateContactList(this.contactList).then(() => {
              this.contactProvider.hideLoading();
              this.contactProvider.showMsg("Contact removed");
            }, () => {
              this.contactProvider.hideLoading();
              this.contactProvider.showMsg("Error in removing contact");
            });
          }
        }
      ]
    });
    alert.present();    
  }

  addContact() {
    this.contactProvider.selectContact().then((contact) => {
      console.log(JSON.stringify(contact));
      this.contactProvider.showLoading();
      let contactData: any  = {
        'displayName': contact.displayName,
        'phoneNumber': (contact.phoneNumbers[0]) ? contact.phoneNumbers[0].value : ""
      };
      this.contactList.push(contactData);      
      this.contactProvider.updateContactList(this.contactList).then(() => {
        this.contactProvider.hideLoading();
        this.contactProvider.showMsg("Contact added");
      }, () => {
        this.contactProvider.hideLoading();
        this.contactProvider.showMsg("Error in adding contact");
      });
    }, (obj) => {
      console.log(JSON.stringify(obj));
      this.contactProvider.showMsg("Contact not selected");
    });
  }

  displayPhoneNumber(contact) {
    return (contact.phoneNumbers[0]) ? contact.phoneNumbers[0].value : "";
  }

}
