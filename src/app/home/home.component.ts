import {Component, Injectable, OnInit} from '@angular/core';
import {loadInputFile, loadMappingFile, filterSubset, calculateFrequency, calculateEfficacy, combineSubset} from '../app.data';
import {HttpClient} from '@angular/common/http';
import {PeriodicTable} from '../app.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
@Injectable()
export class HomeComponent implements OnInit {
  title = 'past';
  table: PeriodicTable = null;
  template: any = null;
  inputs: any = null;

  weight1: any = 0.5;
  weight2: any = 0.5;

  cohort: string[] = [];
  minDuration: number = null;
  minSampleSize: number = null;

  cohortOptions = [
    {name: 'General population', selected: false},
    {name: 'Children', selected: false},
    {name: 'Adolescents', selected: false},
    {name: 'Elderly', selected: false},
    {name: 'Families', selected: false},
    {name: 'Racial minority', selected: false},
    {name: 'Women only', selected: false},
    {name: 'Men only', selected: false},
    {name: 'Amateur athletes', selected: false},
    {name: 'University students', selected: false},
    {name: 'Office workers', selected: false},
    {name: 'Inactive population', selected: false},
    {name: 'Overweight population', selected: false},
    {name: 'Obese population', selected: false},
    {name: 'Patients with cancer', selected: false},
    {name: 'Patients with diabetes', selected: false},
    {name: 'Patients with heart disease', selected: false},
    {name: 'Patients with serious mental illness', selected: false},
    {name: 'Cancer survivors', selected: false},
  ];

  constructor(private http: HttpClient) {
  }

  async ngOnInit(): Promise<any> {
    this.template = await loadMappingFile(this.http);
    this.inputs = await loadInputFile(this.http);
    console.log(this.template);
    console.log(this.inputs);

    this.applyFilters();

    // this.table = await loadData(this.http, this.weight1);
  }

  async applyFilters() {
    const subset = filterSubset(this.inputs, this.cohort, this.minSampleSize, this.minDuration);
    const frequencies = calculateFrequency(subset);
    const efficacies = calculateEfficacy(subset);
    this.table = combineSubset(this.template, frequencies, efficacies, this.weight1);
  }

  async changeWeights(newValue): Promise<void> {
    this.weight1 = newValue;
    this.weight2 = Math.round((1 - newValue) * 100) / 100;
    // this.table = await loadData(this.http, this.weight1);
    this.applyFilters();
  }

  async changeCohort(): Promise<void> {
    this.cohort = [];
    for (const cohort of this.cohortOptions) {
      if (cohort.selected) {
        this.cohort.push(cohort.name);
      }
    }
    this.applyFilters();
  }

  async changeDuration(): Promise<void> {
    this.applyFilters();
  }
  async changeSampleSize(): Promise<void> {
    this.applyFilters();
  }
}
