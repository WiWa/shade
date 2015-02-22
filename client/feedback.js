if(Meteor.isClient){
  Template.feedback.events({
    'click #giveFeedbackBtn': function(){
      var feedback = $("#commentArea")[0].value
      var recipient = "win.wang@vandebilt.edu"
      Meteor.call('sendEmail',
            recipient,
            'appFeedback@clinic.com',
            'Feedback on App',
            feedback);
      Router.go('start')
    }
  })
}