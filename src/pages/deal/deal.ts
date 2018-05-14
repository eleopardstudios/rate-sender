
import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, Form } from 'ionic-angular';
import { AlertController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SMS } from '@ionic-native/sms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DatePicker } from '@ionic-native/date-picker';

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
  private dealForm: any;

  constructor(public navCtrl: NavController,
    public platform: Platform,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public sms: SMS,
    public socialSharing: SocialSharing,
    private datePicker: DatePicker,
    public contactProvider: ContactProvider) {
    this.isWeb = false;
    this.dealForm = formBuilder.group({
      'buyerName': ['', Validators.required],
      'buyerPhoneNumber': ['', Validators.required],
      'rateForBuyer': ['', Validators.required],
      'sellerName': ['', Validators.required],
      'sellerPhoneNumber': ['', Validators.required],
      'rateForSeller': ['', Validators.required],
      'chickPeasType': ['42/44', Validators.required],
      'containerCount': ['', Validators.required],
      'containerSize': ['240', Validators.required],
      'date': [this.datePipe.transform(new Date(), 'dd/MM/yyyy'), Validators.required],
      'deliveryDate': [''],
      'weevilCount': ['']
    });
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isWeb = true;
      }
    });
  }

  selectBuyer() {
    this.contactProvider.selectContact().then((contact) => {
      this.dealForm.patchValue({
        'buyerName': contact.displayName,
        'buyerPhoneNumber': (contact.phoneNumbers[0]) ? contact.phoneNumbers[0].value : ""
      });
    }, (obj) => {
      console.log(JSON.stringify(obj));
      this.contactProvider.showMsg("Contact Not selected");
    });     
  }

  selectSeller() {
    this.contactProvider.selectContact().then((contact) => {
      this.dealForm.patchValue({
        'sellerName': contact.displayName,
        'sellerPhoneNumber': (contact.phoneNumbers[0]) ? contact.phoneNumbers[0].value : ""
      });
    }, (obj) => {
      console.log(JSON.stringify(obj));
      this.contactProvider.showMsg("Contact Not selected");
    });    
  }

  loadDatePicker(controlKey) {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then((date) => {
      console.log(JSON.stringify(date));
      console.log(controlKey)
      this.dealForm.controls[controlKey].setValue(this.datePipe.transform(date, 'dd/MM/yyyy'));
    }, (err) => {
      console.log('Error occurred while getting date: ', err);
    }
    );
  }


  initActionSheet(type, msg, phoneNumber) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Send SMS',
          handler: () => {
            this.contactProvider.showLoading("Sending SMS");
            this.sms.send(phoneNumber, msg).then(() => {
              this.contactProvider.hideLoading();
              this.contactProvider.showMsg(type + " SMS Sent");
            }, () => {
              this.contactProvider.hideLoading();
              this.contactProvider.showMsg(type + " SMS Not Sent");
            });
          }
        }, {
          text: 'Share via WhatsApp',
          handler: () => {
            this.socialSharing.shareViaWhatsApp(msg).then((obj) => {
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
  
  sendBuyer() {
    console.log(JSON.stringify(this.dealForm.value));
    var controls = this.dealForm.controls;
    var buyerSms = ["Buyer: ", controls['buyerName'].value,
    "\nChickpeas (Kabuli) Type: ", controls['chickPeasType'].value,
    "\nRate: ", "Rs ", controls['rateForBuyer'].value, "/-",
    "\nConatainers: ", controls['containerCount'].value, " (", controls['containerSize'].value, " Quintal)",
    "\nDate: ", controls['date'].value];
    if(controls['deliveryDate'].value && controls['deliveryDate'].value != "") {
      buyerSms.push("\nDelivery: By " + controls['deliveryDate'].value);
    }
    if(controls['weevilCount'].value && controls['weevilCount'].value != "") {
      buyerSms.push("\nWeevil's Count: " + controls['weevilCount'].value);
    }
    buyerSms.push("\nBroker: Shree Overseas\nRaja Agrawal\nGopi Agrawal");
    
    let sms: string = buyerSms.join("");
    let alert = this.alertCtrl.create({
      title: 'Confirm SMS',
      message: sms.replace(new RegExp('\r?\n','g'), '<br />'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.initActionSheet('Buyer', sms, controls['buyerPhoneNumber'].value);
          }
        }
      ]
    });
    alert.present();
  }

  sendSeller() {
    console.log(JSON.stringify(this.dealForm.value));
    var controls = this.dealForm.controls;
    var sellerSms = ["Seller: ", controls['sellerName'].value,,
    "\nChickpeas (Kabuli) Type: ", controls['chickPeasType'].value,
    "\nRate: ", "Rs ", controls['rateForSeller'].value, "/-",
    "\nConatainers: ", controls['containerCount'].value, " (", controls['containerSize'].value, " Quintal)",
    "\nDate: ", controls['date'].value];
    if(controls['deliveryDate'].value && controls['deliveryDate'].value != "") {
      sellerSms.push("\nDelivery: By " + controls['deliveryDate'].value);
    }
    if(controls['weevilCount'].value && controls['weevilCount'].value != "") {
      sellerSms.push("\nWeevil's Count: " + controls['weevilCount'].value);
    }
    sellerSms.push("\nBroker: Shree Overseas\nRaja Agrawal\nGopi Agrawal");
    
    let sms: string = sellerSms.join("");
    let alert = this.alertCtrl.create({
      title: 'Confirm SMS',
      message: sms.replace(new RegExp('\r?\n','g'), '<br />'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.initActionSheet('Seller', sms, controls['sellerPhoneNumber'].value);
          }
        }
      ]
    });
    alert.present();    
  }

  reset() {
    this.dealForm.reset({
      'buyerName': '',
      'buyerPhoneNumber': '',
      'rateForBuyer': '',
      'sellerName': '',
      'sellerPhoneNumber': '',
      'rateForSeller': '',
      'chickPeasType': '42/44',
      'containerCount': '',
      'containerSize': '240',
      'date': this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      'deliveryDate': ''
    })
  }
}