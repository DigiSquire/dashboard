import { Injectable } from '@angular/core';
import * as Chartist from 'chartist';
import * as Papa from 'papaparse/papaparse.min.js';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
declare var $: any;
@Injectable()
export class CsvParserService {
  colors = ['info', 'success', 'warning', 'danger'];
  updtMessages = ['Table updated successfully',
   'You have successfully undone your changes: <b>Server data restored</b>',
   'Please upload a file with <b>.csv extension</b>'];
  config;
  parseDataObj;
  dataVert;
  dataHor;
  constructor() { }
  parse(file: any, barChartVert, barChartHor) {
    Papa.parse(file, {
      delimiter: '',	// auto-detect
      newline: '',	// auto-detect
      quoteChar: '"',
      header: true,
      complete: (results) => {
        const dataset = results.data;
        console.log(dataset);
        this.mapValues(dataset, barChartVert, barChartHor);
        // this.findTopTen(dataset);
      },
      skipEmptyLines: true
    });
  }
  mapValues(dataset, barChartVert, barChartHor) {
    this.dataVert = {
      // set our labels (x-axis) to the Label values from the JSON data
      labels: dataset.map(function (id) {
        return id.Label;
      }),
      // set our values to Value value from the JSON data
      series: dataset.map(function (id) {
        return id.Value;
      })
    };
    console.log(this.dataVert);
    barChartVert.update(this.dataVert);
    this.dataHor = {
      // set our labels (x-axis) to the Label values from the JSON data
      labels: dataset.map(function (id) {
          return id.Label2;
      }),
      // set our values to Value value from the JSON data
      series: [dataset.map(function (id, val) {
          return id.Value2;
      })]
    };
    console.log(this.dataHor);
    barChartHor.update(this.dataHor);
  }
  findTopTen(dataset) {
   // this.data.labels = Observable.of(this.dataset).map(x => x + '!!!');
   // Write sort logic here and pass to chart
    // console.log(this.data.lables);
  }
  showNotification(from, align, updtMessages, color, icon) {
    $.notify({
      icon: icon,
      message: updtMessages

    }, {
        type: color,
        timer: 400,
        placement: {
          from: from,
          align: align
        }
      });
  }
  undoUpdate(barChart, serverData): void {
    barChart.update(serverData);
}

}
