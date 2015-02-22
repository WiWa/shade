init_problems = function (){
  var problems_list = ["Alcohol", "Support Group", "Legal", "Senior",
                    "Dental", "Medical Care", "Mental Illness", "Family"]
  problems_list.sort()
  return problems_list
}


make_query_array_contains = function (filter_array){
  var ret = [];
  for(var i = 0; i < filter_array.length; i++){
    var q = new Parse.Query(ResourceData);
    ret.push(q.contains(filter_array[i][0], filter_array[i][1]))
  }
  return ret;
}

resourceQuery_serviceType = function (problem){
      resourceResults = []
      filterStr = problem
      var query = new Parse.Query(ResourceData);
      query.contains('serviceType', problem)
      query.find({
              success: function(results) {
                //document.write("Successfully retrieved " + results.length + " resources.");
                var res = []
                //res[0] = filterStr + ": Successfully retrieved " + results.length + " resources.";
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                  res.push({name: object.get("clinicalResourceName")})
                  //str = str + "<br> " + object.id + ' --- ' + object.get("clinicalResourceName") + ' --- ' + object.get('busRoute');
                }
                Session.set('resourceResultsList', res)
                console.log(Session.get('resourceResultsList'))
              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
              }
      });
}

resourceQuery_or = function(filterStr){
      //query = new Parse.Query(ResourceData);
      resourceResults = []

      filterStr = filterStr || "Alcohol"
      //query.equalTo(filterStr, true);
      var contains_array = [['serviceType', 'Alcohol'], ['serviceTypeOtherInfo', 'Youth']]
      //var contains_array = [['serviceType', 'Family'], ['serviceTypeOtherType', 'Youth']]

      //console.log('creating query array')
      var query_array = make_query_array_contains(contains_array);

      var compound_query_or = Parse.Query.or.apply(null, query_array)
      //var safe_query = new Parse.Query(ResourceData).equalTo(filterStr, true);
      //var compound_query_or = safe_query
      //console.log(compound_query_or)
      compound_query_or.find({
              success: function(results) {
                //document.write("Successfully retrieved " + results.length + " resources.");
                var res = []
                res[0] = filterStr + ": Successfully retrieved " + results.length + " resources.";
                // Do something with the returned Parse.Object values
                //var str = "";
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                  res.push({name: object.get("clinicalResourceName") })
                //str = str + "<br> " + object.id + ' --- ' + object.get("clinicalResourceName") + ' --- ' + object.get('busRoute');
                //document.write(object.id + ' - ' + object.get("clinicalResourceName") + ' - ' + object.get('busRoute'));
                }
                Session.set("findResourcesResults", results)     
                //console.log(res)        
              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
              }
      });
}

parse_init = function(){
    Parse.initialize("RATgcQpj491NrNWY52F8qIxzXgrn8p93xm5vw6M6", "fCcbjceiK60kZv2RYGo9FIx5Ptuuvyb9nfq6po0f");
    
    ResourceData = Parse.Object.extend("ResourceInfo");
        
}

if (Meteor.isClient) {

  parse_init()

  Session.setDefault('view', 'start')
  Session.setDefault('patientResultsList', [])
  Session.setDefault('resourceResultsList', [])


  Template.findResourcesRefer.helpers({
    
    problems: function(){
      var patient = Session.get('Patient')
      if(patient){
        return patient.problems
      }
      return false
    },
    resource_results:function(){
      return Session.get('resourceResultsList');
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
      resourceQuery_or(filterStr)
    }
  })




}



