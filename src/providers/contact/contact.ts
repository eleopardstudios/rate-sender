import { Injectable } from '@angular/core';
import { LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';
/*
  Generated class for the ContactProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContactProvider {
  private loading: Loading;
  private contactList: any;  
  constructor(private contacts: Contacts,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage) {    
  }
 
  selectContact(): Promise<any> {
    return this.contacts.pickContact();
  }

  getPhoneContacts(): Promise<any> {
    var promise = new Promise((resolve, reject) => {
      if (this.contactList && this.contactList.length) {
        console.log("already availalbe");
        resolve(this.contactList);
        return;
      }
      this.showLoading();
      this.retrieveContacts().then((contacts) => {
        console.log("contacts fetched");
        this.hideLoading();
        this.contactList = contacts;
        resolve(contacts);
      }, (obj) => {
        this.hideLoading();
        console.log(JSON.stringify(obj));
        resolve([]);
      });
      // setTimeout(() => {
      //   this.hideLoading();
      //   this.contactList = this.demoData;
      //   resolve(this.demoData);
      // }, 1000);
    });
    return promise;
  }

  refreshContacts(): Promise<any> {
    var promise = new Promise((resolve, reject) => {
      this.showLoading();
      this.retrieveContacts().then((contacts) => {
        console.log("contacts fetched");
        this.hideLoading();
        this.contactList = contacts;
        resolve(contacts);
      }, (obj) => {
        this.hideLoading();
        console.log(JSON.stringify(obj));
        resolve([]);
      });
      // setTimeout(() => {
      //   this.hideLoading();
      //   this.contactList = this.demoData;
      //   resolve(this.demoData);
      // }, 1000);
    });
    return promise;
  }

  retrieveContacts(): Promise<any> {
    let fields: ContactFieldType[] = ['displayName'];
    const options = new ContactFindOptions();
    options.filter = "";//To fetch all the contacts
    options.multiple = true;
    options.hasPhoneNumber = true;
    return this.contacts.find(fields, options);
  }
 
  updateContactList(contacts): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        let data: any = {
          'list': contacts
        }
        this.storage.set("rate-contact-list", JSON.stringify(data)).then(() => {
          resolve();
        }, () => {
          console.log("contacts cannot be saved")
          reject();
        });
      }, () => {
        console.log("storage not ready");
        reject();
      })
    });
    return promise;
  }

  getContactList(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get("rate-contact-list").then((data) => {
          if (data == null) {
            resolve([]);
          } else {
            console.log(data);
            data = JSON.parse(data);            
            resolve(data.list);
          }
        }, () => {
          console.log("contacts cannot be retreived")
          resolve([]);
        });
      }, () => {
        console.log("storage not ready");
        resolve([]);
      })
    });
    return promise;
  }

  showLoading(msg: string = null) {
    if (this.loading) {
      return;
    }
    if (msg == null) {
      msg = 'Please wait...'
    }
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    return this.loading.present();
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  showMsg(text: string = "", msgDuration: number = 2000) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: msgDuration,
      position: 'top'
    });
    toast.present();
  }

}
