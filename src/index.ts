import './style.css';
import Toys from './components/xmasDecorations';
import FilterInputs from './components/filterInputs';
import App from './components/app';
import ChristmasTree from './components/xmasTree';
import Drag from './components/drag&drop';

const toys: Toys = new Toys();
const filter: FilterInputs = new FilterInputs(toys);
const app: App = new App();
const tree: ChristmasTree = new ChristmasTree();
const drag: Drag = new Drag();
