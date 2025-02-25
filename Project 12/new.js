document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hodSignature');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    document.getElementById('clearSign').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});