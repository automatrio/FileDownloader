import { FormGroup } from "@angular/forms";

export class ViewModel<T> {
    model?: T;
    filterResult: T[];
    form?: FormGroup;
}