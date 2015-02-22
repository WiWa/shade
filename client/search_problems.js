if(Meteor.isClient){
  Template.searchProblems.helpers({
    problems_arr: function(){
      return init_problems()
    }
  })

  Template.searchProblems.events({
    'click #problemSearchBtn': function(){
      var problems = []
      var all_problems = $("#div_problems input")
      for(var i = 0; i < all_problems.length; i++){
        if($(all_problems[i])[0].checked){
          problems.push(all_problems[i].name)
        }
      }
      console.log(problems)
      Session.set('resourceResultsWithProblemsList', [])
      for(var i = 0; i < problems.length; i++){
        resourceQuery_serviceType(problems[i])  // Using Apply somehow fails
      }
      console.log(Session.get('resourceResultsWithProblemsList'))
      Router.go('find_resources')
    }
  })
}