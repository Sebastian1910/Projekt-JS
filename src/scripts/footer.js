const openEls = document.querySelectorAll('[data-open]');
const closeEls = document.querySelectorAll('[data-modal-close-window]');
const isVisible = 'is-visible';

// Dodajemy event listener dla przycisków otwierających modal
for (const el of openEls) {
  el.addEventListener('click', function () {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  });
}

// Dodajemy event listener dla przycisków zamykających modal
for (const el of closeEls) {
  el.addEventListener('click', function () {
    this.closest('.modal').classList.remove(isVisible);
  });
}

// Zamykanie modal przez kliknięcie w tło
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal') && e.target.classList.contains(isVisible)) {
    e.target.classList.remove(isVisible);
  }
});

// Zamykanie modal przez naciśnięcie ESC
document.addEventListener('keyup', e => {
  if (e.key === 'Escape' && document.querySelector(`.${isVisible}`)) {
    document.querySelector(`.${isVisible}`).classList.remove(isVisible);
  }
});

// Event listener dla obrazków
const imageEls = document.querySelectorAll('.mdl__image');
const modalDialogs = document.querySelectorAll('.modal-dialog');

modalDialogs.forEach(modalDialog => {
  const imageModal = document.createElement('div');
  imageModal.className = 'image-modal';

  const imageOverlayImage = document.createElement('img');
  imageModal.appendChild(imageOverlayImage);

  const caption = document.createElement('div');
  caption.className = 'caption';
  imageModal.appendChild(caption);

  modalDialog.appendChild(imageModal);

  imageEls.forEach(el => {
    el.addEventListener('click', function () {
      if (modalDialog.contains(this)) {
        imageOverlayImage.src = this.src;
        caption.innerText = this.nextElementSibling.innerText;
        imageModal.style.display = 'flex';
      }
    });

    imageModal.addEventListener('click', function () {
      imageModal.style.display = 'none';
    });
  });
});
