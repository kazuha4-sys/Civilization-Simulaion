function launchFireball(color) {
    const map = document.getElementById('map');
    const firaball = document.createElement('div');
    fireball.classList.add('fireball');

    let startX, startY;

    if (color === 'red') {
        startX = civilization1X;
        startY = civilization1Y;
    } else {
        startX = civilization2X;
        startY = civilization2Y;
    }

    fireball.style.left = startX + 'px';
    fireball.style.top = startY + 'px';
    map.appendChild(fireball);

    const targetX = Math.random() * 500;
    const targetY = Math.random() * 500;

    setTimeout(() => {
        fireball.style.left = targetX + 'px';
        fireball.style.top = targetY + 'px';

        setTimeout (() => {
            map.removeChild(fireball);
        }, 1000);
    }, 10);
}