class Mist {
	constructor(){
		let x = random (width);
		let y = random (height); 
		this.pos = createVector(x,y);
		this.lifeSpan = 255;
		this.size = random (10,0);
	}
	render(){
		fill(0,0,255,255-this.lifeSpan);
		noStroke();
		ellipse(this.pos.x, this.pos.y,this.size,this.size);
	}

	update(){
		if(this.size>0){
			this.size = this.size-0.1;
		}
		this.lifeSpan = this.lifeSpan-50;
	}

}