import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private isWeb: boolean;
  private contactList = [];
  data: any = {
    buyer : null,
    seller: null,
    rate: 0,
    containerCount: 0,
    itemType: null,
    date: null
  };

  constructor(public navCtrl: NavController, 
    public platform: Platform, 
    public modalCtrl: ModalController, 
    public navParams: NavParams,
    private contacts: Contacts) {

  }

  ngOnInit() {    
    this.platform.ready().then(() => {      
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isWeb = true;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
    if (this.isWeb) {
      console.log("On Web");
      return;
    }
    let fields: ContactFieldType[] = ['displayName'];
    const options = new ContactFindOptions();
    options.filter = "";//To fetch all the contacts
    options.multiple = true;
    options.hasPhoneNumber = true;
    this.contacts.find(fields, options).then((contacts) => {
      console.log("contacts fetched");
      this.contactList = contacts;
      console.log(JSON.stringify(contacts[0]));
    });    
  }

  selectSeller() {
    let obj = {
      'title': 'Select Seller',
      'contactList': this.contactList
    };
    let contactsModal = this.modalCtrl.create('ContactListPage', obj);
    contactsModal.onDidDismiss((option) => {
      if(option) {
        console.log(option);
      }      
    });  
    contactsModal.present();
  }

  selectBuyer() {
    let obj = {
      'title': 'Select Buyer',
      'contactList': this.contactList    
    };
    let contactsModal = this.modalCtrl.create('ContactListPage', obj);
    contactsModal.onDidDismiss((option) => {
      if(option) {
        console.log(option);
      }      
    });  
    contactsModal.present();
  }



}
