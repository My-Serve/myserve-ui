import {Directive, HostBinding, HostListener, input, output} from '@angular/core';

@Directive({
  selector: '[appKeyPress]',
  standalone: true
})
export class KeyPressDirective {

  onPress = output<string>();
  cancel = input<boolean>(true);
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(this.cancel()){
      event.preventDefault();
      event.stopPropagation();
    }

    this.onPress.emit(event.key);
  }

}
