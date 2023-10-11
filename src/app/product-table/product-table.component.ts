import { Component, OnInit } from "@angular/core";
import { MainService } from "../services/main.service";
import { ModalService } from "../services/modal.service";

@Component({
  selector: "app-product-table",
  templateUrl: "./product-table.component.html",
  styleUrls: ["./product-table.component.sass"],
})
export class ProductTableComponent implements OnInit {
  private api: string = "/bp/products";
  products = new Array<any>();
  search: string = "";
  optionLines = [5, 10, 20];
  page: number = 0;
  selectedLines: string = "5";
  lines: number = Number(this.selectedLines);
  showDropdown: boolean = false;
  selectedProductId: string = "";
  selectedProductName: string = "";
  showModal: boolean = false;

  constructor(
    private mainService: MainService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.modalService.$modal.subscribe((response) => {
      this.showModal = response.showModal;

      if (response.isProductDeleted) {
        this.getProducts()
      }
    });
  }

  private getProducts() {
    this.mainService.getPosts(this.api).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        if (err.status === 400) {
          window.alert(err.error);
        }
        
      },
    });
  }

  onChangeSearch(search: string) {
    this.page = 0;
    this.search = search;
  }

  onChangeLines() {
    this.lines = Number(this.selectedLines);
  }

  nextPage() {
    this.page += this.lines;
  }

  previousPage() {
    if (this.page > 0) {
      this.page -= this.lines;
    }
  }

  onClickDropdown(productId: string, productName: string) {
    this.showDropdown = !this.showDropdown;

    if (this.showDropdown) {
      this.selectedProductId = productId;
      this.selectedProductName = productName;
    }
  }

  onOpenModal() {
    this.showModal = true;
  }
}
