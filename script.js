

var map, marker, circle;
var myLatLng = {lat: 43.651499, lng: -79.383466};


function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 14,
    disableDefaultUI: true
  });
  marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: './images/baloon.png'
  });
  circle = new google.maps.Circle({
    strokeWeight: 0,
    fillColor: "#23ACBD",
    fillOpacity: 0.35,
    map: map,
    center: myLatLng,
    radius: 1000 * slider.size.value
  });
}

var mapObj = {
  updateCircle: function(){
    circle.setRadius(1000 * slider.size.value);
  },
  updateScale: function(){

  }
}

var element = {
  minus           : document.getElementById("minus"),
  plus            : document.getElementById("plus"),
  radiusValue     : document.getElementById("radius-value"),
  calculatedCost  : document.getElementById("calculated-cost"),
  
  disable: function(element){
    element.classList.add('block-element');
  },
  enable: function(element){
    element.classList.remove('block-element');
  },
  initElements: function(){
    this.radiusValue.innerHTML = slider.size.value;
    if(slider.size.value == 1){
      element.disable(element.minus);
    }
    if(slider.size.value == 100){
      element.disable(element.plus);
    }
  }
}

var slider = {
  size: document.getElementById("radius-slider"),
  minSize: 1,
  maxSize: 100,

  increaseValue: function(){
    if (this.size.value <= this.maxSize){
      this.size.value++;
      this.updateValue();
      element.enable(element.minus);
    }
    else{
      element.disable(element.plus);
    }
  },

  reduceValue: function(){
    console.log('reduce');
    if(this.size.value >= this.minSize){
      this.size.value--;
      this.updateValue();
      element.enable(element.plus);
    }
    else{
      element.disable(element.minus);
    }
  },

  updateValue: function(){
    mapObj.updateCircle();
    element.radiusValue.innerHTML = this.size.value;
  },

  moveButton: function(){
    this.updateValue();
    switch(this.size.value){
      case '100': 
        element.enable(element.minus);
        element.disable(element.plus);
        break;
      case '1': 
        element.disable(element.minus);
        element.enable(element.plus);
        break;
      default:
        element.enable(element.minus);
        element.enable(element.plus);
    }
  }
};


element.initElements();