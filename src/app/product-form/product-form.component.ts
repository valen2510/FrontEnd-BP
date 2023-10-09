import { Component, OnInit} from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators} from '@angular/forms';
import { MainService } from '../services/main.service';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.sass"],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup = new FormGroup({
    id: new FormControl(
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      [this.asyncIdValidator()]
    ),
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    description: new FormControl("", [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
    logo: new FormControl("", [Validators.required]),
    dateRelease: new FormControl("", [Validators.required]),
    dateRevision: new FormControl({ value: "", disabled: true }, [
      Validators.required,
    ]),
  });

  constructor(private mainService: MainService) {}

  ngOnInit(): void {}

  asyncIdValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: Boolean } | null> => {
      const api = `/bp/products/verification?id=${control.value}`;

      return this.mainService.getPosts(api).pipe(
        map((res) => {
          if (res) {
            return { isInvalidId: true };
          }
          return null;
        })
      );
    };
  }

  getId() {
    return this.productForm.get("id");
  }

  getName() {
    return this.productForm.get("name");
  }

  getDescription() {
    return this.productForm.get("description");
  }

  getLogo() {
    return this.productForm.get("logo");
  }

  getDateRelease() {
    return this.productForm.get("dateRelease");
  }

  getDateRevision() {
    return this.productForm.get("dateRevision");
  }

  addYearToDate(date: Date, year: number) {
    const copyDate = new Date(date);
    const newDate = copyDate.setFullYear(copyDate.getFullYear() + year);
    return new Date(newDate);
  }

  onChangeDateRevision() {
    const dateReleaseInput = this.getDateRelease()?.value;
    const dateReleaseObj = new Date(dateReleaseInput);

    if (dateReleaseObj instanceof Date) {
      const newDate = this.addYearToDate(dateReleaseObj, 1);
      const formatNewDate = newDate.toISOString().split("T")[0];

      const dateRevision = this.getDateRevision();
      dateRevision?.patchValue(formatNewDate);
    }
  }

   private configProductData(product: any): any {
    const values = product.value
    return {
      "id": values.id,
      "name": values.name,
      "logo": values.logo,
      "description": values.description,
      "date_release": values.dateRelease,
      "date_revision": this.getDateRevision()?.value,
    };
   }

  submitProductForm() {
    if (!this.productForm.invalid) {
      const api = "/bp/products";
      const data = this.configProductData(this.productForm);
      
      this.mainService.postPost({ api, data }).subscribe({
        next: (res) => {
          window.alert('Se ha creado el producto exitosamente');
          this.clearForm();
        },
        error: (err) => {
          if (err.status === 400){
            window.alert(err.error)
          }

          if (err.status === 206) {
            window.alert('Formulario incompleto');
          }
        },
      })
    }
  }

  clearForm() {
    this.productForm.reset();
  }
}
