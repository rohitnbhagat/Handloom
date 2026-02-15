import { Component, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css'
})
export class BarcodeScannerComponent implements OnDestroy {
  isModalOpen: boolean = false;
  @ViewChild('barscanner', { static: false }) scanner?: BarcodeScannerLivestreamComponent;
  barcode: string = "";
   @Output() ScanSuccess = new EventEmitter<string>();
   IsClose: boolean = true;

   sleep(ms: number) : Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async onValueChanges(result: any) {
    
    this.barcode = result.codeResult.code;
    this.ScanSuccess.emit(this.barcode);
    this.playSound();
    if(this.IsClose)
      this.isModalOpen = false;
    if(this.scanner && this.IsClose)
      this.scanner.stop(); 
    if(!this.IsClose)
      await this.sleep(3000);
  }

playSound()
{
  const a = new Audio("assets/sound/Beep.mp3");
  a.play();
}

  OpenDialog(CloseAfterScan:boolean){
    this.IsClose = CloseAfterScan;
    this.isModalOpen = true;
    if(this.scanner)
    {
        this.scanner.start();
    }
  }
  CloseModel(){
    if(this.scanner)
      this.scanner.stop(); 
    this.isModalOpen = false;
  }
  ngOnDestroy(): void {
    if(this.scanner)
      this.scanner.stop(); 
  }
}