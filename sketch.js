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
let  wea = [];
let humidity;
let winddeg;
let windspeed;
var wind;
var position;
var h;
var g;
var b;
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
  temp = parseInt(weather.main.temp);
  sunrise = toDate(weather.sys.sunrise);
  sunset = toDate(weather.sys.sunset);
  r = parseInt(map(temp, 0,100, 50 ,255,true));
  alpha = map(weather.visibility, 0,20000, 255,0);
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
  console.log("r" + r);
  console.log("pressure" + pressure);
  console.log("humidity" + humidity);
  console.log("raindeg" + raindeg);
  console.log("sunrise"+ sunrise);
  console.log("sunset"+ sunset);
  console.log("alpha"+ alpha);
  
  // console.log();

  flock = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 200; i++) {
    // var b = new Boid(width/2,height/2,0,0,0);
    var b = new Boid(width,height/2);
    flock.addBoid(b);
  }
  
  background(255);
}

function draw() {
  h = hour()+14+minute()*0.01;
  if(h>23){
    h=h-12;
  }
  
  
  var sunrisePoint = map(sunrise,0,12,PI + HALF_PI,TWO_PI+HALF_PI); //180 degree
  var sunsetPoint = map(sunset,12,24, HALF_PI,PI + HALF_PI); //0 degree
  
  
  if( h<(sunrise+sunset)/2){
    background(0,map(h,0,(sunrise+sunset)/2,50,255),0);
    
  }else{
    background(0,0,map(h,1,(sunrise+sunset)/2,23,50,255));
  }
  strokeWeight(1);
  flock.run();
  runShake();
  if( h<=sunrise || h>=sunset){
    fill(255,255,102);
    
    xpoint = width -300;
    ypoint = height -150;
  }else{
    fill(255,165,0);
    xpoint = 0 + 200;
    ypoint = 0 + 200;
  }
  strokeWeight(4);
  stroke(255);
  arc(xpoint,ypoint, 100, 100, 0, TWO_PI);
  stroke(0,255,0);
  arc(xpoint,ypoint, 90, 90, sunrisePoint,sunsetPoint);
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
  }
  stroke(255);
  textSize(24);
  fill(255,255,255,alpha);
  rect(0,0,width,height);

  fill(0,0,0);
  var mit = minute()%60;
  if(mit<10){
    mit = "0"+mit.toString();

  }
  text((hour()+14)%24 +':' + mit, 100, 30);

  for(var i = 0;i<wealength;i++){
    fill(0,0,0);
    text(wea[i], (i+1)*100, 60);
  }
  stroke(255,255,255);
  fill(255,165,0);
  var SRmit = parseInt((sunrise*100)%100);
  if(SRmit<10){
    SRmit = "0"+SRmit.toString();

  }
  text(parseInt(sunrise)+':'+SRmit, xpoint-30,ypoint);
  stroke(0,0,0);
  fill(255,255,102);
  var SSmit = parseInt((sunset*100)%100);
  if(SSmit<10){
    SSmit = "0"+SSmit.toString();

  }
  text(parseInt(sunset)+':'+SSmit, xpoint-30,ypoint+30);
}

  
function runShake(){
  g = parseInt(map(humidity, 0,100, 50 ,255,true));
  b = parseInt(map(humidity, 0,100,0,255,true));
  fill(0,g,b);
  beginShape();

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
