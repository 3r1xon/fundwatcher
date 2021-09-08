import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UtilsService } from 'src/services/utils.service';
import { years } from '../interfaces/years.interface';

@Component({
  selector: 'main',
  templateUrl: './mainpage.page.html',
  styleUrls: ['./mainpage.page.scss'],
})
export class MainPage implements OnInit {

  constructor(
    public _utils: UtilsService, 
    public alertController: AlertController) { }

  ngOnInit() {
  }

  async configureRow() {

    let type: string = "entrata";

    const alert = await this.alertController.create({
      header: "Movimento",
      message: "Seleziona il tipo di movimento",
      inputs: [
        {
          name: 'entrata',
          type: 'radio',
          label: 'Entrata',
          checked: true,
          handler: (response) => {
            type = response.name;
          }
        },
        {
          name: 'uscita',
          type: 'radio',
          label: 'Uscita',
          checked: false,
          handler: (response) => {
            type = response.name;
          }
        }
      ],
      buttons: [
        {
          text: "Annulla"
        },
        {
        text: "Avanti",
        handler: () => {
          this.addRow(type);
        }
      }]
    });

    await alert.present();
  }

  async addRow(type: string) {
    let header = "Entrata";
    let message = "Descrivi la tua entrata (es: stipendio, bonifico)";
    let placeholder = "Motivazione dell\' entrata";

    if (type == "uscita") {
      header = "Uscita";
      message = "Descrivi la tua uscita (es: spesa, tassa)";
      placeholder = "Motivazione dell\' uscita";
    }

    const alert = await this.alertController.create({
      header: header,
      message: message,
      inputs: [
        {
          name: 'ammonto',
          type: 'number',
          placeholder: 'Ammonto in €',
          attributes: {
            inputmode: 'decimal'
          }
        },
        {
          name: 'motivo',
          type: 'text',
          placeholder: placeholder,
        },
        {
          name: 'data',
          type: 'date',
          value: `${new Date().toLocaleDateString('en-CA')}`
        }
      ],
      buttons: [
        {
          text: "Annulla"
        },
        {
        text: "Aggiungi",
        handler: (data) => {

          if (data.ammonto == '' || data.motivo == '') {
            this._utils.showAlert("Attenzione", "L'ammonto o la data non sono stati inseriti!", () => { });
            return;
          }
          this._utils.appJson.years[this._utils.Y_Index]
            .months[this._utils.M_Index].movements.push({
              amount: parseFloat(parseFloat(data.ammonto).toFixed(2)),
              reason: data.motivo,
              type: type,
              date: new Date(data.data).toLocaleString('it-UT').split(',')[0]
            });
          this._utils.save();
        }
      }]
    });
      
    await alert.present();
  }

  async showDatePicker() {

    console.log(this._utils.appJson);
    console.log("Y_Index: " + this._utils.Y_Index);
    console.log("M_Index: " + this._utils.M_Index);

    const alert = await this.alertController.create({
      header: "Data",
      message: "Inserisci l'anno che desideri visualizzare",
      inputs: [
        {
          name: 'anno',
          type: 'number',
        }
      ],
      buttons: [
        {
          text: "Annulla"
        },
        {
        text: "Seleziona",
        handler: (data) => {
          let flg = false;
          this._utils.appJson.years.forEach((row: years, index: number) => {

            if (row.year == data.anno) {
              this._utils.Y_Index = index;
              flg = true;
              return;
            }
          })

          if (flg) return;
          
          this._utils.showAlert("Errore", 
          `La data che hai selezionato non è presente! Ciò significa che nessun movimento è mai stato registrato in data ${data.anno}`,
          () => { this.showDatePicker() });
        }
      }]
    });

    await alert.present();
  }
  
  async deleteRow(index: number) {

    const alert = await this.alertController.create({
      header: "Attenzione",
      message: "Sei sicuro di voler eliminare la riga selezionata?",
      buttons: [
        {
          text: "Annulla"
        },
        {
        text: "Elimina",
        handler: () => {
          this._utils.appJson.years[this._utils.Y_Index]
          .months[this._utils.M_Index]
          .movements.splice(index, 1);
          this._utils.save();
        }
      }]
    });

    await alert.present();
  }

  async showItem(index: number) {

    const alert = await this.alertController.create({
      header: 
      `
      ${this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].movements[index].amount}€  
      ${this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].movements[index].type}
      ${this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].movements[index].date}
      `,
      message: `${this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].movements[index].reason}`,
      buttons: [
        {
          text: "Modifica",
          handler: () => {
            this.editRow(index);
          }
        },
        {
          text: "Chiudi"
        }
      ]
    });

    await alert.present();

  }


  async editRow(index: number) {

    const amount = this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].movements[index].amount;

    const type = this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].movements[index].type;

    const date = this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].movements[index].date;

    const reason = this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].movements[index].reason;

    let t_date = date;
    // TODO:
    //    Da cambiare
    for(let i = 0; i < 3; i++) {
      t_date = t_date.replace('/', '-');
    }
    // TODO:
    //    Da cambiare/rivedere il modo per formattare la data, non è ottimizzato né logico.
    const rAll = (d) => {
      d = new Date(d);
      return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    }

    t_date = new Date(t_date.split('-').reverse().join('-')).toLocaleDateString('en-CA');

    const alert = await this.alertController.create({
      header: 
      `Modifica ${type}`,
      inputs: [
        {
          name: 'ammonto',
          type: 'number',
          placeholder: 'Ammonto in €',
          value: amount
        },
        {
          name: 'motivo',
          type: 'text',
          placeholder: `Motivo dell'${type}`,
          value: reason
        },
        {
          name: 'data',
          type: 'date',
          value: t_date
        }
      ],
      buttons: [
        {
          text: "Annulla"
        },
        {
          text: "Fatto",
          handler: (data) => {
            this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].movements[index] = {
              amount: parseFloat(parseFloat(data.ammonto).toFixed(2)),
              reason: data.motivo,
              type: type,
              date: rAll(data.data)
            };
            this._utils.save();
          }
        }
      ]
    });

    await alert.present();

  }

  openSummary() {

    const selectedMonth = this._utils.appJson.years[this._utils.Y_Index].months[this._utils.M_Index].month; 

    this._utils.showAlert(`Riepilogo di ${selectedMonth}`, this._utils.calculateSummary(), () => {});
  }


}
