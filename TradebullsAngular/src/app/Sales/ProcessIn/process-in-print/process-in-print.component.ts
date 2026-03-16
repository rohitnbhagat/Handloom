import { Component, OnInit, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessinService } from '../../../services/Sales/processin.service';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../../../services/Masters/brand.service';
import { ProcessIn_Item_ViewModel } from '../../../Models/Sales/ProcessInModel';

@Component({
  selector: 'app-process-in-print',
  templateUrl: './process-in-print.component.html',
  styleUrl: './process-in-print.component.css'
})
export class ProcessInPrintComponent implements OnInit, AfterContentInit {

  IsOpen: boolean = false;
  isModalOpen: boolean = false;
  IsPicVisible: boolean = true;
  
  @Output() BackEvent = new EventEmitter<void>();
    ProcessInID: number = 0;
    VoucherNo: string = "";
    VoucherDate: Date | null = null;
    PartyName: string = "";
    ProcessName: string = "";
    Remarks: string = "";
    TotalQty: number = 0;
    ProductDetails: ProcessIn_Item_ViewModel[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private processinService: ProcessinService,
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

  OpenProcessIn(processInID:number) {
    this.ProcessInID = processInID;
    if (this.ProcessInID > 0) {
      const model:{
      ProcessInID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      ProcessInNo: string
    } = {
      ProcessInID: this.ProcessInID,
      FromDate: null,
      ToDate:  null,
      ProcessInNo: ""
    }

      this.processinService.Get(model).then(
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

              this.VoucherNo = order.ProcessInNo;
              this.VoucherDate = order.ProcessInDate;
              this.ProcessName = order.ProcessName;
              this.PartyName = order.PartyName;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.ProductDetails = [];

              this.processinService.GetOrderDetails(this.ProcessInID).then(
                (responseDetail: any) => {
                  if (!responseDetail.success) {
                    this.toastr.error(responseDetail.message, '', {
                      enableHtml: true,
                      closeButton: true
                    });
                  }
                  else {
                    let srNo: number = 1;
                    this.ProductDetails = Object.values(
                      responseDetail.data.map((t: any) => ({
                        ID: 0,
                        WOPlanningItemComponentID: t.WOPlanningItemComponentID,
                        ProcessOutItemID: t.ProcessOutItemID,
                        WONo: t.WONo || "",
                        ProcessOutNo: t.ProcessOutNo || "",
                        SrNo: t.SrNo,
                        ParentProductID: t.ParentProductID,
                        ProductID: t.ProductID,
                        sku: t.sku,
                        ProductName: t.ProductName,
                        ComponentID: t.ComponentID, 
                        ComponentName: t.ComponentName,
                        Qty: t.Qty,
                        DQty: t.DQty,
                        RQty: t.RQty,
                        Remarks: t.Remarks,
                        Photo: t.Photo??""
                      })).reduce((acc: any, item: any) => {
                        const key = `${item.WOPlanningItemComponentID}|${item.WONo}|${item.ParentProductID}|${item.ProductID}|${item.sku}|${item.ProductName}|${item.ComponentID}|${item.ComponentName}|${item.Remarks}`;
                        
                        if (!acc[key]) {
                          acc[key] = { ...item, SrNo: srNo };
                          srNo++;
                        } else {
                          acc[key].Qty += item.Qty;
                          acc[key].DQty += item.DQty;
                          acc[key].RQty += item.RQty;
                        }
                        return acc;
                      }, {})
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
    const TotalQty = this.ProductDetails.reduce((sum, element) => sum + (element.Qty??0), 0);
    return TotalQty;
  }
  GetTotalDQty(): number{
    const TotalQty = this.ProductDetails.reduce((sum, element) => sum + (element.DQty??0), 0);
    return TotalQty;
  }
  GetTotalRQty(): number{
    const TotalQty = this.ProductDetails.reduce((sum, element) => sum + (element.RQty??0), 0);
    return TotalQty;
  }

  GetProductDetails(ProductID:number): ProcessIn_Item_ViewModel[]{
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
