document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('diceCanvas');
    const ctx = canvas.getContext('2d');
    function drawDice(number) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(20, 20, 160, 160);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, 160, 160);

        const dotCoordinates = {
            1: [[100, 100]],
            2: [[70, 70], [130, 130]],
            3: [[70, 70], [100, 100], [130, 130]],
            4: [[70, 70], [70, 130], [130, 70], [130, 130]],
            5: [[70, 70], [70, 130], [100, 100], [130, 70], [130, 130]],
            6: [[70, 70], [70, 100], [70, 130], [130, 70], [130, 100], [130, 130]]
        };

        ctx.fillStyle = '#000000';
        dotCoordinates[number].forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function getRandomNumber() {
        return Math.floor(Math.random() * 6) + 1;
    }

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            const randomNumber = getRandomNumber();
            drawDice(randomNumber);
        }
    });

    drawDice(getRandomNumber());
});
