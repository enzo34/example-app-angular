import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, HttpClientModule,
    ReactiveFormsModule],
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'example-app';
  form: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder)  {
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/list-ai-endpoints').subscribe((data: any) => {
      console.log(data);
      this.createForm(data[0].requestBodySchema.properties); // Create form for the first object
    });
  }

  createForm(properties: any) {
    let formControls: { [key: string]: any } = {};

    const processProperty = (key: string, prop: any) => {
        if (prop.type === 'integer' || prop.type === 'number') {
            return [null, [Validators.required, Validators.pattern("^[0-9]*$")]];
        } else if (prop.type === 'boolean') {
            return [null, Validators.required];
        } else {  // handles string types by default
            return [null, Validators.required];
        }
    };

    const addControls = (props: any, prefix: string = '') => {
      for (const key in props) {
        const fullKey = prefix + key;
        if (props[key].type === 'object') {
          addControls(props[key].properties, fullKey + '.');
        } else {
          formControls[fullKey as string] = processProperty(key, props[key]);
        }
      }
    };

    addControls(properties);  // Start processing with the top-level properties
    this.form = this.formBuilder.group(formControls);
}

  onSubmit() {
    console.log(this.form.value);
  }
}