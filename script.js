var map, marker, circle;
var latLng = {lat: 43.651499, lng: -79.383466};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: latLng,
    zoom: mapObj.getZoom(),
    disableDefaultUI: true
  });
  marker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: './images/baloon.png'
  });
  circle = new google.maps.Circle({
    strokeWeight: 0,
    fillColor: "#23ACBD",
    fillOpacity: 0.35,
    map: map,
    center: latLng,
    radius: 1000 * slider.size.val()
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
    circle.setRadius(1000 * slider.size.val());
  },
  updateScale: function(){
    map.panTo(latLng)
    let zoom = this.getZoom();
    map.setZoom(zoom);
  },
  getZoom: function(){
    return this.scaleParams.find(scaleParam => (scaleParam.min <= slider.size.val() && scaleParam.max >= slider.size.val())).zoom;
  }
}

var element = {
  minus               : $('#minus'),
  plus                : $('#plus'),
  radiusValue         : $('#radius-value'),
  calculatedCost      : $('#calculated-cost'),
  mouthlyCost         : $('#mouthly-cost'),
  mouthlyLeads        : $('#mouthly-leads'),
  estimateTotalCost   : $('#estimate-total-cost'),
  minimumLoad         : $('#minimum-load'),
  totalCost           : $('#total-cost'),
  amountInput         : $('input[name="amount"]'),
  businessLatLng      : $('input[name="business_latlng"]'),
  userId              : $('input[name="user_id"]'),
  category            : $('input[name="category"]'),
  leadsFromMarkedArea : $('input[name="leads_from_marked_area"]'),
  leadsFromPeopleInterestedInArea : $('input[name="leads_from_people_interested_in_area"]'),
  estimateOption      : true,

  
  disable: function(element){
    element.addClass('block-element');
  },
  enable: function(element){
    element.removeClass('block-element');
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
    if(slider.size.val() == 1){
      element.disable(element.minus);
    }
    if(slider.size.val() == 100){
      element.disable(element.plus);
    }
  },
  updateElements: function(){
    this.radiusValue.text(slider.size.val());
    this.calculatedCost.text( this.formatNumber(this.clearNumber(this.radiusValue.text()) * 100) );
    this.mouthlyCost.text( this.formatNumber(this.clearNumber(this.calculatedCost.text()) * 30) );
    this.mouthlyLeads.text( this.formatNumber(this.clearNumber(this.radiusValue.text()) * 30) );

    this.estimateTotalCost.text(this.formatNumber(this.mouthlyCost.text()));
    if(this.estimateOption){
      this.totalCost.text(this.estimateTotalCost.text());
      this.amountInput.val(this.clearNumber(this.estimateTotalCost.text()));
    }
  },
  changeOption: function(option){
    if(option == 'estimate-total-cost'){
      this.minimumLoad.parent().parent().removeClass('active');
      this.estimateTotalCost.parent().parent().addClass('active');
      this.totalCost.text(this.estimateTotalCost.text());
      this.amountInput.val(this.clearNumber(this.estimateTotalCost.text()));
      this.estimateOption = true;
    }
    else{
      this.estimateTotalCost.parent().parent().removeClass('active');
      this.minimumLoad.parent().parent().addClass('active');
      this.totalCost.text(this.minimumLoad.text());
      this.amountInput.val(this.clearNumber(this.minimumLoad.text()));
      this.estimateOption = false;
    }
  }
}

var slider = {
  size: $("#radius-slider"),
  minSize: 1,
  maxSize: 100,

  increaseValue: function(){
    if (this.size.val() <= this.maxSize){
      let val = this.size.val()
      this.size.val(parseInt(val)+1);
      this.updateValue();
      element.enable(element.minus);
    }
    if(this.size.val() == this.maxSize){
      element.disable(element.plus);
    }
  },

  reduceValue: function(){
    if(this.size.val() >= this.minSize){
      let val = this.size.val()
      this.size.val(parseInt(val)-1);
      this.updateValue();
      element.enable(element.plus);
    }
    if(this.size.val() == this.minSize){
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
    switch(this.size.val()){
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

$('#payButton').on('click', function(e) {
  e.preventDefault();
  let data = {
    'business_latlng' : element.businessLatLng.val(),
    'user_id' : element.userId.val(),
    'category' : element.category.val(),
    'amount' : element.amountInput.val(),
    'leads_from_marked_area' : element.leadsFromMarkedArea.is(':checked'),
    'leads_from_people_interested_in_area' : element.leadsFromPeopleInterestedInArea.is(':checked')
  }

  alert(JSON.stringify(data));

  $.ajax({
    url: "https://test.url",
    method: "POST",
    data: data,
    dataType: 'json'
  }).done(function() {
    alert('request successfully sent');
  }).fail(function() {
    alert('request failed');
  });
  
});
