export default class ModalPopup {
  constructor(options) {
    this.elemModal = null;
    this.eventShowModal = null;
    this.eventHideModal = null;
    this.hiding = false;
    this.destroyed = false;
    this.animationSpeed = 200;

    this.options = options || {};

    this.createModal();
    this.elemModal.addEventListener('click', this.handlerCloseModal.bind(this));

    this.eventShowModal = new CustomEvent('show.modalFunc', { detail: this.elemModal });
    this.eventHideModal = new CustomEvent('hide.modalFunc', { detail: this.elemModal });
  }

  createModal() {
    this.elemModal = document.createElement('div');
    const modalTemplate = '<div class="modal__backdrop" data-dismiss="modalFunc"><div class="modal__content"><div class="modal__header"><div class="modal__title" data-modalFunc="title">{{title}}</div><span class="modal__btn-close" data-dismiss="modalFunc" title="Закрыть">×</span></div><div class="modal__body" data-modalFunc="content">{{content}}</div>{{footer}}</div></div>';
    const modalFooterTemplate = '<div class="modal__footer">{{buttons}}</div>';
    const modalButtonTemplate = '<button type="button" class="{{button_class}}" data-handler={{button_handler}}>{{button_text}}</button>';
    let modalHTML;
    let modalFooterHTML = '';

    this.elemModal.classList.add('modalFunc');
    modalHTML = modalTemplate.replace(
      '{{title}}',
      this.options.title || 'Новое окно',
    );
    modalHTML = modalHTML.replace('{{content}}', this.options.content || '');
    if (this.options.footerButtons) {
      for (const button of this.options.footerButtons) {
        let modalFooterButton = modalButtonTemplate.replace(
          '{{button_class}}',
          button.class,
        );
        modalFooterButton = modalFooterButton.replace(
          '{{button_handler}}',
          button.handler,
        );
        modalFooterButton = modalFooterButton.replace(
          '{{button_text}}',
          button.text,
        );
        modalFooterHTML += modalFooterButton;
      }
      modalFooterHTML = modalFooterTemplate.replace(
        '{{buttons}}',
        modalFooterHTML,
      );
    }
    modalHTML = modalHTML.replace('{{footer}}', modalFooterHTML);
    this.elemModal.innerHTML = modalHTML;
    document.body.appendChild(this.elemModal);
  }

  show() {
    if (!this.destroyed && !this.hiding) {
      this.elemModal.classList.add('modal__show');
      document.dispatchEvent(this.eventShowModal);
    }
  }

  hide() {
    this.hiding = true;
    this.elemModal.classList.remove('modal__show');
    this.elemModal.classList.add('modal__hiding');
    setTimeout(() => {
      this.elemModal.classList.remove('modal__hiding');
      this.hiding = false;
    }, this.animationSpeed);
    document.dispatchEvent(this.eventHideModal);
  }

  handlerCloseModal(e) {
    if (e.target.dataset.dismiss === 'modalFunc' || e.target.dataset.handler) {
      this.hide();
    }
  }

  destroy() {
    if (this.elemModal.parentElement) {
      this.elemModal.parentElement.removeChild(this.elemModal);
    }
    this.elemModal.removeEventListener(
      'click',
      this.handlerCloseModal.bind(this),
    );
  }

  setContent(html) {
    this.elemModal.querySelector('[data-modalFunc="content"]').innerHTML = html;
  }

  setTitle(text) {
    this.elemModal.querySelector('[data-modalFunc="title"]').innerHTML = text;
  }
}
