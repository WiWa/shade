if(Meteor.isClient){
  
  Template.findResourcesRefer.helpers({
    
    resource_results_with_problems:function(){
      //console.log(Session.get('resourceResultsWithProblemsList'))
      return Session.get('resourceResultsWithProblemsList');
    }

  })

}