import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { TopicService } from '../topic.service';

@Component({
  selector: 'app-product-delete-variant-dialog',
  templateUrl: './delete-variant-dialog.component.html',
  styleUrls: ['../_topic.scss']
})

export class DeleteVariantDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<DeleteVariantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: TopicService
  ) {
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  delete() {
    let product = {
      id: this.data.id
    };

    let self = this;
    this.productService.deleteVariant(product).then((data) => {
      self.data.isDelete = true;
    });
  }

}
