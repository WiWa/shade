if(Meteor.isClient){

    Template.start.helpers({
      patient_results: function(){
        return Session.get('patientResultsList');
      },
      resource_results:function(){
        return Session.get('resourceResultsList');
      }
    })
  
    Template.start.events({
    'click button': function () {
     // Session.set('view', 'queries');
      Router.go('queries')
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
          alert("No such patient!")
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
          Router.go('edit_patient', {_id: patient._id})
          console.log('Create Patient:  ' + last_first)
        }
      })
    },

    'click .findResourcesForPatient': function (){
      //console.log(this._id)
      var problems = $(".td_problems."+this._id)[0].innerHTML.toString().split(",")
      problems = problems.map(function(str){return str.trim()})
      console.log(problems)
      Session.set('resourceResultsWithProblemsList', [])
      for(var i = 0; i < problems.length; i++){
        resourceQuery_serviceType(problems[i])  // Using Apply somehow fails
      }
      Router.go('find_resources_refer', {_id: this._id})
    },

    'click #goToProblemsBtn': function(){
      Router.go('search_problems')
    },

    'click #feedbackBtn': function(){
      Router.go('feedback')
    }

  });
}