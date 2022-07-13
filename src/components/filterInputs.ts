import '../style.css';
import 'nouislider/dist/nouislider.css';
import * as noUiSlider from 'nouislider';
import * as wNumb from 'wnumb';
import Toys from './xmasDecorations';

class FilterInputs {
  quantityRange: HTMLInputElement;

  yearRange: HTMLInputElement;

  toys: Toys;

  constructor(toys: Toys) {
    // this.quantityRange = document.getElementById('quantity__input') as noUiSlider.target;
    // this.yearRange = document.getElementById('year__input') as noUiSlider.target;
    this.quantityRange = document.getElementById('quantity__input') as HTMLInputElement;
    this.yearRange = document.getElementById('year__input') as HTMLInputElement;
    this.rangeValue();
    this.toys = toys;
  }

  rangeValue(): void {
    // noUiSlider.create(this.quantityRange, {
    //   range: {
    //     'min': [1],
    //     'max': [12]
    //   },
    //   step: 1,
    //   start: [1, 12],
    //   connect: true,
    //   orientation: 'horizontal',
    //   format: wNumb.default({
    //     decimals: 0,
    // })
    // });

    // const snapValues = [
    //   document.querySelector('.quantity__counter-min') as HTMLElement,
    //   document.querySelector('.quantity__counter-max') as HTMLElement
    // ] as HTMLElement[];

    // this.quantityRange.noUiSlider?.on('update', function (values, handle) {
    //   snapValues[handle].innerHTML = values[handle] as string;
    // });

    // this.quantityRange.noUiSlider?.on('change', () => {
    //   let valueArr = this.quantityRange.noUiSlider?.get(true) as Array<Number>;
    //   valueArr = valueArr?.map(function(el) {
    //     return Number(el.toFixed(2));
    //   });

    //   let value = JSON.stringify(valueArr);
    //   const type = 'count' as string;
    //   this.toys.updateLocalStorage(value, type, 'add');
    //   this.toys.filterToys();
    //   this.toys.showPopup();
    // });
    const currentQuantity = document.querySelector('.quantity__counter-current') as HTMLElement;
    const currentYear = document.querySelector('.year__counter-current') as HTMLElement;

    this.quantityRange.addEventListener('input', () => {
      currentQuantity.innerHTML = this.quantityRange.value;
    }, false);

    this.yearRange.addEventListener('input', () => {
      currentYear.innerHTML = this.yearRange.value;
    }, false);
  }
}

export default FilterInputs;
