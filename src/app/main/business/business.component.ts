import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppConsts } from "@shared/AppConsts";
import { AppComponentBase } from "@shared/common/app-component-base";
import { EntityDtoOfInt64, UserListDto, UserServiceProxy } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { LazyLoadEvent } from "primeng/api";
import { Paginator } from "primeng/paginator";
import { Table } from "primeng/table";
import { ManageValuesModalComponent } from "@app/admin/dynamic-properties/dynamic-entity-properties/value/manage-values-modal.component";
import { ImpersonationService } from "@app/admin/users/impersonation.service";

@Component({
    selector: "app-business",
    templateUrl: "./business.component.html",
    styleUrls: ["./business.component.css"],
})
export class BusinessComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    uploadUrl: string;

    //Filters
    advancedFiltersAreShown = false;
    filterText = "";
    role = "";
    onlyLockedUsers = false;

    constructor(
        injector: Injector,
        public _impersonationService: ImpersonationService,
        private _userServiceProxy: UserServiceProxy,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams["filterText"] || "";
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + "/Users/ImportFromExcel";
    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getBusiness(event?: LazyLoadEvent) {
        const aBusiness = { idBusiness: 1, businessName: "Empresa Prueba" };
        const aBusiness2 = { idBusiness: 2, businessName: "Empresa Dos" };

        let bussines = [];
        bussines.push(aBusiness);
        bussines.push(aBusiness2);

        this.primengTableHelper.totalRecordsCount = bussines.length;
        this.primengTableHelper.records = bussines;
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    deleteUser(user: UserListDto): void {
        if (user.userName === AppConsts.userManagement.defaultAdminUserName) {
            this.message.warn(this.l("{0}UserCannotBeDeleted", AppConsts.userManagement.defaultAdminUserName));
            return;
        }

        this.message.confirm(this.l("UserDeleteWarningMessage", user.userName), this.l("AreYouSure"), (isConfirmed) => {
            if (isConfirmed) {
                this._userServiceProxy.deleteUser(user.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.success(this.l("SuccessfullyDeleted"));
                });
            }
        });
    }

    showDynamicProperties(user: UserListDto): void {}

    unlockUser(record): void {
        this._userServiceProxy.unlockUser(new EntityDtoOfInt64({ id: record.id })).subscribe(() => {
            this.notify.success(this.l("UnlockedTheUser", record.userName));
        });
    }

    ngOnInit() {}
}
