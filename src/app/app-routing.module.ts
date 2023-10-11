import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductTableComponent } from "./product-table/product-table.component";
import { ProductFormComponent } from "./product-form/product-form.component";

const routes: Routes = [
  { path: "formulario-producto", component: ProductFormComponent },
  { path: "formulario-producto/:id", component: ProductFormComponent },
  { path: "**", component: ProductTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
