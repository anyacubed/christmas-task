import '../style.css';
import '../garland.css';
import data from '../data';

class ChristmasTree {
  localStorage: Storage;

  mainTreeContainer: HTMLElement;

  mainTree: HTMLImageElement;

  audio: HTMLAudioElement;

  test: string;

  garlandTreeContainer: HTMLElement;

  favToysContainer: HTMLElement;

  constructor() {
    this.localStorage = localStorage as Storage;
    this.mainTreeContainer = document.querySelector('.xmas-tree__center-section') as HTMLElement;
    this.mainTree = document.querySelector('.main-tree') as HTMLImageElement;
    this.audio = new Audio('audio/audio.mp3');
    this.playAudio();
    this.initSnowflakes();
    this.changeTree();
    this.changeBackground();
    this.test = '' as string;
    this.garlandTreeContainer = document.querySelector('.main-tree__garland-container') as HTMLElement;
    this.initChangeGarlandButtons();
    this.favToysContainer = document.querySelector('.favorites-container') as HTMLElement;
    this.generateFavToys();
    this.initClearTreePageLocalStorage();
  }

  playAudio(): void {
    const audioBtn = document.querySelector('.audio-control') as HTMLElement;

    audioBtn.addEventListener('click', () => {
      if (audioBtn.classList.contains('controls__item_active')) {
        audioBtn.classList.remove('controls__item_active');
        localStorage.setItem('music', 'false');
        this.audio.pause();
      } else {
        this.audio.play();
        audioBtn.classList.add('controls__item_active');
        localStorage.setItem('music', 'true');
      }
    });

    this.audio.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    }, false);

    window.addEventListener('click', () => {
      const isAudioSaved = localStorage.getItem('music') as string | null;
      if (isAudioSaved === 'true') {
        audioBtn.click();
      }
    }, { once: true });
  }

  createSnowflake(): void {
    const snowflakesContainer = document.querySelector('.snowflakes__container') as HTMLElement;
    const snowflake = document.createElement('i') as HTMLElement;
    this.test = '';
    snowflake.classList.add('snowflake');
    snowflake.style.left = `${Math.random() * window.innerWidth}px`;
    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
    snowflake.style.opacity = Math.random().toString();
    snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;

    snowflakesContainer.appendChild(snowflake);

    setTimeout(() => {
      snowflake.remove();
    }, 5000);
  }

  initSnowflakes(): void {
    let timeout: ReturnType<typeof setInterval>;
    const snowBtn = document.querySelector('.snow-control') as HTMLElement;
    snowBtn.addEventListener('click', () => {
      if (snowBtn.classList.contains('controls__item_active')) {
        snowBtn.classList.remove('controls__item_active');
        localStorage.setItem('snow', 'false');
        clearInterval(timeout);
      } else {
        snowBtn.classList.add('controls__item_active');
        timeout = setInterval(this.createSnowflake, 50);
        localStorage.setItem('snow', 'true');
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      if (localStorage.getItem('snow') === 'true') {
        snowBtn.click();
      }
    });
  }

  changeTree(): void {
    const treeItem = document.querySelectorAll('.tree__item') as NodeListOf<HTMLElement>;
    const savedTree = localStorage.getItem('christmas-tree');

    if (localStorage.getItem('christmas-tree') !== null) {
      this.mainTree.src = `tree/${savedTree}.png`;
    }

    treeItem.forEach((tree) => {
      const value = tree.getAttribute('data-tree') as string;
      tree.style.backgroundImage = `url('tree/${value}.png')`;
      tree.addEventListener('click', () => {
        this.mainTree.src = `tree/${value}.png`;
        localStorage.setItem('christmas-tree', value);
      });
    });
  }

  changeBackground(): void {
    const bgItem = document.querySelectorAll('.bg__item') as NodeListOf<HTMLElement>;
    const savedBg = localStorage.getItem('background');

    if (localStorage.getItem('background') !== null) {
      this.mainTreeContainer.style.backgroundImage = `url('bg/${savedBg}.jpg')`;
    }

    bgItem.forEach((item) => {
      const value = item.getAttribute('data-bg') as string;
      item.style.backgroundImage = `url('bg/${value}.jpg')`;

      item.addEventListener('click', () => {
        this.mainTreeContainer.style.backgroundImage = `url('bg/${value}.jpg')`;
        localStorage.setItem('background', value);
      });
    });
  }

  initGarland(): void {
    const garlandLayers = 8 as number;
    let rotateVar1 = 65;
    let translateVar = 40;
    let rotateVar2 = -65;

    for (let i = 0; i < garlandLayers; i++) {
      const lightrope = document.createElement('ul') as HTMLUListElement;
      lightrope.className = 'lightrope';
      lightrope.setAttribute('style', `width: ${120 + (i * 75)}px; height: ${120 + (i * 75)}px`);
      this.garlandTreeContainer.appendChild(lightrope);

      for (let k = 0; k < i + 3; k++) {
        const lightropeItem = document.createElement('li') as HTMLElement;

        lightropeItem.className = 'lightrope__item';
        lightropeItem.setAttribute('style', `transform: rotate(${rotateVar1}deg) translate(${translateVar}px) rotate(${rotateVar2}deg)`);
        lightrope.appendChild(lightropeItem);
        rotateVar1 += 16 - i;
        rotateVar2 -= 16 - i;
      }
      rotateVar1 = 60 - i * 2;
      rotateVar2 = -60 + i * 2;
      translateVar += 35;
    }
  }

  initChangeGarlandButtons(): void {
    const garlandBtn = document.querySelectorAll('.garland-color__btn') as NodeListOf<HTMLElement>;
    const switchInput = document.querySelector('.switch-btn__input') as HTMLInputElement;
    const defaultColorInput = document.querySelector('.red-garland') as HTMLElement;
    const savedGarland = localStorage.getItem('garland-color');
    this.initGarland();

    garlandBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('garland-color__btn_active')) {
          btn.classList.remove('garland-color__btn_active');
          (<HTMLElement>document.querySelector('.main-tree__garland-container')).style.display = 'none';
          switchInput.checked = false;
          localStorage.setItem('garland-active', 'false');
        } else {
          const activeButton = document.querySelector('.garland-color__btn_active') as HTMLElement;
          if (activeButton) {
            activeButton.classList.remove('garland-color__btn_active');
          }
          btn.classList.add('garland-color__btn_active');
          (<HTMLElement>document.querySelector('.main-tree__garland-container')).style.display = 'flex';
          switchInput.checked = true;
          localStorage.setItem('garland-active', 'true');

          const garlandColor = btn.getAttribute('data-garland') as string;

          (<NodeListOf<HTMLElement>>document.querySelectorAll('.lightrope__item')).forEach((light) => {
            light.className = `lightrope__item ${garlandColor}`;
          });
          localStorage.setItem('garland-color', garlandColor);
        }
      });
    });

    if (savedGarland !== null && localStorage.getItem('garland-active') === 'true') {
      garlandBtn.forEach((btn) => {
        if (btn.classList.contains(`${savedGarland}-garland`)) {
          btn.click();
        }
      });
    }

    switchInput.addEventListener('click', () => {
      if (switchInput.checked) {
        if (savedGarland === null) {
          defaultColorInput.classList.add('garland-color__btn_active');
          (<HTMLElement>document.querySelector('.main-tree__garland-container')).style.display = 'flex';
        } else {
          const savedColorInput = document.querySelector(`.${savedGarland}-garland`) as HTMLElement;
          savedColorInput.click();
        }
        localStorage.setItem('garland-active', 'true');
      } else {
        (<HTMLElement>document.querySelector('.main-tree__garland-container')).style.display = 'none';
        defaultColorInput.classList.remove('garland-color__btn_active');
        const activeButtons = document.querySelectorAll('.garland-color__btn_active') as NodeListOf<HTMLElement>;
        activeButtons.forEach((btn) => {
          btn.classList.remove('garland-color__btn_active');
        });
        localStorage.setItem('garland-active', 'false');
      }
    });
  }

  generateFavToys(): void {
    const favToysTemplate = document.querySelector('.favorite-toy__template') as HTMLTemplateElement;

    if (localStorage.getItem('favorite-balls-quantity') === null) {
      for (let i = 0; i < 20; i++) {
        const favToyCard = <HTMLElement>favToysTemplate.content.cloneNode(true);
        const favToyWrapper = favToyCard.querySelector('.favorite-toy__wrapper') as HTMLElement;
        const favToyImg = favToyCard.querySelector('.favorite-toy') as HTMLImageElement;
        const favToyCount = favToyCard.querySelector('.favorite-toy__count') as HTMLElement;
        favToyWrapper.setAttribute('data-wrapper-id', (i + 1).toString());
        favToyImg.src = `toys/${i + 1}.png`;
        favToyCount.textContent = data[Number(i)].count;
        favToyImg.setAttribute('draggable', 'true');
        favToyImg.setAttribute('id', (i + 1).toString());
        this.favToysContainer.appendChild(favToyWrapper);
      }
    } else {
      const favoriteToysStorage = JSON.parse(localStorage.getItem('favorite-toys-ids') as string);

      for (let i = 0; i < favoriteToysStorage.length; i++) {
        const favToyCard = <HTMLElement>favToysTemplate.content.cloneNode(true);
        const favToyWrapper = favToyCard.querySelector('.favorite-toy__wrapper') as HTMLElement;
        const favToyImg = favToyCard.querySelector('.favorite-toy') as HTMLImageElement;
        const favToyCount = favToyCard.querySelector('.favorite-toy__count') as HTMLElement;
        favToyWrapper.setAttribute('data-wrapper-id', favoriteToysStorage[i]);
        favToyImg.src = `toys/${favoriteToysStorage[i]}.png`;
        favToyCount.textContent = data[favoriteToysStorage[i] - 1]?.count;
        favToyImg.setAttribute('draggable', 'true');
        favToyImg.setAttribute('id', favoriteToysStorage[i]);
        this.favToysContainer.appendChild(favToyWrapper);
      }
    }
  }

  clearTreePageLocalStorage(): void {
    this.localStorage.getItem('music');
    localStorage.removeItem('music');
    localStorage.removeItem('snow');
    localStorage.removeItem('christmas-tree');
    localStorage.removeItem('background');
    localStorage.removeItem('garland-color');
  }

  initClearTreePageLocalStorage(): void {
    const clearLocalStBtn = document.querySelector('.clear-local-storage__btn2') as HTMLElement;

    clearLocalStBtn.addEventListener('click', () => {
      this.clearTreePageLocalStorage();
    });
  }
}

export default ChristmasTree;
