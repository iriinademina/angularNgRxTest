import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-edit-product-form',
  templateUrl: './edit-product-form.component.html',
  styleUrls: ['./edit-product-form.component.scss'],
})
export class EditProductFormComponent implements OnInit {
  @Input() productData: Product;
  @Output() changeProduct: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() deleteProduct: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  productEditForm: FormGroup;
  isForm: boolean;

  constructor() {
    this.isForm = false;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const { title, description, price } = this.productData;
    this.productEditForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      description: new FormControl(description, Validators.required),
      price: new FormControl(price, Validators.required),
    });
    this.isForm = true;
  }

  onSubmit() {
    this.changeProduct.emit(this.productEditForm.value);
  }

  onDelete() {
    this.deleteProduct.emit(true);
  }
}
