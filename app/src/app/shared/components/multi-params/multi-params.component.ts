import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormArray, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-multi-params',
  templateUrl: './multi-params.component.html',
  styleUrls: ['./multi-params.component.scss']
})
export class MultiParamsComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  get formSwitches(): FormArray {
    return this.form.get('switches') as FormArray;
  }

  @Output() parametersEvent = new EventEmitter<FormArray>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      filename: this.fb.control(''),
      method: this.fb.control('kernel', Validators.required),
      pages: this.fb.control(1),
      switches: this.fb.array([ this.createItem() ])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      R: this.fb.control(100, [ Validators.required, Validators.min(1) ]),
      T: this.fb.control(5, [ Validators.required, Validators.min(1) ])
    });
  }

  readParameters(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.parametersEvent.emit(this.form.value);
    }
  }

  addItem(): void {
    this.formSwitches.push(this.createItem());
  }

  deleteItem(index: number): void {
    if (this.formSwitches.length > 1) {
      this.formSwitches.removeAt(index);
    }
  }

  isValidField(fieldName: string): boolean {
    return (this.form.controls[fieldName].touched || this.submitted) && this.form.controls[fieldName].errors?.required;
  }

  isValidParameter(fieldName: string, index: number): boolean {
    return (this.formSwitches.controls[index].get(fieldName).touched || this.submitted) &&
    (this.formSwitches.controls[index].get(fieldName).errors?.required || this.formSwitches.controls[0].get(fieldName).errors?.min);
  }
}
