import { DataTransferObject } from "../x-dto/data-transfer-object";

export interface ViewModel {
    copy(): ViewModel;
    toDto(): DataTransferObject;
}
