import { Component, OnInit, Injector  } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SearchServiceProxy, SearchResultDto, ListResultDtoOfSearchResultDto, GetSearchInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';


@Component({
    templateUrl: './lists.component.html',
    animations: [appModuleAnimation()]
})

export class ListsComponent extends AppComponentBase implements OnInit {

    searchResult: SearchResultDto[] = [];
    name: string = '';
    document: string = '';
        
    constructor(
        injector: Injector,
        private _personService: SearchServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getSearch();
    }

    getSearch(): void {
        this._personService.search(new GetSearchInput({ name: this.name, document:this.document})).subscribe((result) => {
            this.searchResult = result.items;
        });
    }

    exportToExcel(): void {
        this._personService.search(new GetSearchInput({ name: this.name, document: this.document })).subscribe((result) => {
            this.searchResult = result.items;
        });
    }

    getSubscriptions(event?: any): void {
        this.primengTableHelper.showLoadingIndicator();

        this._personService.search(new GetSearchInput({ name: this.name, document: this.document }))
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.items.length;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }
}
