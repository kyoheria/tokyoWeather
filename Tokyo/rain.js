class RainParticle {
	constructor(){
		let x = random (width);
		let y = random (-10,-1); 
		this.pos = createVector(x,y);
		this.vel = createVector(0,0);
		this.acc= createVector();
	
	}
	render(){
		stroke(0,0,255,100);
		strokeWeight(1);
		line(this.pos.x, this.pos.y,this.pos.x, this.pos.y-10);
	}
	update(){
		this.acc=gravity;
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	}

}