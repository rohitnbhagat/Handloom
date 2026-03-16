import { Component, OnInit, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GaService } from '../../../services/Sales/ga.service';
import { ToastrService } from 'ngx-toastr';
import { GA_Item_ViewModel } from '../../../Models/Sales/GAModel';
import { BrandService } from '../../../services/Masters/brand.service';

@Component({
  selector: 'app-ga-print',
  templateUrl: './ga-print.component.html',
  styleUrl: './ga-print.component.css'
})
export class GaPrintComponent implements OnInit, AfterContentInit {

  IsOpen: boolean = false;
  isModalOpen: boolean = false;
  IsPicVisible: boolean = true;
  
  @Output() BackEvent = new EventEmitter<void>();
    GAID: number = 0;
    VoucherNo: string = "";
    VoucherDate: Date | null = null;
    Remarks: string = "";
    TotalQty: number = 0;
    ProductDetails: GA_Item_ViewModel[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private gaService: GaService,
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

  OpenGA(GAID:number) {
    this.GAID = GAID;
    if (this.GAID > 0) {
      const model:{
      GAID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      GANo: string
    } = {
      GAID: this.GAID,
      FromDate: null,
      ToDate:  null,
      GANo: ""
    }

      this.gaService.Get(model).then(
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

              this.VoucherNo = order.GANo;
              this.VoucherDate = order.GADate;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.ProductDetails = [];

              this.gaService.GetOrderDetails(this.GAID).then(
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
                        WOPlanningItemID: t.WOPlanningItemID,
                        WONo: t.WONo || "",
                        SrNo: t.SrNo,
                        ParentProductID: t.ParentProductID,
                        ProductID: t.ProductID,
                        sku: t.sku,
                        ProductName: t.ProductName,
                        Qty: t.Qty,
                        Remarks: t.Remarks,
                        Photo: t.Photo??""
                      })).reduce((acc: any, item: any) => {
                        const key = `${item.WOPlanningItemID}|${item.WONo}|${item.ParentProductID}|${item.ProductID}|${item.sku}|${item.ProductName}|${item.Remarks}`;
                        
                        if (!acc[key]) {
                          acc[key] = { ...item, SrNo: srNo };
                          srNo++;
                        } else {
                          acc[key].Qty += item.Qty;
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

  GetProductDetails(ProductID:number): GA_Item_ViewModel[]{
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
