if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('view', 'start')
  Session.setDefault('patientResultsList', [])


  Template.start.helpers({
    patient_results: function(){
      return Session.get('patientResultsList');
    }
  })

  Template.start.events({
    'click button': function () {
     // Session.set('view', 'queries');
      window.location.href = Router.path('queries')
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
      Meteor.call('createNewPatient',last_first, function(err, patient){
        if(err){
          alert("Creation Error:  " + err)
        }
        else{
          window.location.href = "./edit_patient/" + patient._id
          console.log('Create Patient:  ' + last_first)
        }
      })
    }
  });

  Template.editPatient.helpers({
    patient: function(){
      //console.log(this._id)
      var ret = Session.get('Patient')
      if(ret){
        var problems_arr = init_problems()
        ret.problems_arr = []
        for(var i = 0; i < problems_arr.length; i++){
          var problem = problems_arr[i]
          var hasProblem = (ret.problems.indexOf(problem) + 1) > 0// equivalent to includes()
          ret.problems_arr.push({
            problem: problem, 
            checked: hasProblem
                              })
        }
      }
        //console.log(ret.problems_arr)
      return ret
    }/*,
    problems_arr: function(){
        var problems_arr = init_problems()
        return problems_arr
    }*/
  })
/*
  Template.editPatient.rendered = function(){    
    if(Session.get('Patient')){
      var problems = Session.get('Patient').problems

      for(var i = 0; i < problems.length; i++){
        $($('#tableProblems input[name="'+problems[i]+'"]')[0]).prop('checked', true)
      }
    }
  }
  */

  Template.editPatient.events({
    'click #updatePatientBtn': function(){

      var _id = this._id

      var update = {
        first: $("#tFirst")[0].value,
        last: $("#tLast")[0].value,
        email: $("#tEmail")[0].value,
        phone: $("#tPhone")[0].value,
        address: $("#tAddress")[0].value
      }

      for (var k in update){
        if(update[k]){
          update[k] = update[k].value
        }
        else{
          update[k] = ""
        }
      }

      var problems = $("#tableProblems input")
      var updateProblems = []
      for(var i = 0; i < problems.length; i++){
        var problem = problems[i]
        if(problem.checked){
          updateProblems.push(problem.name)
        }
      }

      update.problems = updateProblems

      console.log(update)

      Meteor.call('updatePatient', _id, update, function(err, ret){
        if(err){
          alert("Error in Update: " + err)
        }
        else{
          window.location.href = Router.path("start")
        }
      })

    }
  })



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

function make_query_array_contains(filter_array){
  var ret = [];
  for(var i = 0; i < filter_array.length; i++){
    var q = new Parse.Query(ResourceData);
    ret.push(q.contains(filter_array[i][0], filter_array[i][1]))
  }
  return ret;
}

function resourceQuery(filterStr){
      //query = new Parse.Query(ResourceData);
      resourceResults = []

      filterStr = filterStr || "Alcohol"
      //query.equalTo(filterStr, true);
      var contains_array = [['serviceType', 'Alcohol'], ['serviceTypeOtherInfo', 'Youth']]
      //var contains_array = [['serviceType', 'Family'], ['serviceTypeOtherType', 'Youth']]

      console.log('creating query array')
      var query_array = make_query_array_contains(contains_array);

      var compound_query_or = Parse.Query.or.apply(null, query_array)
      //var safe_query = new Parse.Query(ResourceData).equalTo(filterStr, true);
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

function init_problems(){
  var problems_list = ["Alcohol", "Support Group", "Legal", "Senior",
                    "Dental", "Medical Care", "Mental Illness", "Family"]
  problems_list.sort()
  return problems_list
}