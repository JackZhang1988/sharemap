import { FormControl } from '@angular/forms';

export class MyValidator {

    static isPhone(control: FormControl): any {
        if (!/1[0-9]{10}$/.test(control.value)) {
            return {
                "notPhone": true
            };
        }
        return null;
    }

}