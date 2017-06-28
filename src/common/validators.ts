import { FormControl, FormGroup } from '@angular/forms';

export class MyValidator {

    static isPhone(control: FormControl): any {
        if (!/1[0-9]{10}$/.test(control.value)) {
            return {
                "notPhone": true
            };
        }
        return null;
    }

    static passwordMatchValidator(g: FormGroup) {
        return g.get('password').value === g.get('passwordConfirm').value
            ? null : { 'mismatch': true };
    }
}