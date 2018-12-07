//color of ground mapped to humidity
//color of flocking mapped to temp
//windspeed is represented by max speed of flocking
//winddegree is represented by max force of flocking
let snow = [];
let rain = [];
let fog =[];
let mist = [];
let cloud = [];
let gravity;
var weather;
let temp;
let tempture;
let  wea = [];
let humidity;
let winddeg;
let windspeed;
var wind;
var position;
var h;
var g;
var B;
var c,cCopy;
var flock;
var yoff;
var pressure;
var raindeg;
var date = Date.now();
var sunrise;
var sunset;
var xpoint;
var ypoint;
var alpha;
var wealength;
var parsentage;
var buttons = [];
var info = "";
var dark,pressureColor=200;
var red =0;
var humidityColor;
var sunriseColor;
var sunsetColor;
var visibilityColor;
var sunriseMin;
var sunsetMin;
// button;

function preload() {
  // Get the most recent earthquake in the database
let apiKey = '859dd915fbeed6d12c75e1ad595bf2ae';
let city = 'tokyo';
let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  weather = loadJSON(url);
}

function setup() {
  createCanvas(windowWidth, windowHeight-10);
  angleMode(RADIANS);
  snow.push(new SnowFlake());
  rain.push(new RainParticle());
  fog.push(new Fog());
  mist.push(new Mist());
  cloud.push(new Cloud());
  gravity = createVector(0,0.03);
  position = createVector(0,0);
  wind = createVector();
  tempture=""+weather.main.temp;
  temp = parseInt(weather.main.temp);
  sunrise = toDate(weather.sys.sunrise);
  sunset = toDate(weather.sys.sunset);
  r = parseInt(map(temp, 0,100, 50 ,255,true));
  alpha = map(weather.visibility, 500,20000, 255,0);
  wealength = weather.weather.length;
  for (var i =0; i< wealength;i++){
    wea.push(weather.weather[i].main);
  }
  parsentage = weather.clouds.all;
  //b = map(temp, 0,255,-40,100);
  
  yoff=0.0;
  pressure = weather.main.pressure / 1000;
  humidity = weather.main.humidity; //val that change the intensity of clouds 
  winddeg = weather.wind.deg;
  //raindeg = weather.rain.3h;
  windspeed = weather.wind.speed;
  console.log(weather);
  console.log(wealength);
  let message = `It's ${weather.weather[0].main} and ${weather.main.temp} degrees in ${weather.name}!`;
  console.log("temo" + temp);

  //console.log("message" + message);
  //console.log("weather " + wea[0]);
  for (var i =0; i<wealength;i++){
    console.log("weather " + wea[i]);
  }
  console.log("windspeed" + windspeed);
  buttons.push(new InfoButton("windspeed", 50, 100,windspeed));
  //button = new InfoButton("windspeed", 100, 100,windspeed);
  console.log("r" + r);
  buttons.push(new InfoButton("temp", 50, 150,temp));
  console.log("pressure" + pressure);
  buttons.push(new InfoButton("pressure", 50, 200,pressure));
  console.log("humidity" + humidity);
  buttons.push(new InfoButton("humidity", 50, 250,humidity));
  console.log("raindeg" + raindeg);
  //buttons.push(new InfoButton("pressure", 500, height-100,pressure));
  console.log("sunrise"+ sunrise);
  buttons.push(new InfoButton("sunrise", 50, 300,sunrise));
  console.log("sunset"+ sunset);
  buttons.push(new InfoButton("sunset", 50, 350,sunset));
  console.log("alpha"+ alpha);
  buttons.push(new InfoButton("visibility", 50, 400,weather.visibility));
  
  // console.log();

  flock = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 200; i++) {
    // var b = new Boid(width/2,height/2,0,0,0);
    var b = new Boid(width,height/2);
    flock.addBoid(b);
  }
  var r = map(temp, 0,50,40,255);
  var b = map(temp, 0,50,255,40);
  c = color(r,0,b);
  cCopy = c;

  g = parseInt(map(humidity, 0,100, 50 ,255,true));
  B = parseInt(map(humidity, 0,100,0,255,true));

  humidityColor = color(0,g,B);
  console.log(g);
  console.log(B);
  background(255);

  sunriseColor = color(255,165,0);
  sunsetColor = color(255,255,102);
  visibilityColor = color(0,0,0,alpha);

  sunriseMin = parseInt((sunrise-parseInt(sunrise))*100);
  if(sunriseMin<10){
    sunriseMin = "0"+sunriseMin;
  }
  sunsetMin = parseInt((sunset-parseInt(sunset))*100);
  if(sunsetMin<10){
    sunsetMin = "0"+sunsetMin;
  }
}

function draw() {
  h = hour()+minute()*0.01;
  // console.log("h"+h);
  // console.log("sunrise"+sunrise);
  // console.log("darkest point"+(sunrise+(sunset-sunrise)/2));
  
  var sunrisePoint = map(sunrise,0,12,PI + HALF_PI,TWO_PI+HALF_PI); //180 degree
  var sunsetPoint = map(sunset,12,24, HALF_PI,PI + HALF_PI); //0 degree
  
  //console.log(c);
  
  if( h>sunrise && h<sunset){
    if(h<(sunrise+(sunset-sunrise)/2)){
      dark = map(h,sunrise,(sunrise+(sunset-sunrise)/2),100,0);
    }else{
      dark = map(h,(sunrise+(sunset-sunrise)/2),sunset,0,100);
    }
    //dark = map(h,(sunrise+(sunset-sunrise)/2),23,255,0);
    //background(0,map(h,0,(sunrise+sunset)/2,50,255),0);
    background(c);
  }else{//(h<sunsire ||h>sunset)
    if(h<(sunset+(sunset-sunrise)/2)){
      dark = map(h,sunset,(sunset+(sunset-sunrise)/2),100,200);
    }else{
      dark = map(h,(sunset+(sunset-sunrise)/2),sunrise+24,200,100);
    }

    //if(h>)

    dark = map(h,0,(sunrise+(sunset-sunrise)/2),0,255);
    //background(0,0,map(h,1,(sunrise+sunset)/2,23,50,255));
    background(c);
  }
  strokeWeight(1);
  flock.run();
  stroke(pressureColor);
  runShake();
  if( h<=sunrise || h>=sunset){
    fill(255,255,102);
    
    xpoint = width -300;
    ypoint = height -150;
  }else{
    fill(255,165,0);
    xpoint = 0 + 300;
    ypoint = 0 + 100;
  }
  strokeWeight(4);
  stroke(255);
  arc(xpoint,ypoint, 100, 100, 0, TWO_PI);
  stroke(255,255,153);
  arc(xpoint,ypoint, 90, 90, sunrisePoint,sunsetPoint);
  stroke(0);
  arc(xpoint,ypoint, 90, 90,sunsetPoint, sunrisePoint);
  //noStroke();
  
  strokeWeight(1);


  for (var i =0; i<wealength;i++){
    if(wea[i] == "Snow"){
      snow.push(new SnowFlake());
      for (flake of snow){
        flake.update();
        flake.render();
      }
    }
    else if(wea[i] == "Rain"){
      rain.push(new RainParticle());
      for (particle of rain){
        particle.update();
        particle.render();
      }
    }
    else if(wea[i] == "Fog"){
      fog.push(new Fog());
      for (particle of fog){
        particle.update();
        particle.render();
      }
    }
    else if(wea[i] == "Mist"){
      mist.push(new Mist());
      for (particle of mist){
        particle.update();
        particle.render();
      }
    }
    else if(wea[i] == "Clouds"){
      var num = random(100);
      if(num<parsentage){
        cloud.push(new Cloud());
      }
      for (var j =0; j<cloud.length;j++){
        cloud[j].update();
        if (cloud[j].pos.x < 0 || cloud[j].pos.x > width)  cloud.splice(j, 1);
        cloud[j].render();
      }
    }
    else if(wea[i] == "Haze"){
      fill(153,153,0,alpha);
    }
  }
  stroke(255);
  textSize(24);
  fill(visibilityColor);
  rect(0,0,width,height);
  //console.log("dark"+dark);
  fill(0,0,0);
  text(hour() +':' +minute(), 100, 30);

  for(var i = 0;i<wealength;i++){
    fill(0,0,0);
    text(wea[i], (i+1)*100, 60);
  }
  stroke(255,255,255);
  fill(sunriseColor);
  text(parseInt(sunrise)+':'+sunriseMin, xpoint-30,ypoint);
  stroke(0,0,0);
  fill(sunsetColor);
  text(parseInt(sunset)+':'+sunsetMin, xpoint-30,ypoint+30);

  for (var i = 0; i < buttons.length; i++) {
     buttons[i].render();
     //buttons[i].clicked();
   }
  //button.render();
  //console.log(button.this.info)
  //rect(100,100,100,50);
  
}

  
function runShake(){
  g = parseInt(map(humidity, 0,100, 50 ,255,true));
  B = parseInt(map(humidity, 0,100,0,255,true));

  fill(humidityColor);
  beginShape();
  stroke(pressureColor);
  var xoff = 0;  
  
  for (var x = 0; x <= width; x += 10) {
    
    var y = map(noise(xoff, yoff), 0, 1, height-300,height-200);

    vertex(x, y); 
    
    xoff += pressure;
  }
  // increment y dimension for noise
  yoff += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  textSize(32);
  fill(255);
  text(info, width/2, height/2);

}
function msToTime(duration) {
        var milliseconds = parseInt((duration%1000)/100)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
function toDate(x){
  var a = new Date(x* 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var sunrisetime = hour+min*0.01;
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return sunrisetime;
}

function mousePressed(){
  if(mouseX>50 && mouseX<200){
    if(mouseY>100&&mouseY<150){
      //buttons[1].clicked();
      info = windspeed;
      flock.colorChangeClicked();
    }else{
      flock.colorChange();
    }
    if(mouseY>150&&mouseY<200){
      //buttons[1].clicked();
      info = tempture;
      c = color(255,0,0);
    }else{
      //flock.colorChange();
      c = cCopy;
    }
    if(mouseY>250&&mouseY<300){
      //buttons[1].clicked();
      info = humidity;
      humidityColor = color(255,0,0);
      // g = 0;
      // B = 0;
    }else{
      //flock.colorChange();
      // g = parseInt(map(humidity, 0,100, 50 ,255,true));
      // B = parseInt(map(humidity, 0,100,0,255,true));
      humidityColor = color(0,g,B);
    }
    if(mouseY>200&&mouseY<250){
      //buttons[1].clicked();
      info = pressure;
      pressureColor = color(255,0,0);
      // g = 0;
      // B = 0;
    }else{
      //flock.colorChange();
      // g = parseInt(map(humidity, 0,100, 50 ,255,true));
      // B = parseInt(map(humidity, 0,100,0,255,true));
      pressureColor = 200;
    }
    if(mouseY>300&&mouseY<350){
      info = sunrise;
      sunriseColor = color(255,0,0);
    }else{
      sunriseColor = color(255,165,0);
    }
    if(mouseY>350&&mouseY<400){
      info = sunset;
      sunsetColor = color(255,0,0);
    }else{
      sunsetColor = color(255,255,102);
    }
    if(mouseY>400&&mouseY<450){
      info = weather.visibility;
      visibilityColor = color(255,0,0,alpha);
    }else{
      visibilityColor = color(0,0,0,alpha);
    }
  }else{
      flock.colorChange();
      c = cCopy;
      info = "";
      g = parseInt(map(humidity, 0,100, 50 ,255,true));
      B = parseInt(map(humidity, 0,100,0,255,true));
      humidityColor = color(0,g,B);
      sunriseColor = color(255,165,0);
      sunsetColor = color(255,255,102);
      visibilityColor = color(0,0,0,alpha);
  }
}

class InfoButton{

  constructor(n, x, y, i){
    this.name = n;
    this.posX = x;
    this.posY = y;
    this.info = i;
  }

  render(){
    fill(255);
    rect(this.posX, this.posY, 150,50);
    fill(0);
    text(this.name,this.posX+5, this.posY+25);
  }

  clicked(){
    fill(255);
    text("info", 500, 200);
    text(this.info, 500, 200);
    console.log("showing info");
  }

}







