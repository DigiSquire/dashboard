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
  sortingarray;
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
       // this.mapValues(dataset, barChartVert, barChartHor);
        // this.findTopTen(dataset,barChartVert,barChartHor);
        this.checkDuplicateInObject('Label', dataset,barChartVert,barChartHor)
       //this.removeDuplicates('Label',dataset);
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
  findTopTen(dataset,barChartVert,barChartHor) {
    this.sortingarray=dataset.sort((name1, name2):number => {
     if(parseInt(name1.Value) < parseInt(name2.Value)) return 1;
     if(parseInt(name1.Value) > parseInt(name2.Value)) return -1;
     return 0;
      
  }).slice(0,10);
  console.log(this.sortingarray);
   // this.data.labels = Observable.of(this.dataset).map(x => x + '!!!');
   // Write sort logic here and pass to chart
    // console.log(this.data.lables);
    this.mapValues(this.sortingarray, barChartVert, barChartHor);
  }
  checkDuplicateInObject(propertyName, dataset,barChartVert,barChartHor) {
    var seenDuplicate = false,
    temp1,temp2,temp3,index,
        testObject = {};
  
        dataset.map(function(item) {
      var itemPropertyName = item[propertyName];    
      if (itemPropertyName in testObject) {
        //testObject[itemPropertyName].duplicate = true;
         temp1=testObject[itemPropertyName].Value;
        //item.duplicate = true;
        index = dataset.indexOf(testObject[itemPropertyName]);
    dataset.splice(index, 1);
        temp2=item.Value;
        temp3=parseInt(temp1) + parseInt(temp2)  ;

        console.log(temp3);
        item.Value= temp3.toString();
        //delete testObject[itemPropertyName];
        seenDuplicate = true;
      }
      else {
        testObject[itemPropertyName] = item;
        delete item.duplicate;
      }
    });
  
    return this.findTopTen(dataset,barChartVert,barChartHor);
  }

   removeDuplicates(prop,dataset) {
    return dataset.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
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
