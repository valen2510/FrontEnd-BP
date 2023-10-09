import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-button-link',
  templateUrl: './button-link.component.html',
  styleUrls: ['./button-link.component.sass']
})
export class ButtonLinkComponent {
  @Input() path:string = "";
  @Input() content:string = "";
}
