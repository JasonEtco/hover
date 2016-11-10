import './styles.scss';

const circles = document.querySelectorAll('.circle');

circles.forEach((c, i) => {
  c.addEventListener('mouseenter', () => socket.emit('hoverOn', i));
  c.addEventListener('mouseleave', () => socket.emit('hoverOff', i));
});

socket.on('hoverOn', (i) => {
  circles[i].classList.add('hover');
  if (document.querySelectorAll('.hover').length === circles.length) {
    document.body.classList.add('all-active');
  }
});

socket.on('hoverOff', (i) => {
  circles[i].classList.remove('hover');
  document.body.classList.remove('all-active');
});
