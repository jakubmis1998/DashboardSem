import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-multi-params',
  templateUrl: './multi-params.component.html',
  styleUrls: ['./multi-params.component.scss']
})
export class MultiParamsComponent implements OnInit {

  parametersForm: FormGroup;
  get formItems() {
    return this.parametersForm.get('items') as FormArray;
  }

  @Output() parametersEvent = new EventEmitter<FormArray>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.parametersForm = this.fb.group({
      items: this.fb.array([ this.createItem() ])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      R: '',
      T: ''
    });
  }

  readParameters() {
    this.parametersEvent.emit(this.parametersForm.value.items);
  }

  addItem() {
    this.formItems.push(this.createItem());
  }

  deleteItem(index) {
    this.formItems.removeAt(index);
  }
}
