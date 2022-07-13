import '../style.css';

class App {
  mainPage: HTMLElement;

  xmasDecorPage: HTMLElement;

  xmasTreePage: HTMLElement;

  constructor() {
    this.mainPage = document.querySelector('.main-page') as HTMLElement;
    this.xmasDecorPage = document.querySelector('.xmas-decor') as HTMLElement;
    this.xmasTreePage = document.getElementById('xmas-tree') as HTMLElement;
    this.hideMainPage();
  }

  hideMainPage(): void {
    const mainPageBtn = document.querySelector('.main-page__btn') as HTMLElement;
    const homePageBtn = document.querySelector('.header__icon') as HTMLElement;
    const toysPageBtn = document.querySelector('.header__toys-btn') as HTMLElement;
    const treePageBtn = document.querySelector('.header__tree-btn') as HTMLElement;

    // if (this.mainPage.style.display === 'flex') {
    //   this.xmasDecorPage.style.display = 'none';
    //   this.xmasTreePage.style.display = 'none';
    // } else if (this.xmasDecorPage.style.display === 'flex') {
    //   this.mainPage.style.display = 'none';
    //   this.xmasTreePage.style.display = 'none';
    // } else {
    //   this.mainPage.style.display = 'none';
    //   this.xmasDecorPage.style.display = 'none';
    // }

    mainPageBtn.addEventListener('click', () => {
      this.mainPage.style.display = 'none';
      this.xmasDecorPage.style.display = 'flex';
      // toysPageBtn.classList.add('header__active-link');
    });

    homePageBtn.addEventListener('click', () => {
      this.xmasDecorPage.style.display = 'none';
      this.xmasTreePage.style.display = 'none';
      this.mainPage.style.display = 'flex';
    });

    toysPageBtn.addEventListener('click', () => {
      this.mainPage.style.display = 'none';
      this.xmasTreePage.style.display = 'none';
      this.xmasDecorPage.style.display = 'flex';
    });

    treePageBtn.addEventListener('click', () => {
      this.mainPage.style.display = 'none';
      this.xmasDecorPage.style.display = 'none';
      this.xmasTreePage.style.display = 'flex';
    });
  }
}

export default App;
