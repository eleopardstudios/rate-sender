
import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ContactProvider } from '../../providers/contact/contact';

/**
 * Generated class for the DealPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-deal',
  templateUrl: 'deal.html',
})
export class DealPage {

  private isWeb: boolean;
  data: any;

  constructor(public navCtrl: NavController,
    public platform: Platform,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public contactProvider: ContactProvider,
    private sms: SMS,
    private socialSharing: SocialSharing) {
    this.data = {
      buyer: null,
      seller: null,
      buyRate: 0,
      saleRate: 0,
      containerCount: 0,
      containerQuantity: 240,
      chickPeaType: null,
      date: null
    };
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isWeb = true;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
    this.data = {
      buyer: null,
      seller: null,
      buyRate: 0,
      saleRate: 0,
      containerCount: 0,
      containerQuantity: 240,
      chickPeaType: "42/44",
      date: null
    };
  }


  selectBuyer() {
    // let contacts : any = [
    //   {
    //     displayName: "Hello"
    //   },
    //   {
    //     displayName: "shobhit"
    //   },
    //   {
    //     displayName: "satyam"
    //   },
    //   {
    //     displayName: "skand"
    //   },
    //   {
    //     displayName: "rohit"
    //   }
    // ];
    // let obj = {
    //   'title': 'Select Buyer',
    //   'contactList': contacts
    // };
    // let contactsModal = this.modalCtrl.create('ContactListPage', obj);
    // contactsModal.onDidDismiss((contact) => {
    //   if (contact) {
    //     this.data.buyer = {
    //       'displayName': contact.displayName,
    //       'phoneNumber': (contact.phoneNumbers[0]) ? contact.phoneNumbers[0].value : ""
    //     }
    //   }
    // });
    // contactsModal.present();  
    let obj = {
      'title': 'Select Buyer'
    };
    let contactsModal = this.modalCtrl.create('ContactListPage', obj);
    contactsModal.onDidDismiss((contact) => {
      if (contact) {
        this.data.buyer = {
          'displayName': contact.displayName,
          'phoneNumber': (contact.phoneNumbers[0]) ? contact.phoneNumbers[0].value : ""
        }
      }
    });
    contactsModal.present();

  }

  selectSeller() {
    let obj = {
      'title': 'Select Seller'
    };
    let contactsModal = this.modalCtrl.create('ContactListPage', obj);
    contactsModal.onDidDismiss((contact) => {
      if (contact) {
        this.data.seller = {
          'displayName': contact.displayName,
          'phoneNumber': (contact.phoneNumbers[0]) ? contact.phoneNumbers[0].value : ""
        }
      }
    });
    contactsModal.present();
  }

  removeBuyer() {
    this.data.buyer = null;
  }

  removeSeller() {
    this.data.seller = null;
  }

  isValid() {
    if (this.data.chickPeaType == null || this.data.chickPeaType == "") {
      this.contactProvider.showMsg("Please select Chick Pea Type");
      return false;
    } 
    if( this.data.containerCount == 0 || this.data.containerCount == "" || this.data.containerCount == null) {
      this.contactProvider.showMsg("Please enter container count");
      return false;
    } 
    if(this.data.containerQuantity == 0 || this.data.containerQuantity == "" || this.data.containerQuantity == null) { 
      this.contactProvider.showMsg("Please enter container quantity");
      return false;
    }
    if(this.data.date == null || this.data.date == "") {
      this.contactProvider.showMsg("Please provide date");
      return false;
    }
    return true;
  }
  isBuyerValid() {
    if (this.data.buyer == null) {
      this.contactProvider.showMsg("Please select buyer");
      return false;
    }
    if(this.data.buyRate == null || this.data.buyRate == "" || this.data.buyRate == 0) {
      this.contactProvider.showMsg("Please provide Rate for buyer");
      return false;
    }    
   
    return true;
  }

  isSellerValid() {
    if (this.data.seller == null) {
      this.contactProvider.showMsg("Please select seller");
      return false;
    }

    if(this.data.saleRate == null || this.data.saleRate == "" || this.data.saleRate == 0) {
      this.contactProvider.showMsg("Please provide Rate for Seller");
      return false;
    }    
    return true;
  }

  sendBuyer() {

    if (!this.isBuyerValid() || !this.isValid()) {      
      return;
    }

    var buyerSms = ["Buyer: ", this.data.buyer.displayName,
      "\nRate: ", this.data.buyRate, " Rs",
      "\nConatainers: ", this.data.containerCount, " (", this.data.containerQuantity, " Quintal)",
      "\nDate: ", this.data.date,
      "\nDalal: Shre Overseas",
      "\nRaja Agrawal"].join("");

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Send SMS',
          handler: () => {
            this.contactProvider.showLoading("Sending SMS");
            this.sms.send(this.data.buyer.phoneNumber, buyerSms).then(() => {
              this.contactProvider.hideLoading();
              this.contactProvider.showMsg("Buyer SMS Sent");
            }, () => {
              this.contactProvider.hideLoading();
              this.contactProvider.showMsg("Buyer SMS Not Sent");
            });
          }
        }, {
          text: 'Share via WhatsApp',
          handler: () => {
            this.socialSharing.shareViaWhatsApp(buyerSms).then((obj) => {
              console.log("success");
              this.contactProvider.showMsg("Successfully sent via Whatsapp")
              console.log(JSON.stringify(obj));
            }, (obj) => {
              console.log("fail");
              console.log(JSON.stringify(obj));
            })
            console.log('Share clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  sendSeller() {
    if (!this.isSellerValid() || !this.isValid()) {      
      return;
    }
    var selllerSMS = ["Seller: ", this.data.buyer.displayName,
      "\nRate: ", this.data.saleRate, " Rs",
      "\nConatainers: ", this.data.containerCount, " (", this.data.containerQuantity, " Quintal)",
      "\nDate: ", this.data.date,
      "\nDalal: Shre Overseas",
      "\nRaja Agrawal"].join("");

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Send SMS',
          handler: () => {
            this.contactProvider.showLoading("Sending SMS");
            this.sms.send(this.data.seller.phoneNumber, selllerSMS).then(() => {
              this.contactProvider.hideLoading();
              this.contactProvider.showMsg("Seller SMS Sent");
            }, () => {
              this.contactProvider.hideLoading();
              this.contactProvider.showMsg("Seller SMS Not Sent");
            });
          }
        }, {
          text: 'Share via WhatsApp',
          handler: () => {
            this.socialSharing.shareViaWhatsApp(selllerSMS).then((obj) => {
              console.log("success");
              this.contactProvider.showMsg("Successfully sent via Whatsapp")
              console.log(JSON.stringify(obj));
            }, (obj) => {
              console.log("fail");
              console.log(JSON.stringify(obj));
            })
            console.log('Share clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  reset() {
    this.data = {
      buyer: null,
      seller: null,
      buyRate: 0,
      saleRate: 0,
      containerCount: 0,
      containerQuantity: 240,
      chickPeaType: "42/44",
      date: null
    };
  }

}
