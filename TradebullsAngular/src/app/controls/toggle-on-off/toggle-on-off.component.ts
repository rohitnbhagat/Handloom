import { Component, Input,  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-on-off',
  templateUrl: './toggle-on-off.component.html',
  styleUrl: './toggle-on-off.component.css'
})
export class ToggleOnOffComponent {
  @Input() isChecked:boolean = false;
  @Input() showLabel:boolean = true;
  @Input() onLabel:string = "ON";
  @Input() offLabel:string = "OFF";
  @Output() checkedChange = new EventEmitter<boolean>();
  
  val:boolean = false;

  constructor(){
    this.val = this.isChecked;
  }

  toggle() {
    this.isChecked = !this.isChecked;
    this.checkedChange.emit(this.isChecked);  // Emit the new value
    console.log('Toggle switched to:', this.isChecked ? 'ON' : 'OFF');
  }
}
