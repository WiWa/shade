if(Meteor.isClient){

  Template.editPatient.helpers({
    patient: function(){
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
      return ret
    }
  })

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
          Router.go("start")
        }
      })

    }
  })

}