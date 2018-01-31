import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-issue-refund-dialog',
  templateUrl: './issue-refund-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class IssueRefundDialogComponent implements OnInit {

  moneyForm : FormGroup;
  formErr: any = false;
  modified: boolean = false;
  totalRefund: any = 0;

  constructor(
    public dialogRef: MatDialogRef<IssueRefundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.moneyForm = this.fb.group({
      amount: ['', Validators.required]
    });
    if(this.data.order) {
      this.totalRefund = (parseFloat(this.data.order.line.unitPriceInclTax) * this.data.order.quantity + parseFloat(this.data.order.line.shippingExclTax) * this.data.order.quantity);
      this.moneyForm.patchValue({
        amount: (this.totalRefund - this.data.order.line.refundAmount)
      });

    }
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  refund() {
    if(this.moneyForm.invalid) {
      return;
    }
    let order = this.moneyForm.value;
    order.id = this.data.order.line.id;
    let self = this;
    self.orderService.refund(order).then((data) => {
      self.formErr = false;
      self.data.order = data;
      self.data.isRefund = true;
    }).catch((data) => {
      self.formErr = data;
    });
  }

}
