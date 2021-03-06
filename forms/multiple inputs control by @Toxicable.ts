https://stackblitz.com/edit/angular-toxicable-template-control-container

import { Component, Input } from '@angular/core';
import { ControlContainer, FormControl, FormBuilder, FormGroup } from '@angular/forms'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith'
import 'rxjs/add/observable/combineLatest'

@Component({
  selector: 'form-control',
  template:`
    <input [formControl]="dayControl" />
    <input [formControl]="monthControl" />
    <input [formControl]="yearControl" />  
  `
})
export class FormInput  {
  private dayControl = new FormControl();
  private monthControl = new FormControl();
  private yearControl = new FormControl();

  @Input() set controlName(name: string){
    this.control = this.container.control.get(name) as FormControl;
  }
  control: FormControl

  constructor(
    private container: ControlContainer
  ){}

  ngOnInit(){
    Observable.combineLatest(
      this.dayControl.valueChanges.startWith(''),
      this.monthControl.valueChanges.startWith(''),
      this.yearControl.valueChanges.startWith(''),
      (d, m, y) => `${d}/${m}/${y}`
    ).subscribe(v => this.updateValue(v))
  }

  updateValue(v:any) {
     console.log('child updates')
     this.control.patchValue(v)
     
  }
}


@Component({
  selector: 'my-app',
  template:`
  <form [formGroup]="form">
    <input formControlName="dummy1"> ,<br><br>
    <form-control controlName="date"></form-control>
    
  </form>
<pre>
{{form.value | json}}
</pre>
  `
})
export class AppComponent  {

onloaded(){
  console.log('done')
}

  form: FormGroup
  constructor(
    fb: FormBuilder
  ) {
    this.form = fb.group({
      date: '',
      dummy1: '',
    });
  }
}
