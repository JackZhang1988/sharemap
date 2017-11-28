import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ImagefilterPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'imagefilter',
})
export class ImagefilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(url: string, ...args) {
    let imgType = args[0];
    switch (imgType) {
      case 'avatar':
        return url + '?imageView2/0/w/100/h/100/q/75';
      case 'thumbnail':
        return url + '?imageView2/0/w/200/h/200/q/75';
      case 'mural':
        return url + '?imageView2/0/w/400/h/250/q/75';
      case 'origin':
        return url + '?imageView2/0/w/960/h/960/q/75';
      default:
        return url;
    }
  }
}
