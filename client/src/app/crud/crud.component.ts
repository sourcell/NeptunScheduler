import { Component, OnInit } from '@angular/core';
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

    protected readonly rest: RestService;

    constructor(rest: RestService) {
        this.rest = rest;
    }

    public async ngOnInit(): Promise<void> {
        await this.fetch();
    }

    public async fetch(): Promise<void> {
        this.loading = true;

        await this.rest.get<Array<DTO>>('', new Array<DTO>())
            .then(res => {
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

        await this.rest.post<DTO>('', model)
            .then(res => {
                this.processPostResult(res);
            })
            .catch(err => {
                this.errorMsg = 'Failed to add model.';
            });

        this.loading = false;
    }

    public abstract processPostResult(res: DTO): void;

    public abstract aboutToEdit(viewModel: VM): void;
    
    public async update(model: DTO): Promise<void> {
        this.loading = true;

        await this.rest.put<DTO>('', model)
            .then(res => {
                this.processPutResult(res);
            })
            .catch(err => {
                this.errorMsg = 'Failed to update model.';
            });

        this.loading = false;
    }

    public abstract processPutResult(res: DTO): Promise<void>;
    
    public async delete(model: DTO): Promise<void> {
        this.loading = true;
        this.clickedDelete = false;

        await this.rest.delete<DTO>('', model)
            .then(res => {
                this.processDeleteResult(res);
            })
            .catch(err => {
                this.errorMsg = 'Failed to delete model.';
            });

        this.loading = false;
    }

    public abstract processDeleteResult(res: DTO): Promise<void>;

}
