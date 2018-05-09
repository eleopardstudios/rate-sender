import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private isWeb: boolean;
  data: any = {
    buyer : null,
    seller: null,
    rate: 0,
    containerCount: 0,
    itemType: null,
    date: null
  };

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController, public navParams: NavParams) {

  }

  ngOnInit() {    
    this.platform.ready().then(() => {      
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isWeb = true;
      }
    });
  }

  selectSeller() {
    let obj = {
      'title': 'Select Seller'      
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
      'title': 'Select Buyer'      
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
