import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  lct = '';
  id: any = '';

  constructor(private route: ActivatedRoute) {
    this.lct = location.pathname;
    this.id = this.route.snapshot.paramMap.get('name');
  }

  @Output() addEvent = new EventEmitter();

  add() {
    this.addEvent.emit(true);
  }
}
