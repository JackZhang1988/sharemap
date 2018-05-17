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
    if(!url){
      // 如果url为空，返回默认图片
      // todo: 根据imgType返回不同类型的默认图片
      return 'http://okyb0e40i.bkt.clouddn.com/Fg8nsEKje42ddsAbqWQ6WRkP-wft';
    }
    let imgType = args[0];
    switch (imgType) {
      case 'pin':
        return url + '?imageView2/1/w/20/h/20';
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
