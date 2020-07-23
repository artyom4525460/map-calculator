var map, marker, circle;
var myLatLng = {lat: 43.651499, lng: -79.383466};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: mapObj.getZoom(),
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
  scaleParams : [
      {
        'min'   : 1,
        'max'   : 1,
        'zoom'  : 13
      },
      {
        'min'   : 2,
        'max'   : 3,
        'zoom'  : 12
      },
      {
        'min'   : 4,
        'max'   : 6,
        'zoom'  : 11
      },
      {
        'min'   : 7,
        'max'   : 14,
        'zoom'  : 10
      },
      {
        'min'   : 15,
        'max'   : 28,
        'zoom'  : 9
      },
      {
        'min'   : 29,
        'max'   : 55,
        'zoom'  : 8
      },
      {
        'min'   : 56,
        'max'   : 100,
        'zoom'  : 7
      }
    ],
  updateCircle: function(){
    circle.setRadius(1000 * slider.size.value);
  },
  updateScale: function(){
    map.panTo(myLatLng)
    let zoom = this.getZoom();
    map.setZoom(zoom);
  },
  getZoom: function(){
    return this.scaleParams.find(scaleParam => (scaleParam.min <= slider.size.value && scaleParam.max >= slider.size.value)).zoom;
  }
}

var element = {
  minus               : document.getElementById("minus"),
  plus                : document.getElementById("plus"),
  radiusValue         : document.getElementById("radius-value"),
  calculatedCost      : document.getElementById("calculated-cost"),
  mouthlyCost         : document.getElementById("mouthly-cost"),
  mouthlyLeads        : document.getElementById("mouthly-leads"),
  estimateTotalCost   : document.getElementById("estimate-total-cost"),
  minimumLoad         : document.getElementById("minimum-load"),
  totalCost           : document.getElementById("total-cost"),
  amountInput         : document.getElementsByName("amount"),
  businessLatLng      : document.getElementsByName("business_latlng"),
  userId              : document.getElementsByName("user_id"),
  category            : document.getElementsByName("category"),
  leadsFromMarkedArea : document.getElementsByName("leads_from_marked_area"),
  leadsFromPeopleInterestedInArea : document.getElementsByName("leads_from_people_interested_in_area"),
  estimateOption      : true,

  
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
    if(this.estimateOption){
      this.totalCost.innerHTML = this.estimateTotalCost.innerHTML;
      this.amountInput[0].value = this.clearNumber(this.estimateTotalCost.innerHTML);
    }
  },
  changeOption: function(option){
    if(option == 'estimate-total-cost'){
      this.minimumLoad.parentNode.parentNode.classList.remove('active');
      this.estimateTotalCost.parentNode.parentNode.classList.add('active');
      this.totalCost.innerHTML = this.estimateTotalCost.innerHTML;
      this.amountInput[0].value = this.clearNumber(this.estimateTotalCost.innerHTML);
      this.estimateOption = true;
    }
    else{
      this.estimateTotalCost.parentNode.parentNode.classList.remove('active');
      this.minimumLoad.parentNode.parentNode.classList.add('active');
      this.totalCost.innerHTML = this.minimumLoad.innerHTML;
      this.amountInput[0].value = this.clearNumber(this.minimumLoad.innerHTML);
      this.estimateOption = false;
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
    if(this.size.value == this.maxSize){
      element.disable(element.plus);
    }
  },

  reduceValue: function(){
    if(this.size.value >= this.minSize){
      this.size.value--;
      this.updateValue();
      element.enable(element.plus);
    }
    if(this.size.value == this.minSize){
      element.disable(element.minus);
    }
  },

  updateValue: function(){
    mapObj.updateCircle();
    element.updateElements();
    mapObj.updateScale();
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

document.getElementById('payButton').addEventListener('click', function(e){
  e.preventDefault();
  let data = {
    'business_latlng' : element.businessLatLng[0].value,
    'user_id' : element.userId[0].value,
    'category' : element.category[0].value,
    'amount' : element.amountInput[0].value,
    'leads_from_marked_area' : element.leadsFromMarkedArea[0].checked,
    'leads_from_people_interested_in_area' : element.leadsFromPeopleInterestedInArea[0].checked
  }

  alert(JSON.stringify(data));
  
  /*var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://your.url', false);
  xhr.send(JSON.stringify(data));
  if (xhr.status != 200) {
    alert( xhr.status + ': ' + xhr.statusText );
  } else {
    alert( xhr.responseText );
  }*/
});


element.initElements();