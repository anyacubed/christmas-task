import '../style.css';
import data from '../data';

interface DataItem {
  [key: string]: string | boolean
  num: string;
  name: string;
  count: string;
  year: string;
  shape: string;
  color: string;
  size: string;
  favorite: boolean;
}

interface Filter {
  [key: string]: Array<string> | string;
  shape: Array<string>;
  color: Array<string>;
  size: Array<string>;
  favorite: string;
  quantity: string;
  year: string;
}

class Toys {
  xmasDecorCards: HTMLElement;

  popupButton: NodeListOf<Element>;

  localStorage: Storage;

  filterButtons: NodeListOf<Element>;

  favoriteBallsCount: HTMLElement;

  filteredData: Array<DataItem> = [];

  constructor() {
    this.localStorage = localStorage as Storage;
    this.filteredData = [] as Array<DataItem>;
    this.xmasDecorCards = document.querySelector('.xmas-decor__cards') as HTMLTemplateElement;
    this.popupButton = (<NodeListOf<Element>>document.querySelectorAll('.pop-up__top'));
    this.favoriteBallsCount = document.querySelector('.adds-ball__span') as HTMLElement;
    this.filterButtons = document.querySelectorAll('.sorting-point__btn') as NodeListOf<Element>;
    this.filterToys();
    this.renderCards();
    this.initFilters();
    this.initSorting();
    this.initSearch();
    this.initResetButton();
    this.initClearLocalStorage();
  }

  initResetButton(): void {
    const resetBtn = document.querySelector('.reset__btn') as HTMLElement;

    resetBtn.addEventListener('click', () => {
      this.resetFilters();
      this.filterToys();
    });
  }

  resetFilters(): void {
    localStorage.removeItem('filter');
    this.filterButtons.forEach((el) => {
      el.classList.remove('sorting-point__btn_active');
    });
    (<HTMLInputElement>document.querySelector('.checkbox__input')).checked = false;
    (<HTMLInputElement>document.getElementById('quantity__input')).value = '0';
    // (<HTMLElement>document.querySelector('.quantity__counter-min')).innerHTML = '1';
    (<HTMLElement>document.querySelector('.quantity__counter-current')).innerHTML = '1';
    (<HTMLInputElement>document.getElementById('year__input')).value = '0';
    (<HTMLElement>document.querySelector('.year__counter-current')).innerHTML = '1940';
  }

  initClearLocalStorage(): void {
    const clearLocalStorageBtn = document.querySelector('.clear-local-storage__btn') as HTMLElement;

    clearLocalStorageBtn.addEventListener('click', () => {
      this.clearLocalStorage();
    });
  }

  clearLocalStorage(): void {
    localStorage.removeItem('favorite-balls-quantity');
    localStorage.removeItem('favorite-toys-ids');
    localStorage.removeItem('filter');
    localStorage.removeItem('sort');

    this.favoriteBallsCount.innerHTML = '0';
    (<NodeListOf<Element>>document.querySelectorAll('.card')).forEach((el) => {
      el.classList.remove('card__active');
    });
    (<HTMLSelectElement>document.querySelector('.sorting-point__select')).selectedIndex = 0;

    this.resetFilters();
    this.filterToys();
  }

  renderCards(): void {
    this.xmasDecorCards.replaceChildren();
    const cardItemTemp: HTMLTemplateElement = document.querySelector('.card-template') as HTMLTemplateElement;

    this.filteredData.forEach((item) => {
      const card = <HTMLTemplateElement>cardItemTemp.content.cloneNode(true);

      (<HTMLElement>card.querySelector('.card')).setAttribute('data-id', `${item.num}`);
      (<HTMLImageElement>card.querySelector('.card__img')).src = `./toys/${item.num}.png`;
      (<HTMLElement>card.querySelector('.card__title')).textContent = item.name;
      (<HTMLElement>card.querySelector('.quantity')).textContent = `Quantity: ${item.count}`;
      (<HTMLElement>card.querySelector('.year')).textContent = `Year: ${item.year}`;
      (<HTMLElement>card.querySelector('.shape')).textContent = `Shape: ${item.shape}`;
      (<HTMLElement>card.querySelector('.color')).textContent = `Color: ${item.color}`;
      (<HTMLElement>card.querySelector('.size')).textContent = `Size: ${item.size}`;
      (<HTMLElement>card.querySelector('.favorite')).textContent = `Favorite: ${item.favorite === true ? 'yes' : 'no'}`;

      this.bindAddToFavorites(card);
      this.xmasDecorCards?.appendChild(card);
    });
  }

  updateLocalStorage(filterValue: string, type: string, action: string): void {
    if (type === '') {
      return;
    }

    if (type === 'favorite-balls-ids') {
      const favoriteBallsNumStorage = JSON.parse(localStorage.getItem('favorite-toys-ids') as string) || [] as unknown as Array<string>;

      if (action === 'add') {
        favoriteBallsNumStorage.push(filterValue);
      } else {
        const index = favoriteBallsNumStorage.indexOf(filterValue);
        if (index !== -1) {
          favoriteBallsNumStorage.splice(index, 1);
        }
      }

      this.localStorage.setItem('favorite-toys-ids', JSON.stringify(favoriteBallsNumStorage));
      return;
    }

    const filter: Filter = JSON.parse(this.localStorage.getItem('filter') as string) || {};

    if (action === 'add') {
      if (type !== 'favorite' && type !== 'quantity' && type !== 'year' && type !== 'search'
      && type !== 'count'
      && type !== 'year') {
        if (Array.isArray(filter[type])) {
          const arr = filter[type] as Array<string>;
          arr.push(filterValue);
          filter[type] = arr;
        } else {
          filter[type] = [filterValue];
        }
      } else {
        filter[type] = filterValue;
        if (filter[type] === '') {
          delete filter[type];
        }
      }
    } else if (type !== 'favorite' && type !== 'quantity' && type !== 'year') {
      if (Array.isArray(filter[type])) {
        const arr = filter[type] as Array<string>;
        const index = arr.indexOf(filterValue);
        if (index !== -1) {
          arr.splice(index, 1);
        }
        filter[type] = arr;

        if (filter[type].length === 0) {
          delete filter[type];
        }
      }
    } else {
      delete filter[type];
    }

    this.localStorage.setItem('filter', JSON.stringify(filter));
  }

  initFilters(): void {
    const quantityInput = document.getElementById('quantity__input') as HTMLInputElement;
    const yearRangeInput = document.getElementById('year__input') as HTMLInputElement;
    const checkbox = document.querySelector('.checkbox__input') as HTMLInputElement;

    this.filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.getAttribute('data-filter') as string;
        const type = button.getAttribute('data-type') as string;
        if (!button.classList.contains('sorting-point__btn_active')) {
          button.classList.add('sorting-point__btn_active');
          this.updateLocalStorage(value, type, 'add');
        } else {
          button.classList.remove('sorting-point__btn_active');
          this.updateLocalStorage(value, type, 'delete');
        }
        this.filterToys();
        this.showPopup();
      });
    });

    quantityInput.addEventListener('input', () => {
      const value = quantityInput.value as string;
      const type = 'count' as string;
      this.updateLocalStorage(value, type, 'add');
      this.filterToys();
      this.showPopup();
    });

    yearRangeInput.addEventListener('input', () => {
      const value = yearRangeInput.value as string;
      const type = 'year' as string;
      this.updateLocalStorage(value, type, 'add');
      this.filterToys();
      this.showPopup();
    });

    checkbox.addEventListener('change', () => {
      const value = String(checkbox.checked) as string;
      const type = 'favorite' as string;

      if (value === 'true') {
        this.updateLocalStorage(value, type, 'add');
      } else {
        this.updateLocalStorage(value, type, 'delete');
      }

      this.filterToys();
      this.showPopup();
    });
  }

  showPopup(): void {
    const cards = document.querySelectorAll('.card') as NodeListOf<Element>;
    if (cards.length === 0) {
      (<HTMLElement>document.querySelector('.pop-up__search')).style.display = 'flex';
      (<HTMLElement>document.querySelector('.pop-up__container')).style.display = 'block';
    }

    this.popupButton.forEach((btn) => {
      btn.addEventListener('click', () => {
        (<HTMLElement>document.querySelector('.pop-up__search')).style.display = 'none';
        (<HTMLElement>document.querySelector('.pop-up__container')).style.display = 'none';
      });
    });
  }

  filterToys(): void {
    const filter = JSON.parse(localStorage.getItem('filter') as string) || [] as unknown as Record<string, unknown>;
    const filterKeys = Object.keys(filter);

    this.filteredData = data.filter((item: DataItem) => filterKeys.every((key: string) => {
      const filterValue = filter[key] as string;
      const dataValue = String(item[key]) as string;

      if (Array.isArray(filterValue)) {
        return filterValue.includes(dataValue);
      }

      if (key === 'search') {
        return item.name.toLowerCase().includes(filterValue.toLowerCase());
      }
      // if (key === 'count') {
      //   // let filterArr = filterValue as unknown as Array<number>;
      //   let filterArr = filterValue.split(' ');
      //   console.log(filterArr)
      //   let min = filterArr[0];
      //   let max = filterArr[1];
      //   // let arr = Array.from({length: max - min + 1}, (_, i) => i + min);
      //   // console.log(filterArr)
      //   // return arr.includes(Number(dataValue))
      // }

      return filterValue === dataValue;
    }));

    const sort = localStorage.getItem('sort') as string;
    if (sort !== null) {
      this.sortToys(sort);
    }

    this.renderCards();
  }

  initSorting(): void {
    const sortingSelect = document.querySelector('.sorting-point__select') as HTMLSelectElement;
    sortingSelect.addEventListener('change', () => {
      this.sortToys(sortingSelect.value);
    });
  }

  sortToys(sortValue: string): void {
    if (sortValue === '1') {
      this.filteredData = this.filteredData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === '2') {
      this.filteredData = this.filteredData.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortValue === '3') {
      this.filteredData = this.filteredData.sort((a, b) => Number(a.year) - Number(b.year));
    } else if (sortValue === '4') {
      this.filteredData = this.filteredData.sort((a, b) => Number(b.year) - Number(a.year));
    }

    localStorage.setItem('sort', sortValue);
    this.renderCards();
  }

  initSearch(): void {
    const searchInput = document.querySelector('.header__adds-input') as HTMLInputElement;
    searchInput?.addEventListener('input', () => {
      const value = searchInput.value as string;
      const type = searchInput.getAttribute('type') as string;

      this.updateLocalStorage(value, type, 'add');
      this.filterToys();
      this.renderCards();
      this.showPopup();
    });
  }

  bindAddToFavorites(card: Element): void {
    const cardItem = card.firstElementChild as HTMLElement;
    cardItem?.addEventListener('click', () => {
      const favoriteBallsQuantityStorage: string | null = localStorage.getItem('favorite-balls-quantity') as string;
      const favoriteBallsNum = cardItem.getAttribute('data-id') as string;

      const value = favoriteBallsNum;
      const type = 'favorite-balls-ids';
      let favoriteBallsQuantity: number;

      if (favoriteBallsQuantityStorage !== null) {
        favoriteBallsQuantity = parseInt(favoriteBallsQuantityStorage, 10);
        this.favoriteBallsCount.innerHTML = favoriteBallsQuantity.toString();
      } else {
        favoriteBallsQuantity = 0;
        this.favoriteBallsCount.innerHTML = '0';
        localStorage.setItem('favorite-balls-quantity', this.favoriteBallsCount.innerHTML);
      }

      if (parseInt(this.favoriteBallsCount.innerHTML, 10) >= 0 && parseInt(this.favoriteBallsCount.innerHTML, 10) < 20) {
        if (cardItem?.classList.contains('card__active')) {
          this.favoriteBallsCount.innerHTML = `${--favoriteBallsQuantity}`;
          this.updateLocalStorage(value, type, 'delete');
        } else {
          this.favoriteBallsCount.innerHTML = `${++favoriteBallsQuantity}`;
          this.updateLocalStorage(value, type, 'add');
        }
        cardItem?.classList.toggle('card__active');
      } else if (cardItem?.classList.contains('card__active')) {
        this.favoriteBallsCount.innerHTML = `${--favoriteBallsQuantity}`;
        cardItem?.classList.toggle('card__active');
      } else {
        (<HTMLElement>document.querySelector('.pop-up__favorites')).style.display = 'flex';
        (<HTMLElement>document.querySelector('.pop-up__container')).style.display = 'block';
      }

      (<NodeListOf<Element>>document.querySelectorAll('.pop-up__top')).forEach((btn) => {
        btn.addEventListener('click', () => {
          (<HTMLElement>document.querySelector('.pop-up__favorites')).style.display = 'none';
          (<HTMLElement>document.querySelector('.pop-up__container')).style.display = 'none';
        });
      });

      localStorage.setItem('favorite-balls-quantity', this.favoriteBallsCount.innerHTML);
    });
  }
}

export default Toys;
