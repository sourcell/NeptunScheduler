import { ViewModel } from "../view-models/view-model";

export interface DataTransferObject {
    toVm(): ViewModel;
}
