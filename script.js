

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
  mouthlyCost     : document.getElementById("mouthly-cost"),
  mouthlyLeads    : document.getElementById("mouthly-leads"),
/*
  leadsFromMarkedArea : document.getElementById("leads_from_marked_area"),
  leadsFromPeopleInterestedInArea : document.getElementById("leads_from_people_interested_in_area"),
*/
  estimateTotalCost    : document.getElementById("estimate-total-cost"),
  minimumLoad  : document.getElementById("minimum-load"),
  totalCost  : document.getElementById("total-cost"),

  
  disable: function(element){
    element.classList.add('block-element');
  },
  enable: function(element){
    element.classList.remove('block-element');
  },
  clearNumber: function(number){
    return number.replace(/[\s.,%]/g, '');
  },
  formatNumber: function(number){
    number = number.toString();
    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(number))
      number = number.replace(pattern, "$1,$2");
    return number;
  },
  initElements: function(){
    this.updateElements();

    
    if(slider.size.value == 1){
      element.disable(element.minus);
    }
    if(slider.size.value == 100){
      element.disable(element.plus);
    }
  },
  updateElements: function(){
    this.radiusValue.innerHTML = slider.size.value;
    this.calculatedCost.innerHTML = this.formatNumber(this.clearNumber(this.radiusValue.innerHTML) * 100);
    this.mouthlyCost.innerHTML = this.formatNumber(this.clearNumber(this.calculatedCost.innerHTML) * 30);
    this.mouthlyLeads.innerHTML = this.formatNumber(this.clearNumber(this.radiusValue.innerHTML) * 30);

    this.estimateTotalCost.innerHTML = this.formatNumber(this.mouthlyCost.innerHTML);
    this.totalCost.innerHTML = this.estimateTotalCost.innerHTML;
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
    element.updateElements();
    /*element.radiusValue.innerHTML = this.size.value;
    element.calculatedCost.innerHTML = element.formatNumber(element.radiusValue.innerHTML * 100);
    element.mouthlyCost.innerHTML = element.formatNumber(element.calculatedCost.innerHTML * 30);
    element.mouthlyLeads.innerHTML = element.formatNumber(element.radiusValue.innerHTML * 30);

    element.estimateTotalCost.innerHTML = element.formatNumber(element.mouthlyCost.innerHTML);*/
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