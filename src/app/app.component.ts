import { Component, OnInit } from '@angular/core';
import { periodicTable } from './app.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'past';
  table = periodicTable;

  ngOnInit(): void {

  }
}
