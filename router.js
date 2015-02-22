Router.map( function(){
  this.route('start', {
    path: '/',
    data: function(){
      Session.set("patientResultsList", null)
    }
  })
  this.route('edit_patient', {
    path: 'edit_patient/:_id',
    data: function(){
      //console.log(this.params)
      Meteor.call('getPatientById', this.params._id, function(err, patient){
        if(err){
          console.log(err)
        }
        else if(patient){
          Session.set("Patient", patient)
        }

      })
      return {_id: this.params._id}
    }
  })
  this.route('queries')
})