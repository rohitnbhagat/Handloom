import { Component, Input,  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent {

  @Input() header:string = "";
  isModalOpen = false;
  @Output() close = new EventEmitter<void>();

  closeModal(){
    this.isModalOpen = false;
    this.close.emit();
  }

  openModal(){
    this.isModalOpen = true;
  }

}
