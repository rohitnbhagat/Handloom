import { Component, OnInit, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkorderplanningService } from '../../../services/Sales/workorderplanning.service';
import { ToastrService } from 'ngx-toastr';
import { WorkOrderPlanning_Item } from '../../../Models/Sales/WorkOrderPlanningModel';
import { BrandService } from '../../../services/Masters/brand.service';

@Component({
  selector: 'app-workorderplanning-print',
  templateUrl: './workorderplanning-print.component.html',
  styleUrl: './workorderplanning-print.component.css'
})
export class WorkorderplanningPrintComponent  implements OnInit, AfterContentInit {

  IsOpen: boolean = false;
  isModalOpen: boolean = false;
  IsPicVisible: boolean = true;
  
  @Output() BackEvent = new EventEmitter<void>();
    WOPlanningID: number = 0;
    VoucherNo: string = "";
    VoucherDate: Date | null = null;
    WOType: string = "";
    PreparedByName: string = "";
    AssignedToName: string = "";
    AuthorizedByName: string = "";
    StartDate: Date | null = null;
    EndDate: Date | null = null;
    DueDays: number | null = null;
    Remarks: string = "";
    TotalQty: number = 0;
    ProductDetails: WorkOrderPlanning_Item[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private workorderplanningService: WorkorderplanningService,
    private toastr: ToastrService
  ) {}
  ngAfterContentInit(): void {
    
  }

  ngOnInit(): void {
    
  }
  CloseModel(){
    this.isModalOpen = false;
    this.IsOpen = false;
    this.BackEvent.emit();
  }
  BacktoList(){
    this.IsOpen = false;
    this.BackEvent.emit();
  }

  btnOkay_Click(){
    this.IsOpen = true;
    this.isModalOpen = false;
  }

  OpenWorkOrderPlanning(woplanningID:number) {
    this.WOPlanningID = woplanningID;
    if (this.WOPlanningID > 0) {
      const model:{
      WOPlanningID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      WONo: string
    } = {
      WOPlanningID: this.WOPlanningID,
      FromDate: null,
      ToDate:  null,
      WONo: ""
    }

      this.workorderplanningService.Get(model).then(
        (response: any) => {

          if (!response.success) {
            this.toastr.error(response.message, '', {
              enableHtml: true,
              closeButton: true
            });
          }
          else {
            const order = response.data[0];
            if (order) {

              this.VoucherNo = order.WONo;
              this.VoucherDate = order.WODate;
              this.WOType = order.WOType;
              this.PreparedByName = order.PreparedByName;
              this.AssignedToName = order.AssignedToName;
              this.AuthorizedByName = order.AuthorizedByName;
              this.StartDate = order.StartDate;
              this.EndDate = order.EndDate;
              this.DueDays = order.DueDays;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.ProductDetails = [];

              this.workorderplanningService.GetOrderDetails(this.WOPlanningID).then(
                (responseDetail: any) => {
                  if (!responseDetail.success) {
                    this.toastr.error(responseDetail.message, '', {
                      enableHtml: true,
                      closeButton: true
                    });
                  }
                  else {
                    this.ProductDetails = responseDetail.data.map(
                      (t: any) => (
                        {
                          ID: t.ID,
                          SrNo: t.SrNo,
                          SalesOrderNo: t.SalesOrderNo,
                          ParentProductID: t.ParentProductID,
                          ProductID: t.ProductID,
                          ProductName: t.ProductName,
                          AttributeValues: t.AttributeValues.map((m: any) => ({
                            ProductAttributeID: m.ProductAttributeID,
                            ProductAttributeValueID: m.ProductAttributeValueID,
                            Name: m.name,
                            Option: m.option
                          })),
                          Qty: t.Qty,
                          Remarks: t.Remarks,
                          Photo: t.Photo,
                          SOItems: (t.SOItems ? t.SOItems.map((m: any) => ({
                            SalesOrderItemID: m.SalesOrderItemID,
                            SalesOrderNo: m.SalesOrderNo,
                            Qty: m.Qty
                          })) : []),
                          Components: (t.Components ?t.Components.map((m: any) => ({
                            ComponentID: m.ComponentID,
                            ComponentName: m.ComponentName
                          })) : [])
                        }
                      )
                    );

                    

                   
                  }
                }
              );


            }
          }

        }).finally(() => {
          this.IsOpen = true;
    this.isModalOpen = false;
        });
    }
  }

 

  GetTotalQty(): number{
    const TotalQty = this.ProductDetails.reduce((sum, element) => sum + element.Qty, 0);
    return TotalQty;
  }

  GetProductDetails(ProductID:number): WorkOrderPlanning_Item[]{
    const filter = this.ProductDetails.filter(t=>t.ParentProductID == ProductID);
    return filter;
  }

  Print(): void {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    // Get the content from the div
    const content = document.getElementById('contenttoprint')?.innerHTML;

    const iframeDocument = iframe.contentWindow?.document;
    iframeDocument?.open();
    iframeDocument?.write('<html><head><title>Print</title>');


    iframeDocument?.write('<link rel="stylesheet" href="../../styles.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/bootstrap/dist/css/bootstrap.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/font-awesome/css/font-awesome.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/nprogress/nprogress.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/iCheck/skins/flat/green.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/google-code-prettify/bin/prettify.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/select2/dist/css/select2.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/switchery/dist/switchery.min.cs" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/starrr/dist/starrr.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/jqvmap/dist/jqvmap.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/bootstrap-daterangepicker/daterangepicker.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/animate.css/animate.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/build/css/custom.css" type="text/css">');

    // let strScript: string = "<script>";
    //  strScript = strScript + "window.onload = function() { window.print(); window.close();};";
    //  strScript = strScript + "</script>";
    //  iframeDocument?.write(strScript);

     iframeDocument?.write('</head><body>');
     iframeDocument?.write('<div class="container body"><div class="main_container"><div class="right_col m-0 p-0">');
     iframeDocument?.write(content || '');
     iframeDocument?.write('</div></div></div>');
     iframeDocument?.write('</body></html>');
     iframeDocument?.close();

     iframe.onload = () => {
      iframe.contentWindow?.focus();  // Ensure the iframe has focus
      iframe.contentWindow?.print();  // Trigger print dialog
      document.body.removeChild(iframe);  // Clean up by removing iframe after print
    };
    
  }



}
