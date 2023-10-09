import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "filterProducts",
})
export class FilterProductsPipe implements PipeTransform {
  transform(
    products: any,
    page: number = 0,
    lines: number = 5,
    search: string = ""
  ): any {

    let filteredProducts = products;

    if (search.length) {
      filteredProducts = products.filter((product: object) => {
        return Object.values(product).some((value) => value.includes(search));
      });
    }  

    return filteredProducts.slice(page, page + Number(lines));
  }
}
