const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');

let chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
let columns = [];

function resizeMatrix() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    let fontSize = 20;
    let colCount = Math.floor(matrixCanvas.width / fontSize);
    columns = [];
    for(let i = 0; i < colCount; i++) {
        columns.push(Math.random() * matrixCanvas.height / fontSize);
    }
}

function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    matrixCtx.fillStyle = '#0f0';
    matrixCtx.font = '20px monospace';

    let fontSize = 20;
    for(let i = 0; i < columns.length; i++) {
        let char = chars[Math.floor(Math.random() * chars.length)];
        let x = i * fontSize;
        let y = columns[i] * fontSize;
        matrixCtx.fillText(char, x, y);

        if(y > matrixCanvas.height && Math.random() > 0.975) {
            columns[i] = 0;
        } else {
            columns[i]++;
        }
    }
    requestAnimationFrame(drawMatrix);
}

window.addEventListener('resize', () => {
    resizeMatrix();
    resizeDraw();
});
resizeMatrix();
drawMatrix();

let bgImage = null;
let bgColor = null;

function applyBackground(value) {
    if(!value) {
        bgImage = null;
        bgColor = null;
        document.getElementById('bg-status').innerHTML = `✨ Fundo: transparente (Matrix)`;
        if(engine) engine.render();
        return true;
    }

    const valStr = String(value).toLowerCase().trim();

    const colorNames = {
        'red': '#ff0000', 'green': '#00ff00', 'blue': '#0000ff',
        'yellow': '#ffff00', 'cyan': '#00ffff', 'magenta': '#ff00ff',
        'white': '#ffffff', 'black': '#000000', 'gray': '#808080',
        'orange': '#ffa500', 'purple': '#800080', 'pink': '#ffc0cb',
        'brown': '#a52a2a', 'lime': '#00ff00', 'aqua': '#00ffff',
        'teal': '#008080', 'navy': '#000080', 'olive': '#808000'
    };

    if(colorNames[valStr]) {
        bgColor = colorNames[valStr];
        bgImage = null;
        document.getElementById('bg-status').innerHTML = `🎨 Fundo: ${valStr}`;
        if(engine) engine.render();
        return true;
    }

    if(value.startsWith('#') || value.startsWith('rgb') || value.startsWith('rgba') || value.startsWith('hsl')) {
        bgColor = value;
        bgImage = null;
        document.getElementById('bg-status').innerHTML = `🎨 Fundo: ${value}`;
        if(engine) engine.render();
        return true;
    }
    else if(value.includes('raw.githubusercontent.com') || value.includes('github.io')) {
        bgColor = null;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            bgImage = img;
            document.getElementById('bg-status').innerHTML = `🖼️ Fundo: imagem carregada`;
            if(engine) engine.render();
        };
        img.onerror = () => {
            console.warn('❌ Erro ao carregar imagem:', value);
            bgImage = null;
            bgColor = null;
            document.getElementById('bg-status').innerHTML = `❌ Fundo: erro, voltou transparente`;
            if(engine) engine.render();
        };
        img.src = value;
        return true;
    }
    else {
        alert(`⚠️ "${value}" não é válido!\nUse: "red", "#ff0000", "rgb(255,0,0)" ou link do GitHub`);
        return false;
    }
}

function clearBg() {
    bgImage = null;
    bgColor = null;
    document.getElementById('bg-status').innerHTML = `✨ Fundo: transparente (Matrix)`;
    if(engine) engine.render();
    return true;
}

class Cube {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 60;
        this.image = null;
        this.hasTexture = false;
        this.showBorder = true;
    }

    setSize(newSize) {
        this.size = newSize;
        if(engine) engine.render();
        return this;
    }

    setBorder(visible) {
        this.showBorder = visible;
        if(engine) engine.render();
        return this;
    }

    link(url) {
        if(url.includes('raw.githubusercontent.com') || url.includes('github.io')) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                this.image = img;
                this.hasTexture = true;
                if(engine) engine.render();
            };
            img.onerror = () => {
                console.warn('❌ Erro ao carregar textura');
                this.hasTexture = false;
            };
            img.src = url;
        } else {
            alert('⚠️ Apenas links do GitHub são permitidos!');
        }
        return this;
    }

    draw(ctx) {
        if(this.hasTexture && this.image) {
            ctx.drawImage(this.image, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
            if(this.showBorder) {
                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 3;
                ctx.strokeRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
            }
        } else {
            ctx.fillStyle = '#0f0';
            ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
            if(this.showBorder) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
            }
        }
    }
}

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.image = null;
        this.hasTexture = false;
        this.showBorder = true;
    }

    setSize(newRadius) {
        this.radius = newRadius;
        if(engine) engine.render();
        return this;
    }

    setBorder(visible) {
        this.showBorder = visible;
        if(engine) engine.render();
        return this;
    }

    link(url) {
        if(url.includes('raw.githubusercontent.com') || url.includes('github.io')) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                this.image = img;
                this.hasTexture = true;
                if(engine) engine.render();
            };
            img.onerror = () => {
                console.warn('❌ Erro ao carregar textura');
                this.hasTexture = false;
            };
            img.src = url;
        } else {
            alert('⚠️ Apenas links do GitHub são permitidos!');
        }
        return this;
    }

    draw(ctx) {
        ctx.save();
        if(this.hasTexture && this.image) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            if(this.showBorder) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#0f0';
            ctx.fill();
            if(this.showBorder) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        ctx.restore();
    }
}

class Engine {
    constructor() {
        this.objects = [];
    }

    create(obj) {
        this.objects.push(obj);
        this.updateCount();
        this.render();
    }

    clear() {
        this.objects = [];
        this.updateCount();
        this.render();
    }

    updateCount() {
        const texturizadas = this.objects.filter(obj => obj.hasTexture).length;
        const infoSpan = document.getElementById('info');
        if(infoSpan) {
            infoSpan.innerHTML = `📦 Objetos: ${this.objects.length}  |  🖼️ Com textura: ${texturizadas}`;
        }
    }

    render() {
        const canvas = document.getElementById('draw-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        if(bgImage) {
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        } else if(bgColor) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)';
            ctx.lineWidth = 0.5;
            for(let i = 0; i < canvas.width; i += 50) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }
        }

        for(let obj of this.objects) {
            if(obj && obj.draw) {
                obj.draw(ctx);
            }
        }
    }
}

const engine = new Engine();

window.clearObjectos = function() {
    engine.clear();
    const infoSpan = document.getElementById('info');
    if(infoSpan) {
        infoSpan.innerHTML = `🗑 Limpo! Objetos: 0`;
    }
};

window.setBackground = function(value) {
    applyBackground(value);
};

window.clearBackground = function() {
    clearBg();
};

function resizeDraw() {
    const container = document.querySelector('.draw-container');
    const canvas = document.getElementById('draw-canvas');
    if(!container || !canvas) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    engine.render();
}

function executeCode() {
    const code = document.getElementById('code').value;
    if(!code) return;

    try {
        const func = new Function('Cube', 'Ball', 'engine', 'clearObjectos', 'setBackground', 'clearBackground', code);
        func(Cube, Ball, engine, window.clearObjectos, window.setBackground, window.clearBackground);

        const infoSpan = document.getElementById('info');
        if(infoSpan) {
            engine.updateCount();
            engine.render();
            infoSpan.innerHTML = `✅ Executado! ${infoSpan.innerHTML}`;
            setTimeout(() => {
                engine.updateCount();
            }, 2000);
        }
    } catch(e) {
        const infoSpan = document.getElementById('info');
        if(infoSpan) {
            infoSpan.innerHTML = `❌ Erro: ${e.message}`;
            infoSpan.style.color = '#f00';
        }
        console.error(e);
    }
}

const autoExecuteCheckbox = document.getElementById('auto-execute');
const textarea = document.getElementById('code');
let timeoutId = null;

textarea.addEventListener('input', () => {
    if(autoExecuteCheckbox.checked) {
        if(timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            executeCode();
        }, 500);
    }
});

const drawCanvas = document.getElementById('draw-canvas');
drawCanvas.addEventListener('mousemove', (e) => {
    const rect = drawCanvas.getBoundingClientRect();
    const scaleX = drawCanvas.width / rect.width;
    const scaleY = drawCanvas.height / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    document.getElementById('coords').innerHTML = `🎯 x: ${x}, y: ${y}`;
});

document.getElementById('run').onclick = executeCode;
document.getElementById('clear').onclick = () => window.clearObjectos();

window.addEventListener('resize', resizeDraw);

const container = document.querySelector('.draw-container');
const resizeObserver = new ResizeObserver(() => resizeDraw());
resizeObserver.observe(container);

resizeDraw();
setTimeout(() => executeCode(), 100);
