import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-crud',
    templateUrl: './crud.component.html',
    styleUrls: ['./crud.component.css']
})
export abstract class CrudComponent<VM, DTO> implements OnInit {

    public abstract models: Array<VM>;
    public abstract model: VM;
    public abstract tempModel: VM;

    public loading: boolean = false;
    public errorMsg: string = '';
    public clickedDelete: boolean = false;
    public intention: string = '';

    protected abstract endpoint: string;

    constructor(
        protected readonly rest: RestService,
        protected readonly router: Router) {
            if (sessionStorage.getItem('username') == null || sessionStorage.getItem('token') == null) {
                this.router.navigate(['auth']);
            }
    }

    public async ngOnInit(): Promise<void> {
        await this.fetch();
    }

    public async fetch(): Promise<void> {
        this.loading = true;

        await this.rest._get<Array<DTO>>(this.endpoint)
            .then(res => {
                this.errorMsg = '';
                this.processGetResult(res);
            })
            .catch(err => {
                this.errorMsg = 'Failed to fetch model.';
            });

        this.loading = false;
    }

    public abstract processGetResult(res: Array<DTO>): void;

    public abstract aboutToAdd(): void;

    public async add(model: DTO): Promise<void> {
        this.loading = true;

        await this.rest._post<DTO>(this.endpoint, model)
            .then(res => {
                this.errorMsg = '';
                this.processPostResult(res);
            })
            .catch(err => {
                this.errorMsg = 'Failed to add model.';
            });

        this.loading = false;
    }

    public async addAll(model: Array<DTO>): Promise<void> {
        this.loading = true;

        await this.rest._post<Array<DTO>>(this.endpoint, model)
            .then(res => {
                this.errorMsg = '';
                this.processPostResults(res);
            })
            .catch(err => {
                this.errorMsg = 'Failed to add model.';
            });

        this.loading = false;
    }

    public abstract processPostResult(res: DTO): void;

    public abstract processPostResults(res: Array<DTO>): void;

    public abstract aboutToEdit(viewModel: VM): void;
    
    public async update(id: string, model: DTO): Promise<void> {
        this.loading = true;

        await this.rest._put<DTO>(this.endpoint + '/' + id, model)
            .then(res => {
                this.errorMsg = '';
                this.processPutResult(res);
            })
            .catch(err => {
                this.errorMsg = 'Failed to update model.';
            });

        this.loading = false;
    }

    public abstract processPutResult(res: DTO): void;
    
    public async delete(id: string): Promise<void> {
        this.loading = true;
        this.clickedDelete = false;

        await this.rest._delete<DTO>(this.endpoint + '/' + id)
            .then(res => {
                this.errorMsg = '';
                this.processDeleteResult(res);
            })
            .catch(err => {
                this.errorMsg = 'Failed to delete model.';
            });

        this.loading = false;
    }

    public abstract processDeleteResult(res: DTO): void;

}
