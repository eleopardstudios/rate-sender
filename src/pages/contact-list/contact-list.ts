import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { ViewController } from 'ionic-angular';
import 'rxjs/add/operator/debounceTime';
import { ContactProvider } from '../../providers/contact/contact';

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {    
  private title: string;
  private contactList: any;
  private filteredContacts: any;  
  private searchTerm: string;  
  private searchControl: FormControl;
  private multiple: boolean;

  constructor(public navCtrl: NavController,        
    public navParams: NavParams,    
    public viewCtrl: ViewController, 
    public contactProvider: ContactProvider) {
    this.searchTerm = "";
    this.searchControl = new FormControl();
    this.contactList = [];
    this.title = "";
    this.multiple = false;
    this.filteredContacts = [];       
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
    this.title = this.navParams.get("title"); 
    this.multiple = this.navParams.get("multiple");
    this.multiple = this.multiple || false;

    this.contactProvider.getPhoneContacts().then((contacts) => {
      this.contactList = contacts;
      this.filteredContacts = this.setFilteredItems();
    });   
    this.searchControl.valueChanges.debounceTime(200).subscribe(search => {
      this.filteredContacts = this.setFilteredItems();
    });
  }

  setFilteredItems() {    
    console.log(this.searchTerm);
    if(this.searchTerm == "") {
      return this.contactList.slice();
    }
    return this.contactList.filter((contact) => {
      //console.log(contact.displayName);
      if(!contact.displayName) {
        return false;
      }
      return contact.displayName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  refresh() {
    this.contactProvider.refreshContacts().then((contacts) => {
      this.contactList = contacts;
      this.filteredContacts = this.setFilteredItems();
    });   
  }

  closeModal() {
    this.viewCtrl.dismiss(null);
  }

  selectContact(contact) {
    this.viewCtrl.dismiss(contact);
  }
}
