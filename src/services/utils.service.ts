import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { appJson } from 'src/app/interfaces/appJson.interface';
import { months } from 'src/app/interfaces/years.interface';
import { movements } from 'src/app/interfaces/movements.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    public alertController: AlertController, 
    public file: File, 
    public storage: Storage) { }

  // This is the index representing the month
  public M_Index: number;
  // This is the index representing the year
  public Y_Index: number;
  // This is the full dictionary which contains
  // all the data and that gets loaded by the storage
  public appJson: appJson;

  public darkMode: boolean = false;

  public readonly typeColor = {
    entrata: "success",
    uscita: "danger"
  };

  public readonly typeIcon = {
    entrata: "trending-up-outline",
    uscita: "trending-down-outline"
  };

  getMonths(): Array<months> {
    
    const months: Array<string> = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Nobembre",
      "Dicembre"
    ];

    let result: Array<months> = []
    
    months.forEach( (month) => {
      result.push({
        month: month,
        movements: []
      })
    });
    
    return result;
  }
  //
  // Summary:
  //    Checks if the JSON file exists
  //    and will return true or false
  async checkStorage(): Promise<boolean> {
    this.storage.create();

    const dark_mode = await this.storage.get("DARK_MODE");

    if (dark_mode) {
      this.toggleDarkMode(true);
      this.darkMode = true;
    }

    const storage = await this.storage.get("appJson");

    if (storage == null) {
      return false;
    }
    else {
      
      this.appJson = storage;
      return true;
    }
  }

  async showAlert(title: string, message: string, callback = () => {}) {
    const alert = await this.alertController.create({
      cssClass: "alert",
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    
    callback();
  }

  save() {
    this.storage.set("appJson", this.appJson);
  }

  calculateSpendable() {

    let spendable = this.appJson.maxOutGo;

    let spended: number = 0;

    this.appJson.years[this.Y_Index].months[this.M_Index].movements.forEach((movement: movements) => {
      if (movement.type == "uscita") {
        spendable -= movement.amount;
        spended += movement.amount;
      }
    }) 
    
    if (new Date().getMonth() != this.M_Index)
      return `In questo mese hai speso ${spended.toFixed(2)}???`;

    if (spendable < 0)
      return `Limite mensile di ${this.appJson.maxOutGo}??? superato!`;


    return `Puoi spendere ${spendable.toFixed(2)}???`;

  }

  calculateSummary() {

    let totalOutGo = 0;

    let totalEarn = 0;

    this.appJson.years[this.Y_Index].months[this.M_Index].movements.forEach((movement) => {
      if (movement.type == "uscita") {
        totalOutGo += movement.amount;
      }
      if (movement.type == "entrata") {
        totalEarn += movement.amount;
      }
    });

    if (totalOutGo == 0 && totalEarn == 0) {
      return "Non sono presenti movimenti.";
    }

    return `TOTALE ENTRATE: ${totalEarn}??? \n TOTALE USCITE: ${totalOutGo}??? \n DIFFERENZA: ${totalEarn-totalOutGo}???`;

  }

  toggleDarkMode(flag: boolean) {
    let mode = "light";
    if (flag) mode = "dark";

    document.body.setAttribute('color-theme', mode);
    this.darkMode = flag;
    this.storage.set("DARK_MODE", flag);
  }

  writeToDownload(filename, obj) {
    return this.file.writeFile(this.file.externalRootDirectory + '/Download/', filename, obj);
  }

  readData() {
  }

 }
