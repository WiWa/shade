if(Meteor.isClient){
  
  Template.findResourcesRefer.helpers({
    
    resource_results_with_problems:function(){
      //console.log(Session.get('resourceResultsWithProblemsList'))
      return Session.get('resourceResultsWithProblemsList');
    },
    email: function(){
      Meteor.call('getPatientById', this._id, function(err, ret){
        if(err){
          alert("error.")
        }
        else{
          Session.set('patient_email', ret.email)
        }
      })
      return Session.get('patient_email')
    }

  })

  Template.findResources.helpers({
    resource_results_with_problems: function(){
      //console.log(Session.get('resourceResultsWithProblemsList'))
      return Session.get('resourceResultsWithProblemsList');
    }
  })

  Template.findResourcesRefer.events({
    'click #referEmailBtn': function(){
      var recipient = Session.get("patient_email")
      var resultsArr = Session.get("resourceResultsWithProblemsList")
      var text = ""
      for(var i = 0; i < resultsArr.length; i++){
        text = text + "Problem: " + resultsArr[i]['problem'] + "\n" 
                + "------------------------------------------" + "\n"
        for(var j = 0; j < resultsArr[i]['resources'].length; j++){
          text = text + resultsArr[i]['resources'][j]['name'] + "\n"
        }
        text += "\n \n"
      }
      Meteor.call('sendEmail',
            recipient,
            'shadetree@clinic.com',
            'Hello from Shade Tree Clinic!',
            text);
    },

    'click #referEmailAnywaysBtn': function(){
      var recipient = $("#quickEmail")[0].value
      var resultsArr = Session.get("resourceResultsWithProblemsList")
      var text = ""
      for(var i = 0; i < resultsArr.length; i++){
        text = text + "Problem: " + resultsArr[i]['problem'] + "\n" 
                + "------------------------------------------" + "\n"
        for(var j = 0; j < resultsArr[i]['resources'].length; j++){
          text = text + resultsArr[i]['resources'][j]['name'] + "\n"
        }
        text += "\n \n"
      }
      Meteor.call('sendEmail',
            recipient,
            'shadetree@clinic.com',
            'Hello from Shade Tree Clinic!',
            text);
    }
  })

}