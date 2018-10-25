class Cloud {
	constructor(){
		let x = random (1);
		let y = random (50,70); 
		this.pos = createVector(x,y);
		this.vel = createVector(0,0);
		this.acc= createVector();
		this.width= random(50,100);
		this.height= random(30,50);

	}
	render(){
		fill(255);
		noStroke();
		ellipse(this.pos.x,this.pos.y,this.width,this.height);
	}
	update(){
		this.acc=createVector(windspeed/5,0);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		
	}

}