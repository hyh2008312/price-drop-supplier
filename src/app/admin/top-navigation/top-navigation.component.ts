import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AdminService} from '../admin.service';
import {UserService} from '../../shared/services/user/user.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./_top-navigation.scss']
})

export class TopNavigationComponent implements OnInit {

  contents = [{
    id: 0,
    text: 'HOME',
    router: './dashboard',
    isActive: false,
    staff: false
  }, {
    id: 1,
    text: 'PRODUCT',
    router: './product',
    isActive: false,
    staff: false
  }, {
    id: 2,
    text: 'FLASH SALE',
    router: './promote',
    isActive: false,
    staff: true
  }, {
    id: 3,
    text: 'ORDERS',
    router: './order',
    isActive: false,
    staff: false
  }, {
    id: 4,
    text: 'CUSTOMER SUPPORT',
    router: './customerService',
    isActive: false,
    staff: false
  }, {
    id: 5,
    text: 'EVENTS',
    router: './event',
    isActive: false,
    staff: true
  }, {
    id: 6,
    text: 'LUCKY DRAW',
    router: './lottery',
    isActive: false,
    staff: true
  }, {
    id: 7,
    text: 'NOTIFICATION',
    isActive: false,
    staff: true
  }, {
    id: 8,
    text: '用户审核',
    router: './user',
    isActive: false,
    staff: true
  }];

  accounts = [
    {
      id: 0,
      text: 'Payment Settings',
      router: './account/paymentsettings',
      isActive: false
    },
    {
      id: 1,
      text: 'Account Balance',
      router: './account/balance',
      isActive: false
    },
    {
      id: 2,
      text: 'Disputes',
      router: './account/balance',
      isActive: false
    },
    {
      id: 4,
      text: 'Settings',
      router: './account/balance',
      isActive: false
    },
    {
      id: 5,
      text: 'Logout',
      router: './account/balance',
      isActive: false
    }
  ];


  //是否显示我的账户的东西
  isShowMenu: boolean = false;

  //区分为是导航选项 && 还是账户选项

  isAccountNavigation: boolean = false;

  isSuperuser: boolean = false;

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private adminService: AdminService,
      private useService: UserService
  ) {
    this.useService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    })
  }

  ngOnInit(): void {
  }

  changeShowMenu(isShow: boolean): void {
    if (isShow) {
      document.getElementById('account-menu').style.overflowY = 'visible';
    } else {
      document.getElementById('account-menu').style.overflowY = 'hidden';
    }
  }

  changeSlide(obj: any, index: number) {
    this.isAccountNavigation = false;
    for (let value of this.contents) {
      if (value.id != obj.id) {
        value.isActive = false;
      }
    }
    if (obj.slide) {
      obj.isActive = !obj.isActive;
    } else {
      obj.isActive = true;
    }
    if (obj.router) {
      this.router.navigate([`${obj.router}`], {relativeTo: this.activatedRoute});
    }
  }

  changeAccount(obj: any, index: number) {
    this.changeShowMenu(false);
    this.isAccountNavigation = true;
    for (let value of this.accounts) {
      if (value.id != obj.id) {
        value.isActive = false;
      }
    }
    if (obj.slide) {
      obj.isActive = !obj.isActive;
    } else {
      obj.isActive = true;
    }

    if (obj.router) {
      this.router.navigate([`${obj.router}`], {relativeTo: this.activatedRoute});
    }
  }
}
