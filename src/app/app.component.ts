import { Component, Injectable } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
@Injectable()
export class AppComponent {
	title = 'PAST Framework';

	constructor() {}
}
