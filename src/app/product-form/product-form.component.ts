import { Component, OnInit} from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators} from '@angular/forms';
import { MainService } from '../services/main.service';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.sass"],
})
export class ProductFormComponent implements OnInit {
  editMode: boolean = false;
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

  constructor(
    private mainService: MainService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const formId = params.get("id");

      if (formId) {
        this.getProducts(formId);
        this.editMode = true;
      } else {
        this.editMode = false;
      }
    });
  }

  private getProducts(productId: string) {
    const api = "/bp/products";
    this.mainService.getPosts(api).subscribe({
      next: (data) => {
        const currentProduct = data.find(
          (product: { id: string }) => product.id === productId
        );
        if (currentProduct) {
          this.productForm.patchValue({
            ...currentProduct,
            dateRelease: this.formatDate(currentProduct.date_release),
            dateRevision: this.formatDate(currentProduct.date_revision),
          });

          this.getId()?.disable();
        } else {
          this.router.navigateByUrl('/formulario-producto');
        }
      },
      error: (err) => {
        if (err.status === 400) {
          window.alert(err.error);
        }
      },
    });
  }

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

  formatDate(date: number | string) {
    return new Date(date).toISOString().split("T")[0];
  }

  addYearToDate(date: Date, year: number) {
    const copyDate = new Date(date);
    const newDate = copyDate.setFullYear(copyDate.getFullYear() + year);
    return newDate;
  }

  onChangeDateRevision() {
    const dateReleaseInput = this.getDateRelease()?.value;
    const dateReleaseObj = new Date(dateReleaseInput);

    if (dateReleaseObj instanceof Date) {
      const newDate = this.addYearToDate(dateReleaseObj, 1);
      const formatNewDate = this.formatDate(newDate);

      const dateRevision = this.getDateRevision();
      dateRevision?.patchValue(formatNewDate);
    }
  }

  private configProductData(product: any): any {
    const values = product.value;

    return {
      id: values.id || this.getId()?.value, 
      name: values.name,
      logo: values.logo,
      description: values.description,
      date_release: values.dateRelease,
      date_revision: this.getDateRevision()?.value,
    };
  }

  private addNewProduct(api: string, data: any) {
    this.mainService.postPost({ api, data }).subscribe({
      next: (res) => {
        window.alert("Se ha creado el producto exitosamente");
        this.clearForm();
      },
      error: (err) => {
        if (err.status === 400) {
          window.alert(err.error);
        }

        if (err.status === 206) {
          window.alert("Formulario incompleto");
        }
      },
    });
  }

  private updateProduct(api: string, data: any) {
    this.mainService.updatePost({ api, data }).subscribe({
      next: (res) => {
        window.alert("Se ha actualizado el producto exitosamente");
      },
      error: (err) => {
        if (err.status === 400) {
          window.alert(err.error);
        }

        if (err.status === 206) {
          window.alert("Formulario incompleto");
        }

        if (err.status === 401) {
          window.alert("Debe ser el author para realizar actualizcion del resgistro");
        }
      },
    });
  }

  submitProductForm() {
    if (!this.productForm.invalid) {
      const api = "/bp/products";
      const data = this.configProductData(this.productForm);

      if (this.editMode) {
        this.updateProduct(api, data);
      } else {
        this.addNewProduct(api, data);
      }
      
    }
  }

  clearForm() {
    if (!this.editMode) {
      this.productForm.reset();
    } else {
      this.productForm.patchValue({
        name: "",
        description: "",
        logo: "",
        dateRelease: "",
        dateRevision: "",
      });

    }
  }
}
