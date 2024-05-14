const modalFilmCard = document.querySelector('.index');
const modalFilmLib = document.querySelector('.library');

function openModal() {
  functionsProject.showEl(modalFilmCard);
  window.addEventListener('click', widowEvent);
  window.addEventListener('keydown', keyListener);
}
function openModalLib() {
  functionsProject.showEl(modalFilmLib);
  window.addEventListener('click', widowEventLib);
  window.addEventListener('keydown', keyListener);
}
function closeModal() {
  functionsProject.hideEl(modalFilmCard);
  window.removeEventListener('click', widowEvent);
  window.removeEventListener('keydown', keyListener);
}
function closeModalLib() {
  functionsProject.hideEl(modalFilmLib);
  window.removeEventListener('click', widowEventLib);
  window.removeEventListener('keydown', keyListener);
}
