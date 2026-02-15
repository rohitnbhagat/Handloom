import { Component, OnInit } from '@angular/core';

declare function init_sidebar():any;
declare function init_sparklines():any;
declare function init_flot_chart():any;
declare function init_wysiwyg():any;
declare function init_InputMask():any;
declare function init_JQVmap():any;
declare function init_cropper():any;
declare function init_knob():any;
declare function init_IonRangeSlider():any;
declare function init_ColorPicker():any;
declare function init_TagsInput():any;
declare function init_parsley():any;
declare function init_daterangepicker():any;
declare function init_daterangepicker_right():any;
declare function init_daterangepicker_single_call():any;
declare function init_daterangepicker_reservation():any;
declare function init_SmartWizard():any;
declare function init_EasyPieChart():any;
declare function init_charts():any;
declare function init_echarts():any;
declare function init_morris_charts():any;
declare function init_skycons():any;
declare function init_select2():any;
declare function init_validator():any;
declare function init_DataTables():any;
declare function init_chart_doughnut():any;
declare function init_gauge():any;
declare function init_PNotify():any;
declare function init_starrr():any;
declare function init_calendar():any;
declare function init_compose():any;
declare function init_CustomNotification():any;
declare function init_autosize():any;
declare function init_autocomplete():any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  userSession:any;

  ngOnInit(): void {

    this.userSession = JSON.parse(<string>localStorage.getItem('userSession')).data;
    init_sidebar();
    // init_sparklines();
    // init_flot_chart();
    
    // init_wysiwyg();
    // init_InputMask();
    // init_JQVmap();
    // init_cropper();
    // init_knob();
    // init_IonRangeSlider();
    // init_ColorPicker();
    // init_TagsInput();
    // init_parsley();
    // init_daterangepicker();
    // init_daterangepicker_right();
    // init_daterangepicker_single_call();
    // init_daterangepicker_reservation();
    // init_SmartWizard();
    // init_EasyPieChart();
    // init_charts();
    // init_echarts();
    // init_morris_charts();
    // init_skycons();
    // init_select2();
    // init_validator();
    // init_DataTables();
    // init_chart_doughnut();
    // init_gauge();
    // init_PNotify();
    // init_starrr();
    // init_calendar();
    // init_compose();
    // init_CustomNotification();
    // init_autosize();
    // init_autocomplete();
  }

constructor(){
  
}

}
