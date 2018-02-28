import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import * as ctAxisTitle from 'chartist-plugin-axistitle/dist/chartist-plugin-axistitle.js';
import * as ctThreshold from 'chartist-plugin-threshold/dist/chartist-plugin-threshold.js';
import * as Papa from 'papaparse/papaparse.min.js';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CsvParserService } from '.././csv-parser.service';

declare var $: any;
interface Post {
  title: string;
  status: string;
}


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class DashboardComponent implements OnInit{
    postsCol: AngularFirestoreCollection<Post>;
    posts: Observable<Post[]>;

    barChartVertical: any;
    barChartHor: any;
    serverDataVert: any;
    serverDataHor;
    barOptions: any;
    // State for dropzone CSS toggling
    isHovering: boolean;
    isGrayed: boolean;
    constructor(private afs: AngularFirestore, public dataService: CsvParserService) {
    }
    toggleHover(event: boolean) {
        this.isHovering = event;
    }
    startUpload(event: FileList) {
        // The File object
        const file = event.item(0);
        // if (file.type.split('/')[1] !== 'vnd.ms-excel') {
        //     this.dataService.showNotification('top', 'right', this.dataService.updtMessages[2],
        //     this.dataService.colors[3], 'ti-face-sad');
        //     return;
        // }else {
           
            // Papa.parse(file, this.config);
            this.dataService.parse(file, this.barChartVertical, this.barChartHor);
            // this.dataService.findTopTen();
            this.dataService.showNotification('top', 'right', this.dataService.updtMessages[0],
            this.dataService.colors[1], 'ti-face-smile'); this.isGrayed = false;
        // }
    }
    undoUpdate() {
        this.isGrayed = true;
        this.dataService.undoUpdate(this.barChartVertical, this.serverDataVert);
        this.dataService.undoUpdate(this.barChartHor, this.serverDataHor);
        this.dataService.showNotification('top', 'right', this.dataService.updtMessages[1], this.dataService.colors[0],
        'ti-face-smile');
    }
    ngOnInit() {
        this.isGrayed = true;
    //   this.postsCol = this.afs.collection('stats');
    //  this.posts = this.postsCol.valueChanges();
      //  var dataSales = {
        /*  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          series: [
             [10,12,15,12,14.5,16],
            [2,2.8,3,4,4.4,6]
          ]
        };

        var optionsSales = {
          low: 0,
          high: 20,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
            createLabel :Chartist.createLabel(

            ),
          showLine: true,
          showPoint: false,
        };

        var responsiveSales: any[] = [
          ['screen and (max-width: 640px)', {
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        new Chartist.Line('#chartHours', dataSales, optionsSales, responsiveSales);*/
        var chart = new Chartist.Line('.ct-chart', {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                        series: [ [10,12,15,12,14.5,16],
                        [2,2.8,3,4,4.4,6]]
                    }, {
                        chartPadding: {
                            top: 20,
                            right: 0,
                            bottom: 20,
                            left: 0
                        },
                        axisY: {
                            onlyInteger: true
                        },
                        plugins: [
                            ctAxisTitle({
                                axisX: {
                                    axisTitle: 'Month',
                                    axisClass: 'ct-axis-title',
                                    offset: {
                                        x: 0,
                                        y: 50
                                    },
                                    textAnchor: 'middle'
                                },
                                axisY: {
                                    axisTitle: 'Revenue (in mil)',
                                    axisClass: 'ct-axis-title',
                                    offset: {
                                        x: 0,
                                        y: -1
                                    },
                                    flipTitle: false
                                }
                            })
                        ]
                    });

        var data = {
            labels: ['App1', 'App2', 'App3', 'App4', 'App5'],
          series: [
            [4,1.2,2,17,12]
          ]
        };

        var options = {
          seriesBarDistance: 10,
          reverseData: false,
          horizontalBars: true,
          axisY: {
            offset: 70
          },
          plugins: [
              ctAxisTitle({
                  axisX: {
                      axisTitle: 'Quality(Defects/100PDs)',
                      axisClass: 'ct-axis-title',
                      offset: {
                          x: 0,
                          y: 32
                      },
                      textAnchor: 'middle'
                  },
                  axisY: {
                      axisTitle: 'Apps/Projects',
                      axisClass: 'ct-axis-title',
                      offset: {
                          x: 0,
                          y: 0
                      },
                      flipTitle: false
                  }
              })
          ]
        };
        this.serverDataHor = Object.assign({}, data);
        console.log(this.serverDataHor);
        this.barChartHor = new Chartist.Bar('#chartActivity', data, options);
        // Bar chart verical
        var dataPreferences = {

            labels: ['Solution Design', 'Testing', 'Development', 'HR', 'Customer Requirements'],
            series: [1.2, 2, 2.5, 4.8, 7.2]
        };

        var optionsPreferences = {
          distributeSeries: true,
          plugins: [
            ctThreshold({
              threshold: 2,
                  classNames: {
                      aboveThreshold: 'ct-threshold-above',
                      belowThreshold: 'ct-threshold-below'
                  }
            }
          ),
              ctAxisTitle({
                  axisX: {
                      axisTitle: 'Risk Categories',
                      axisClass: 'ct-axis-title',
                      offset: {
                          x: 0,
                          y: 32
                      },
                      textAnchor: 'middle'
                  },
                  axisY: {
                      axisTitle: 'Risk Exposure',
                      axisClass: 'ct-axis-title',
                      offset: {
                          x: 0,
                          y: 0
                      },
                      flipTitle: false
                  }
              })

          ]

        };
        this.serverDataVert = Object.assign({}, dataPreferences);
        console.log(this.serverDataVert);
        this.barChartVertical = new Chartist.Bar('#chartPreferences', dataPreferences, optionsPreferences);
    }
}
