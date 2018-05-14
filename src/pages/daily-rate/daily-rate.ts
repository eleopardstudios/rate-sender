import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { SMS } from '@ionic-native/sms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ContactProvider } from '../../providers/contact/contact';

/**
 * Generated class for the DailyRatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-daily-rate',
  templateUrl: 'daily-rate.html',
})
export class DailyRatePage {
  public form: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    private _FB: FormBuilder,
    public contactProvider: ContactProvider,
    public sms: SMS,
    public socialSharing: SocialSharing) {
    this.form = this._FB.group({
      weevilCount: [''],
      rates: this._FB.array([
        this.initRateFields('42/44'),
        this.initRateFields('44/46'),
        this.initRateFields('58/60'),
        this.initRateFields('60/62'),
        this.initRateFields('62/64')
      ])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyRatePage');
  }

  initRateFields(checkPeasRate: any = '', from: any = '', to: any = ''): FormGroup {
    return this._FB.group({
      'chickPeasType': [checkPeasRate, Validators.required],
      'from': [from, Validators.required],
      'to': [to],
    });
  }

  addNewRateField(): void {
    const rates = <FormArray>this.form.controls.rates;
    rates.push(this.initRateFields());
  }

  removeRateField(i: number): void {
    const rates = <FormArray>this.form.controls.rates;
    rates.removeAt(i);
  }

  sendRates(): void {
    let msgArray = [];
    msgArray.push("HARI BOL");
    msgArray.push("\nChickpeas (Kabuli) Revised Rates");
    let weevilCount = this.form.value.weevilCount;
    let rates = this.form.value.rates;
    rates.forEach(rate => {
      msgArray.push("\n", rate.chickPeasType, " @ ", rate.from);
      if (rate.to && rate.to != "") {
        msgArray.push(" - ", rate.to, "/-");
      } else {
        msgArray.push("/-");
      }
    });
    if( weevilCount && weevilCount != "") {
      msgArray.push("\n(All Counts Weevil's ", weevilCount, ")");
    }
    msgArray.push("\nSpot Indore\nRegards\nShree Overseas\n910910690\n910910680");

    let msg: any = msgArray.join("");

    let alert = this.alertCtrl.create({
      title: 'Confirm SMS',
      message: msg.replace(new RegExp('\r?\n','g'), '<br />'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.initActionSheet("Rate", msg);
          }
        }
      ]
    });
    alert.present();
  }

  initActionSheet(type, msg) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Send Single SMS',
          handler: () => {
            this.contactProvider.selectContact().then((contact) => {
              let phoneNumber = (contact.phoneNumbers[0]) ? contact.phoneNumbers[0].value : ""
              this.contactProvider.showLoading("Sending SMS");
              this.sms.send(phoneNumber, msg).then(() => {
                this.contactProvider.hideLoading();
                this.contactProvider.showMsg(type + " SMS Sent");
              }, () => {
                this.contactProvider.hideLoading();
                this.contactProvider.showMsg(type + " SMS Not Sent");
              });
            }, (obj) => {
              console.log(JSON.stringify(obj));
              this.contactProvider.showMsg("Contact Not selected");
            });
          }
        }, {
          text: 'Send SMS to List',
          handler: () => {
            this.contactProvider.getContactList().then((savedContacts) => {
              let phoneNumbers = savedContacts.map((contact) => contact.phoneNumber);
              if (!phoneNumbers.length) {
                this.contactProvider.showMsg("Contact List Empty");
                return;
              }
              this.sms.send(phoneNumbers, msg, {
                'android': { 'intent': 'INTENT' }
              }).then(() => {
              }, () => {
                this.contactProvider.showMsg(type + " SMS Not Sent");
              });
            }, (obj) => {
              console.log(JSON.stringify(obj));
              this.contactProvider.showMsg("Contact Not selected");
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
}
