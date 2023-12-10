import ModalPopup from '../ModalPopup';

describe('Modal class', () => {
  let modal;
  const options = {
    title: 'Test Modal',
    content: 'This is a test content',
    footerButtons: [
      {
        class: 'btn-test',
        handler: 'testHandler',
        text: 'Test Button',
      },
    ],
  };

  beforeEach(() => {
    modal = new ModalPopup(options);
  });

  afterEach(() => modal.destroy());

  it('should correctly initialize modal with provided options', () => {
    const titleElem = document.querySelector('[data-modalFunc="title"]');
    const contentElem = document.querySelector('[data-modalFunc="content"]');
    const buttonElem = document.querySelector('.btn-test');

    expect(titleElem.textContent).toBe(options.title);
    expect(contentElem.textContent).toBe(options.content);
    expect(buttonElem.textContent).toBe(options.footerButtons[0].text);
  });

  it('should show modal on show() method', () => {
    modal.show();
    expect(modal.elemModal.classList.contains('modal__show')).toBe(true);
  });

  it('should hide modal on hide() method', () => {
    modal.show();
    modal.hide();
    expect(modal.elemModal.classList.contains('modal__show')).toBe(false);
  });

  it('should update content on setContent() method', () => {
    const newContent = 'New test content';
    modal.setContent(newContent);
    const contentElem = document.querySelector('[data-modalFunc="content"]');
    expect(contentElem.textContent).toBe(newContent);
  });

  it('should update title on setTitle() method', () => {
    const newTitle = 'New test title';
    modal.setTitle(newTitle);
    const titleElem = document.querySelector('[data-modalFunc="title"]');
    expect(titleElem.textContent).toBe(newTitle);
  });

  it('should destroy modal on destroy() method', () => {
    modal.destroy();
    const modalElem = document.querySelector('.modalFunc');
    expect(modalElem).toBeNull();
  });

  it('should hide modal when close button or backdrop is clicked', () => {
    modal.show();
    const closeBtn = document.querySelector('.modal__btn-close');
    closeBtn.click();
    expect(modal.elemModal.classList.contains('modal__show')).toBe(false);
  });

  it('should hide modal when footer button is clicked', () => {
    modal.show();
    const footerBtn = document.querySelector('.btn-test');
    footerBtn.click();
    expect(modal.elemModal.classList.contains('modal__show')).toBe(false);
  });
});
