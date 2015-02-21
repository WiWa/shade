if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('view', 'start')
  Session.setDefault('patientResultsList', [])

  Template.router.helpers({
    view_queries: function(){
      return Session.get('view') == 'queries';
    }
  })

  Template.start.helpers({
    patient_results: function(){
      return Session.get('patientResultsList');
    }
  })

  Template.start.events({
    'click button': function () {
      Session.set('view', 'queries');
    },

    'keypress #patientName': function(event){
      if (event.charCode == 13){
        $('#searchPatientBtn').click()
      }
    },

    'click #searchPatientBtn': function () {
      var last_first = $('#patientName').val();
      console.log('searchPatientBtn:  ' + last_first)
      Meteor.call('getPatientsByName', last_first, function(err, ret){
        if(err){
          alert("Error: "+ err)
        }
        else if (ret.length == 0){
          console.log("No such patient!")
        }
        else{
          Session.set("patientResultsList", ret)
          console.log(Session.get("patientResultsList"))
        }
      })
    },

    'click #createPatientBtn': function () {
      var last_first = $('#patientName').val()
      console.log('Create Patient:  ' + last_first)
      Meteor.call('createNewPatient', last_first, function(err){
        if(err){
          alert("Error: " + err)
        }
        else{
          console.log("Creation Success!")
        }
      })
    }
  });

  Template.queries.events({

    'keypress #filterForTrue': function(event){
      if (event.charCode == 13){
        $('#findResourcesBtn').click()
      }
    },

    'click #findResourcesBtn': function (){
      var filterStr = $('#filterForTrue').val();
      resourceQuery(filterStr);
    }
  })

  Template.queries.rendered = function(){
    parse_init();
  }



}

function make_query_array(filter_array){
  var ret = [];
  var q = new Parse.Query(ResourceData);
  for(var i = 0; i < filter_array.length; i++){
    ret.push(q.contains(filter_array[i][0], filter_array[i][1]))
  }
  return ret;
}

function resourceQuery(filterStr){
      //query = new Parse.Query(ResourceData);
      resourceResults = []

      filterStr = filterStr || "Alcohol"
      //query.equalTo(filterStr, true);
      var contains_array = [['serviceType', 'Alcohol'], ['serviceType', 'Medical']]
      console.log('creating query array')
      var query_array = make_query_array(contains_array);

      //var safe_query = new Parse.Query(ResourceData).equalTo(filterStr, true);
      var compound_query_or = Parse.Query.or.apply(null, query_array)
      //var compound_query_or = safe_query
      console.log(compound_query_or)
      compound_query_or.find({
                 success: function(results) {
                 //document.write("Successfully retrieved " + results.length + " resources.");
                 document.getElementById("demo2").innerHTML = filterStr + ": Successfully retrieved " + results.length + " resources.";
                 // Do something with the returned Parse.Object values
                 var str = "";
                 for (var i = 0; i < results.length; i++) {
                 var object = results[i];
                 str = str + "<br> " + object.id + ' --- ' + object.get("clinicalResourceName") + ' --- ' + object.get('busRoute');
                 //document.write(object.id + ' - ' + object.get("clinicalResourceName") + ' - ' + object.get('busRoute'));
                 }
                 $('#demo3').html(str);
                 
                 },
                 error: function(error) {
                 alert("Error: " + error.code + " " + error.message);
                 }
                 });
}

function parse_init(){
    Parse.initialize("RATgcQpj491NrNWY52F8qIxzXgrn8p93xm5vw6M6", "fCcbjceiK60kZv2RYGo9FIx5Ptuuvyb9nfq6po0f");
    
    ResourceData = Parse.Object.extend("ResourceInfo");
    query = new Parse.Query(ResourceData);
/*
    query.get("Q3NFhXbdau", {//this is parse's own id tag
              success: function(resourceInfo) {
              // The object was retrieved successfully.
              document.getElementById("demo").innerHTML = resourceInfo.get("clinicalResourceName");
                    //outputs: National Multiple Sclerosis Society MidSouth Chpt
              },
              error: function(object, error) {
              // The object was not retrieved successfully.
              // error is a Parse.Error with an error code and message.
              }
              });
              */        
}