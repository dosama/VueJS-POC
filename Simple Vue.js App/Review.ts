/**
 * The main component that renders single TabComponent
 * instances.
 */

import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ViewChild,
  ComponentFactoryResolver,
  Output,
  EventEmitter,
  Inject,
  Type,
  Injector,

  ChangeDetectorRef
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { TabComponent } from './tab.component';
import { DynamicTabsDirective } from './dynamic-tabs.directive';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import * as _ from 'lodash';
import { UITMonitoringComponent } from 'src/app/uitmonitoring/uitmonitoring.component';
import { Guid } from "guid-typescript";
import { BaseComponent } from 'src/app/shared/base.component';
import { LocalStorageService } from 'src/app/services/shared/localStorage.service';
import { LocalStorageKeys } from '../../../Constants/LocalStorageKeys';

export type Content<T> = Type<T>;
declare function GetActiveTabId(): any;
@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})

export class TabsComponent implements AfterContentInit {
  DisplayTabs: boolean = false;
  dynamicTabs: TabComponent[] = [];
  baseComponent: BaseComponent = new BaseComponent();
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @ViewChild(DynamicTabsDirective) dynamicTabPlaceholder: DynamicTabsDirective;

  /*
    Alternative approach of using an anchor directive
    would be to simply get hold of a template variable
    as follows
  */
  // @ViewChild('container', {read: ViewContainerRef}) dynamicTabPlaceholder;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
    @Inject(DOCUMENT) private document: Document, private injector: Injector, private router: Router, private cdRef: ChangeDetectorRef, public localStorageService: LocalStorageService,) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  // contentChildren are set
  ngAfterContentInit() {
    var homePageTab = this.GetTabs().filter(function (item) { return item.url == '/'; });
    if (homePageTab == null || homePageTab.length == 0) {
      const idTab = Guid.create();
      this.openTab('Home Page', UITMonitoringComponent, idTab, false, '/', false);
    }
    this.GetTabs().forEach(element => {
      this.openTab(element.title, UITMonitoringComponent, element.dataContext, element.isCloseable, element.url, false);      
    })
    
    this.openNewTabFromExternalUrl();

  }

  openNewTabFromExternalUrl() {
    var referrerUrl = this.localStorageService.getItem<string>(LocalStorageKeys.ReferrerUrl);
    if ((referrerUrl != null && referrerUrl.indexOf("signin-callback.html") < 0)  )
      return; 
    let idTab = Guid.create();
    const root = this.router.routerState.snapshot.root;
    var title = this.lastChild(root).data["title"];
    this.openTab(title, UITMonitoringComponent, idTab, true, this.router.url, true)
  }
  private lastChild(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    if (route.firstChild) {
      return this.lastChild(route.firstChild);
    } else {
      return route;
    }
  }
  private checkAndSelectDuplicateTabs(url) {
    if (url.indexOf("bid-list-entry/edit") > 0 || url.indexOf("bidWanted/ticket-details") > 0 ||
      url.indexOf("single-cusip-order/detail") > 0 || url.indexOf("message-search/detail") > 0 ||
        url == '/') {   
      var exist = false;
      this.dynamicTabs.forEach(item => {
        if (url == item.url) {
          this.selectTab(item);
          exist = true;            
        }
      
      });
      return exist;
    }
  }
  private getKeyFromUrl(url) {
    var urlSplit = url.split("/");
    if (urlSplit.length > 0) {
      return urlSplit[urlSplit.length - 1];
    }
  }
  openTab(title: string, content, data, isCloseable, url: string, fromNavigate, extras?) {
   
    if (this.checkAndSelectDuplicateTabs(url) == true && (fromNavigate == true || url == '/'))
    {
      return;
    }
    this.DisplayTabs = true;

    // get a component factory for our TabComponent
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      TabComponent
    );

    // const ngContent = this.resolveNgContent(content);
    // fetch the view container reference from our anchor directive
    const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;

    // alternatively...
    // let viewContainerRef = this.dynamicTabPlaceholder;

    // create a component instance
    const componentRef = viewContainerRef.createComponent(componentFactory);

    // set the according properties on our component instance
    const instance: TabComponent = componentRef.instance as TabComponent;

    instance.title = title;
    // instance.content = content;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;
    instance.url = url;
    instance.active = true;
    instance.extras = extras;

    // remember the dynamic component for rendering the
    // tab navigation headers
    this.dynamicTabs.push(componentRef.instance as TabComponent);

    if (fromNavigate) {
      this.AddTab(componentRef.instance as TabComponent);
    }

    if (fromNavigate == true) {
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigateByData({
        url: [url],
        data: data.value,  //data - <any> type
        extras: extras //- <NavigationExtras> type, optional parameter
      });
      // set it active
       this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
    }

  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => (tab.active = false));
    this.dynamicTabs.forEach(tab => (tab.active = false));
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByData({
      url: [tab.url],
      data: tab.dataContext.value,  //data - <any> type
      extras: tab.extras //- <NavigationExtras> type, optional parameter
    });
    // activate the tab the user has clicked on.
    tab.active = true;
    this.baseComponent.SetValue("activeTabId", tab.dataContext.value);
  }

  closeTab(tab: TabComponent) {
    for (let i = 0; i < this.dynamicTabs.length; i++) {
      if (this.dynamicTabs[i] === tab) {

        // remove the tab from our array
        this.dynamicTabs.splice(i, 1);
        this.RemoveTab(tab);
        // close all tabs redirect to UIT monitoring
        if (this.dynamicTabs.length == 0) {
          this.router.navigate(['/']);
          return;
        }

        // set it active
        var ativeTabId = GetActiveTabId();
        var currentTab = _.last(this.dynamicTabs);
        this.dynamicTabs.forEach(element => {
          var tab = element as TabComponent;
          if (tab.dataContext.value == ativeTabId)
            currentTab = tab;
        });
        this.selectTab(currentTab);
        // destroy our dynamically created component again
        let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;

        // let viewContainerRef = this.dynamicTabPlaceholder;
        viewContainerRef.remove(i);

        break;
      }
    }
  }

  closeActiveTab() {
    const activeTabs = this.dynamicTabs.filter(tab => tab.active);
    if (activeTabs.length > 0) {
      // close the 1st active tab (should only be one at a time)
      this.closeTab(activeTabs[0]);
    }
  }

  onNavigate(tab: any) {
    this.resolveNgContent(tab);
  }
  resolveNgContent(tab: TabComponent) {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(TabComponent);
    const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    return [[componentRef.location.nativeElement], [this.document.createTextNode('Second ng-content')]];
  }
  public AddTab(tab: TabComponent) {
    var tabs = this.baseComponent.GetValue("openedTabs");
    if (!Array.isArray(tabs) || tabs == null)
      tabs = [];
    tabs.push(tab);
    this.baseComponent.SetValue("openedTabs", JSON.stringify(tabs));
  }
  public GetTabs() {
    var tabs = this.baseComponent.GetValue("openedTabs");
    if (Array.isArray(tabs)) {
      return tabs;
    }
    return [];
  }
  public RemoveTab(tab: TabComponent) {
    var tabs = this.GetTabs();
    var index = 0;

    tabs.forEach(element => {
      if (element.dataContext.value == tab.dataContext.value) {
        tabs.splice(index, 1);
        this.baseComponent.SetValue("openedTabs", JSON.stringify(tabs));
        localStorage.removeItem(tab.dataContext.value);
        return;
      }
      index++;
    })

  }
  public updateCurrentTabTitle(title: string) {
    var ativeTabId = GetActiveTabId();
    this.dynamicTabs.forEach(element => {
      var tab = element as TabComponent;
      if (tab.dataContext.value == ativeTabId)
        tab.title = title;
        return;
    });
  }
}