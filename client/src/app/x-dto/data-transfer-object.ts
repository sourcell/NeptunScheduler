import { ViewModel } from "../x-vm/view-model";

export interface DataTransferObject {
    toVm(): ViewModel;
}
