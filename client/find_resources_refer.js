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

}