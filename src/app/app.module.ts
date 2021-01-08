import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DataComponent } from './data/data.component';
import { FaqComponent } from './faq/faq.component';

@NgModule({
	declarations: [ AppComponent, HeaderComponent, FooterComponent, HomeComponent, AboutComponent, DataComponent, FaqComponent ],
	imports: [ BrowserModule, AppRoutingModule, HttpClientModule, FormsModule ],
	providers: [],
	bootstrap: [ AppComponent, HeaderComponent, FooterComponent, HomeComponent, AboutComponent ]
})
export class AppModule {}
