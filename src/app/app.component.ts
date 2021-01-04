import {Component, Injectable, OnInit} from '@angular/core';
import { loadData } from './app.data';
import { HttpClient } from '@angular/common/http';
import { PeriodicTable } from './app.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent implements OnInit {
  title = 'past';
  table: PeriodicTable = null;

  weight1: any = 0.5;
  weight2: any = 0.5;

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<any> {
    this.table = await loadData(this.http, this.weight1);
  }

  async changeWeights(newValue): Promise<void> {
    this.weight1 = newValue;
    this.weight2 = Math.round((1 - newValue) * 100) / 100;

    this.table = await loadData(this.http, this.weight1);
  }
}
