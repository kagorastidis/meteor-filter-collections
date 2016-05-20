Template.body.onCreated(function(){
	Meteor.subscribe('entries');
});

Template.body.onRendered(function () {
  setTimeout(function(){
    $('#filterSelect').multiselect();
    $('#dateSelect').multiselect();
  }, 500);
})

Template.body.helpers({
	getEntries: function () {
		return entries.find();
	},
  getDistinctEntries:function(){
    var data = entries.find().fetch();
    var distinctData = _.uniq(data, false, function(d) {return d.fullName});
    return _.pluck(distinctData, "fullName");
  }
});

  Template.body.events({
  	'click #reset': function () {
  		Meteor.call('resetDB');
  	},
  	'click #fill': function () {
  		Meteor.call('fillDB');
  	},
  	'click #reset': function () {
      _refreshFilters('#filterSelect, #dateSelect');
  		_resetFilters();
  	},
  'change #filterSelect':function (e) {
    Session.set('filterSelect',$('#filterSelect').val());
    EntriesFilter.filter.set('fullName', {value:Session.get('filterSelect'), operator: ['$in']});
  },
  'change #dateSelect':function (e) {
    Session.set('dateSelect', $('#dateSelect').val());
    var date = new Date($('#dateSelect').val());
    EntriesFilter.filter.set('start', {value:'2016-04-21T08:20:38.000Z', operator: ['$gte']});
   /* var query = {
    selector: {
      start: 'ISODate("2016-04-21T08:20:38.000Z")' ,
      operator: '$gte'
    }
  };
    EntriesFilter.query.set(query);*/
  },
  'click .clearFilter': function(e){
    _clearFilterSession(e,['filterSelect' ,'dateSelect']);
    _updatefilters(e, EntriesFilter, ['fullName','start'],['filterSelect','dateSelect']);
    _refreshFilterBox(e,'#filterSelect, #dateSelect');
    if(Session.get('filterSelect').length === 0 && Session.get('dateSelect').length === 0 ){
      _resetFilters();
    }
  },
  });

  EntriesFilter = new FilterCollections(entries, {
  template: 'body',
  pager: {
  	itemsPerPage: 1000
  },
  filters: {
  	fullName: {
	  	title: 'Entry name',
      condition: '$or'
	  },
	start: {
		title: 'Entry date',
    condition: '$gte',
    /*transform: function (value){
      var date = new moment(new Date(value));
      Session.set('dateSelect', date.valueOf());
      return date.valueOf();
    }*/
  	}
	}
});

var _refreshFilters = function(selector){
  $(selector).each(function( index ) {
    $(selector).multiselect('deselectAll',false);
    $(selector).multiselect('updateButtonText');
  });
}

var _refreshFilterBox = function(e,selector){
  $(selector).each(function( index ) {
    $(selector).multiselect('deselect', e.target.value);
  });
}

var _updatefilters = function(e, filterCategory, filterNames, sessionNames){
  for(var i= 0; i<arguments[2].length; i++){
    filterCategory.filter.set(filterNames[i], {value:Session.get(sessionNames[i]), operator: ['$in']});
  }
}

var _resetFilters = function () {
  var filters = EntriesFilter.filter.get();
  var filterNames = Object.getOwnPropertyNames(filters);
   for(var i =0; i<=filterNames.length; i++){
        EntriesFilter.filter.clear(filterNames[i]);
      }
}

var _getKeyByValue = function(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

var _clearFilterSession = function(e, sessionName){
  for(var i=0; i< arguments[1].length; i++){
    Session.set(sessionName[i],_.without(Session.get(sessionName[i]), e.target.value));
  } 
}
