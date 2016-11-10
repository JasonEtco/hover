import './styles.scss';

const circles = document.querySelectorAll('.circle');

circles.forEach((c, i) => {
  c.addEventListener('mouseenter', () => socket.emit('hoverOn', i));
  c.addEventListener('mouseleave', () => socket.emit('hoverOff', i));
});

socket.on('hoverOn', (i) => {
  circles[i].classList.add('hover');
});

socket.on('hoverOff', (i) => {
  circles[i].classList.remove('hover');
});
