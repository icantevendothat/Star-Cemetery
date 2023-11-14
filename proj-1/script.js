class Star {
    constructor(x, y, brightness, size) {
      this.x = random(windowWidth);
      this.y = random(windowHeight);
      this.size = size || 1; 
      this.twinkleSpeed = random(1, 5); 
      this.brightness = brightness || 255; 
      this.defaultSize = size

      //console.log('Random X:', this.x);
      //console.log('Random Y:', this.y);
    }
  
    twinkle() {
     this.size = this.defaultSize + random(-0.5, 0.5);
    }
  
    display() {
        //console.log(`Star at (${this.x}, ${this.y}), size: ${this.size}, brightness: ${this.brightness}`);
        noStroke();
        fill(255, 255, 255, this.brightness);
        ellipse(this.x, this.y, this.size, this.size);
      }
  }
  
  let stars = []; 
  let starData; 
  const numberOfRecords = 999;
  
  function preload() {
    starData = loadJSON('https://data.cityofnewyork.us/resource/7479-ugqb.json', setupStars);
  }
  
  function setupStars(data) {
    starData = data; 
    //console.log('Number of records in starData:', starData.length); 

    for (let i = 0; i < starData.length; i++) {
      let data = starData[i];
      let admittedTimestamp = Date.parse(data.admitted_dt);
      let currentTimestamp = Date.now();
      let timeDifference = currentTimestamp - admittedTimestamp;
  
      let brightness = map(timeDifference, 100000000000, 0, 255, 10);
  
      let size = 1; 
      if (data.custody_level === 'MIN') {
        size = 4.5; // BIGGER star for minimum sentence 
      } else if (data.custody_level === 'MED') {
        size = 2.5; // medium
      } else if (data.custody_level === 'MAX') {
        size = 1.5; // SMALLER star for max sentnece 
      }
  
      stars.push(new Star(random(width), random(height), brightness, size));

      const star = new Star(random(width), random(height), brightness, size);
    star.data = starData[i]; 
    stars.push(star);
    }
  }
  
  function setup() {
    createCanvas(windowWidth, (1.7*windowHeight));
    
    canvas.addEventListener('mousemove', onMouseMove);


    let hoveredStar = null;
    
    function onMouseMove(event) {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
    
      for (const star of stars) {
        const distance = dist(mouseX, mouseY, star.x, star.y);

    ////////////below code until line 111 copied from chatgpt//////////
        if (distance < star.size / 2) {
          hoveredStar = star;
          break;
        }
      }

      // If a star is hovered, display its data in the tooltip
      if (hoveredStar) {
        const tooltip = document.getElementById('tooltip');
        tooltip.textContent = JSON.stringify(hoveredStar.data, null, 2); // Display JSON data
        tooltip.classList.remove('hidden');
            tooltip.innerHTML = `
            <h2>Inmate Star Data</h2>
            <p><strong>Inmate ID:</strong> ${hoveredStar.data.inmateid}</p>
            <p><strong>Admitted Date:</strong> ${hoveredStar.data.admitted_dt}</p>
            <p><strong>Custody Level:</strong> ${hoveredStar.data.custody_level}</p>
            <p><strong>Under Mental Observation?:</strong> ${hoveredStar.data.bradh}</p>
            <p><strong>Race:</strong> ${hoveredStar.data.race}</p>
            <p><strong>Gender:</strong> ${hoveredStar.data.gender}</p>
            <p><strong>Age:</strong> ${hoveredStar.data.age}</p>
    `;
    tooltip.style.left = mouseX + 'px';
    tooltip.style.top = mouseY + 'px';
    tooltip.classList.remove('hidden');
      } else {
        // If no star is hovered, hide the tooltip
        const tooltip = document.getElementById('tooltip');
        tooltip.classList.add('hidden');
      }
    }
}
  
  function draw() {
    background(0); 
    for (let star of stars) {
      star.twinkle();
      star.display();
    }
  }

  
