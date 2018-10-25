class SnowFlake {
	constructor(){
		let x = random (width);
		let y = random (-100,-10); 
		this.pos = createVector(x,y);
		this.vel = createVector(0,0);
		this.acc= createVector();
		this.r = random(4,8);
	}
	render(){
		fill(255);
		noStroke();
		ellipse(this.pos.x, this.pos.y,this.r,this.r);
	}
	update(){
		if(this.pos.y<height){
			this.acc=gravity;
			this.vel.add(this.acc);
			this.pos.add(this.vel);
		}else{
			this.pos.y=height;
		}
	}

}