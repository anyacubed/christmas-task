import '../style.css';

class Drag {
  toy: NodeListOf<HTMLElement>;

  draggable: NodeListOf<HTMLElement>;

  constructor() {
    this.toy = document.querySelectorAll('.favorite-toy') as NodeListOf<HTMLElement>;
    this.draggable = document.querySelectorAll('[draggable]') as NodeListOf<HTMLElement>;
    this.transferToys();
  }

  transferToys(): void {
    function handleDragStart(e: DragEvent | null) {
      const targetElement = e?.target as HTMLElement;
      e?.dataTransfer?.setData('text', targetElement.getAttribute('id') as string);
    }

    // function drop(e: DragEvent) {
    //   let targetElement = e?.target as HTMLElement;
    //   e.preventDefault();
    //   let data = e?.dataTransfer?.getData('text') as string;

    //   let nodeCopy = document?.getElementById(data)?.cloneNode(true) as Element;
    //   nodeCopy.id = "newId";
    //   targetElement.appendChild(nodeCopy);
    //   console.log(nodeCopy)
    // }
    function handleOverDrop(e: DragEvent) {
      e.preventDefault();
      if (e.type !== 'drop') {
        return;
      }

      const draggedId = e?.dataTransfer?.getData('text');

      const draggedEl = document.getElementById(draggedId as string);
      const targetElement = e?.target as HTMLElement;

      if (draggedEl?.parentNode === targetElement) {
        draggedEl?.parentNode?.removeChild(draggedEl);
        draggedEl?.setAttribute('style', `left: ${e.clientX - 270}px; top: ${e.clientY - 130}px`);
        targetElement.appendChild(draggedEl as HTMLElement);

        return;
      }

      draggedEl?.parentNode?.removeChild(draggedEl);
      draggedEl?.setAttribute('style', `left: ${e.clientX - 270}px; top: ${e.clientY - 130}px`);
      targetElement.appendChild(draggedEl as HTMLElement);
    }

    const target = document.querySelector('[data-drop-target]');
    const favToyCount = document.querySelectorAll('.favorite-toy__count') as NodeListOf<HTMLElement>;

    for (let i = 0; i < this.draggable.length; i++) {
      this.draggable[i].addEventListener('dragstart', handleDragStart as EventListener);
      this.draggable[i].addEventListener('dragend', (e) => {
        const event = e as DragEvent;
        const draggedEl = event?.target as HTMLElement;
        const parent = draggedEl.getAttribute('id');
        const wrapper = document.querySelector(`[data-wrapper-id='${parent}']`) as HTMLElement;
        const counter = wrapper.querySelector('.favorite-toy__count');
        let counterValue = Number(counter?.textContent) as number;

        if (event?.dataTransfer?.dropEffect === 'none') {
          draggedEl?.parentNode?.removeChild(draggedEl);
          counterValue++;
          counter!.innerHTML = counterValue.toString() as string;

          draggedEl?.setAttribute('style', '');
          wrapper.appendChild(draggedEl);
          return;
        }

        if (event?.dataTransfer?.dropEffect === 'copy') {
          counterValue--;
          counter!.innerHTML = counterValue.toString() as string;
        }
      });
      // draggable[i].addEventListener('dragend', (e) => {
      //   let event = e as DragEvent;
      //   let draggedEl = event?.target as HTMLElement;
      //   let parent = draggedEl.getAttribute('id');
      //   let wrapper = document.querySelector(`[data-wrapper-id='${parent}']`) as HTMLElement;
      //   let counter = wrapper.querySelector('.favorite-toy__count');
      //   let counterValue = Number(counter?.textContent) as number;
      //   console.log(event?.dataTransfer?.dropEffect == 'none')
      //   if (event?.dataTransfer?.dropEffect == 'none') {
      //     counterValue++;
      //     counter!.innerHTML = counterValue.toString() as string;

      //     return;
      //   }

      //   if (event?.dataTransfer?.dropEffect == 'copy') {
      //     counterValue--;
      //     counter!.innerHTML = counterValue.toString() as string;
      //   }
      // });
    }

    target?.addEventListener('dragover', handleOverDrop as EventListener);
    target?.addEventListener('drop', handleOverDrop as EventListener);
    // target?.addEventListener('drop', drop as EventListener);
  }
}

export default Drag;
