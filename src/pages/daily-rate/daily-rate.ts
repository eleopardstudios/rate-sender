import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, AlertController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

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
    private _FB: FormBuilder) {
    this.form = this._FB.group({
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
    msgArray.push("ChickPeas Revised Rates");
    let rates = this.form.value.rates;
    rates.forEach(rate => {
      msgArray.push("\n", rate.chickPeasType, " @ ", rate.from);
      if(rate.to && rate.to != "") {
        msgArray.push(" - ", rate.to, "/-", ", ");
      } else {
        msgArray.push("/-, ");
      }
    });
    msgArray.push("\nSpot Indore, \nRegards, \nShree Overseas, \n910910690, \n910910680");   

    let msg: any = msgArray.join(""); 

    let alert = this.alertCtrl.create({
      title: 'Confirm SMS',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log(msg);
          }
        }
      ]
    });
    alert.present();
  }
}
