import { DataTransferObject } from "../data-transfer-objects/data-transfer-object";

export interface ViewModel {
    copy(): ViewModel;
    toDto(): DataTransferObject;
}
