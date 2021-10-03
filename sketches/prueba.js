const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

let text = 'fer';
let fontSize = 1200;
let fontFamily = 'serif';

const settings = {
	dimensions: [ 1080, 1080 ],
	animate: true
};

const animate = () => {
	console.log('domestika');
	requestAnimationFrame(animate);
};
// animate();

const sketch = ({ context, width, height }) => {
	const agents = [];

	for (let i = 0; i < 40; i++) {
		const x = random.range(0, width);
		const y = random.range(0, height);

		agents.push(new Agent(x, y));
	}

	
  const cell = 10;
	const cols = Math.floor(width  / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;
 
	typeCanvas.width  = cols;
	typeCanvas.height = rows;

  

	return ({ context, width, height }) => {
		typeContext.fillStyle = 'black';
		typeContext.fillRect(0, 0, cols, rows);

		fontSize = cols * 1.2;

		typeContext.fillStyle = 'red';
		typeContext.font = `${fontSize}px ${fontFamily}`;
		typeContext.textBaseline = 'top';

		const metrics = typeContext.measureText(text);
		const mx = metrics.actualBoundingBoxLeft * -1;
		const my = metrics.actualBoundingBoxAscent * -1;
		const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
		const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

		const tx = (cols - mw) * 0.5 - mx;
		const ty = (rows - mh) * 0.5 - my;

		typeContext.save();
		typeContext.translate(tx, ty);

		typeContext.beginPath();
		typeContext.rect(mx, my, mw, mh);
		typeContext.stroke();

		typeContext.fillText(text, 0, 0);
		typeContext.restore();

		const typeData = typeContext.getImageData(0, 0, cols, rows).data;


		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.textBaseline = 'middle';
		context.textAlign = 'center';

		// context.drawImage(typeCanvas, 0, 0);

		for (let i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * cell;
			const y = row * cell;

			const r = typeData[i * 4 + 0];
			const g = typeData[i * 4 + 1];
			const b = typeData[i * 4 + 2];
			const a = typeData[i * 4 + 3];

			const glyph = getGlyph(r);

			context.font = `${cell * 0.3}px ${fontFamily}`;
			if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

			context.fillStyle = 'GREEN';

			context.save();
			context.translate(x, y);
			context.translate(cell * 0.5, cell * 0.5);

			// context.fillRect(0, 0, cell, cell);

			context.fillText(glyph, 0, 0);
			
			context.restore();

		}
	};
};


canvasSketch(sketch, settings);

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	getDistance(v) {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
}

class Agent {
	constructor(x, y) {
		
    
    this.pos = new Vector(x, y);
		this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
		this.radius = random.range(4, 12);
	}

	bounce(width, height) {
		if (this.pos.x <= 0 || this.pos.x >= width)  this.vel.x *= -1;
		if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
	}

	update() {
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
	}

	draw(typeContext) {
		typeContext.save();
		typeContext.translate(this.pos.x, this.pos.y);

		typeContext.lineWidth = 0.4;

		typeContext.beginPath();
		typeContext.fillText("g", 0, 0);
		typeContext.fill();
		typeContext.stroke();

		typeContext.restore();
	}
}

const getGlyph = (v) => {
	if (v < 50) return '';
	if (v < 100) return 'i';
	if (v < 150) return 'a';
	if (v < 200) return 'o';

	const glyphs = 'iaoeu'.split('');

	return random.pick(glyphs);
};
