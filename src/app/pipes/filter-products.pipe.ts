import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "filterProducts",
})
export class FilterProductsPipe implements PipeTransform {
  transform(
    products: any,
    page: number = 0,
    lines: string = "5",
    search: string = ""
  ): any {

    if (!search.length) {
      console.log(products.slice(page, page + Number(lines)));
      return products.slice(page, page + Number(lines));
    }

    const filteredProducts = products.filter((product: object) => {
      return Object.values(product).some((value) => value.includes(search));
    });

    return filteredProducts;
  }
}
