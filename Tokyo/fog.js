class Fog {
	constructor(){
		let x = random (width);
		let y = random (height); 
		this.pos = createVector(x,y);
		this.vel = createVector(0,0);
		this.acc= createVector();
		this.r = random(50,100);
		this.lifeSpan = 50;
	}
	render(){
		fill(255,50);
		noStroke();
		ellipse(this.pos.x, this.pos.y,this.r,this.r);
	}
	update(){
		if(this.r>0){
			this.r = this.r-0.1;
		}
		this.lifeSpan = this.lifeSpan-1;
	}

}