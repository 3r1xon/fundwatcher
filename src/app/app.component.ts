import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/services/utils.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  private defaultColor: string = "primary";
  private selectedColor: string = "danger";

  public appPages = [
    { title: 'Gennaio', color: this.defaultColor },
    { title: 'Febbraio', color: this.defaultColor },
    { title: 'Marzo', color: this.defaultColor },
    { title: 'Aprile', color: this.defaultColor },
    { title: 'Maggio', color: this.defaultColor },
    { title: 'Giugno', color: this.defaultColor },
    { title: 'Luglio', color: this.defaultColor },
    { title: 'Agosto', color: this.defaultColor },
    { title: 'Settembre', color: this.defaultColor },
    { title: 'Ottobre', color: this.defaultColor },
    { title: 'Novembre', color: this.defaultColor },
    { title: 'Dicembre', color: this.defaultColor },
  ];

  constructor(
    public _utils: UtilsService, 
    private alertController: AlertController,
    private router: Router,
    private menu: MenuController,
    private storage: Storage) {
  }

  async ngOnInit() {

    const res = await this._utils.checkStorage();

    if (!res) {
      this.showConfiguration();
    } else {
      this.addNewYear();
      this.autoSelectDay();
    }
  }

  selectMonth(index: number) {
    if (window.location.href.includes('settings')) {
      this.router.navigate(['']);
    }
    
    this.appPages.forEach((item) => {
      item.color = this.defaultColor; 
    });
    this._utils.M_Index = index;
    this.appPages[index].color = this.selectedColor;
  }

  autoSelectDay() {
    const actualMonth = new Date().getMonth();

    this._utils.appJson.years.forEach((year, index) => {
      if (year.year == new Date().getFullYear()) {
        this._utils.Y_Index = index;
      }
    });

    this.selectMonth(actualMonth);
  }

  async showConfiguration() {
    const alert = await this.alertController.create({
      cssClass: 'configuration',
      header: 'Inizia la configurazione!',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Come ti chiami?'
        },
        {
          name: 'salary',
          type: 'number',
          placeholder: 'Guadagno mensile'
        },
        {
          name: 'payday',
          type: 'number',
          placeholder: 'Giorno dello stipendio'
        },
        {
          name: 'maxOutgo',
          type: 'number',
          placeholder: 'Limite uscite mensili'
        },
      ],
      buttons: [
        {
          text: 'Avanti',
          handler: (data) => {
            
            if (data.name     == "" || 
                data.salary   == "" ||
                data.payday   == "" ||
                data.maxOutgo == "") {

                this._utils.showAlert("Attenzione!", 
                  "I campi sono obbligatori per lasciare che l'app possa fare i dovuti calcoli.", 
                  () => { this.showConfiguration(); });
            } else {
              this._utils.appJson = {
                name: data.name,
                salary: parseFloat(parseFloat(data.salary).toFixed(2)),
                maxOutGo: parseFloat(parseFloat(data.maxOutgo).toFixed(2)),
                payday: parseFloat(parseFloat(data.payday).toFixed(2)),
                years: []
              };
              this.addNewYear();
              this._utils.M_Index = new Date().getMonth();
              this._utils.toggleDarkMode(true);
              this._utils.save();
            }

          }
        }
      ]
    });

    await alert.present();
  }


  addNewYear() {
    let yearExist: boolean = false;

    const thisYear: number = new Date().getFullYear();

    this._utils.appJson.years.forEach((years) => {
      if (years.year == thisYear) {
        yearExist = true;
      }
    });

    if (!yearExist) {
      
      this._utils.appJson.years.push({
        year: new Date().getFullYear(),
        months: this._utils.getMonths()
      });
      this._utils.Y_Index = this._utils.appJson.years.length-1;
      this._utils.save();
    }

  }

  showSettings() {
    this.router.navigate(['settings']);
    this.menu.close();

    this.appPages.forEach((item) => {
      item.color = this.defaultColor; 
    });
  }
}
