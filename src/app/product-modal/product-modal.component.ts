import { Component, Input, OnInit } from "@angular/core";
import { ModalService } from '../services/modal.service';
import { MainService } from "../services/main.service";

@Component({
  selector: "app-product-modal",
  templateUrl: "./product-modal.component.html",
  styleUrls: ["./product-modal.component.sass"],
})
export class ProductModalComponent implements OnInit {
  private isProductDeleted: boolean = false;

  @Input() productId: string = "";
  @Input() productName: string = "";

  constructor(
    private modalService: ModalService,
    private mainService: MainService
  ) {}

  ngOnInit() {
    this.isProductDeleted = false;
  }

  closeModal() {
    this.modalService.$modal.emit({
      showModal: false,
      isProductDeleted: this.isProductDeleted,
    });
  }

  onDeleteProduct() {
    const api = `/bp/products?id=${this.productId}`;

    this.mainService.deletePost(api).subscribe({
      next: (data) => {
        this.isProductDeleted = true;
        window.alert(
          `El producto ha sido eliminado exitosamente ${this.productId}`
        );
      },
      error: (err) => {
        if (err.status === 400) {
          window.alert(err.error);
        }
        if (err.status === 404) {
          window.alert(`No existe un producto con id ${this.productId}`);
        }
      },
    });

    this.closeModal();
  }
}
