import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/services/utils.service';
import { appJson } from '../interfaces/appJson.interface';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    public _utils: UtilsService,
    private storage: Storage) {}
    //private socialSharing: SocialSharing) { }

  public tmpSettings: appJson = { ...this._utils.appJson };

  ngOnInit() {
  }

  save() {
    this._utils.appJson = { ...this.tmpSettings };
    this._utils.save();

    this._utils.showAlert(`Attenzione, ${this._utils.appJson.name}`, "Il salvataggio è stato effettuato con successo.", () => {});
  }

  undo() {
    this.tmpSettings = { ...this._utils.appJson };
  }

  exportData() {
    this._utils.showAlert(`Non disponbile.`, "Questa funzione è ancora in fase di programmazione.", () => { });

    let text = 
    `
Nome: ${this._utils.appJson.name}, \n
Stipendio: ${this._utils.appJson.salary}€, \n
Giorno dello stipendio: ${this._utils.appJson.payday}, \n
Limite uscite mensili: ${this._utils.appJson.maxOutGo}€ \n`;

    this._utils.appJson.years.forEach((year, y_index) => {
      text += `\n[Anno: ${year.year}] \n`;
      this._utils.appJson.years[y_index].months.forEach((month, m_index) => {
        text += `Mese: ${month.month} \n`;
        this._utils.appJson.years[y_index].months[m_index].movements.forEach((movement) => {
          text += `    ${movement.amount}€ | ${movement.type} | ${movement.date} | ${movement.reason} \n`;
        });
      });
    });

    console.log(text);

    //this._utils.showAlert(``, text, () => { });

    //this.socialSharing.shareViaWhatsApp(text);
  }
  
  toggleDarkMode() {
    this._utils.toggleDarkMode(!this._utils.darkMode);
  }

}
