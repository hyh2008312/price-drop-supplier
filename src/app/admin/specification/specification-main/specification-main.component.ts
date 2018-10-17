import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { SpecificationService } from '../specification.service';
import { UserService } from  '../../../shared/services/user/user.service';

import { saveAs } from 'file-saver';
import {AddAttributeDialogComponent} from '../add-attribute-dialog/add-attribute-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-specification-main',
  templateUrl: './specification-main.component.html',
  styleUrls: ['../_specification.scss']
})

export class SpecificationMainComponent implements OnInit {

  category: any = [];

  categoryList: any = [];

  promoteAll: any;

  selectedIndex = 0;
  promoteIndex:any = 1;

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [50];

  subscription: any;

  constructor(
    private specificationService: SpecificationService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
  }

  ngOnInit():void {
    let self = this;
    this.subscription = this.activatedRoute.queryParams.subscribe((data) => {
      switch(data.tab) {
        case 'category':
          self.selectedIndex = 0;
          break;
        case 'attribute':
          self.selectedIndex = 1;
          break;
        default:
          self.selectedIndex = 0;
          break;
      }

      self.changeProducts({
        index: self.selectedIndex
      });
    });
  }

  ngOnDestroy() {

  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
    switch (type) {
      case 1:
        this.promoteIndex = event.pageIndex + 1;
        break;
    }
    this.changeProducts({index: type});
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  changeProducts(event) {
    let page = 0;
    switch (event.index) {
      case 1:
        page = this.promoteIndex;
        this.specificationService.getSpecificationList({
          page,
          page_size: this.pageSize
        }).then((data) => {
          this.length = data.count;
          this.promoteAll = [...data.results];
        });
        break;
      case 0:
        this.specificationService.getCategoryList().then((data) => {
          this.category = [];
          this.categoryList = [...data];
          this.getResultCategory(data);
        });
        break;
      default:
        break;
    }

  }

  productChange($event) {
    switch ($event.status) {
      case 1:
        if($event.event == 'delete') {
          this.promoteAll.splice($event.index,1);
        }
      break;
    }
  }

  getResultCategory(data, index?: any) {
    for(let i = 0; i < data.length; i++) {
      if(data[i].children && data[i].children.length > 0) {
        let idx = (index? (index + '-') : '') + i;
        this.getResultCategory(data[i].children, idx);
      } else {
        const a: any = data[i];
        if(index) {
          let ids = index.split('-');
          a.parent = [];
          let item: any = {};
          for(let j = 0;j < ids.length;j++) {
            if(j == 0) {
              item = this.categoryList[ids[j]];
            } else {
              item = item.children[ids[j]];
            }
            a.parent.push(item);
          }
        }
        this.category.push(data[i]);
      }
    }
  }

  addAttribute() {
    let dialogRef = this.dialog.open(AddAttributeDialogComponent, {
      data: {
        isAddAttribute: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isAddAttribute) {
        this.changeProducts({index: 1});
      }
    });
  }
}