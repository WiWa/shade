if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    Patients = new Meteor.Collection("patients")
    
    Patients.remove({})

    createNewPatient("Zero, Patience")

    var patients = Patients.find({}).fetch()
    console.log("Patient :  ", patients[0])

    //console.log("Whee Test :  ", getPatientsByName("Zero, Patience"))

  });
}

Meteor.methods({
  getPatientsByName: function(last_first){ return getPatientsByName(last_first) },
  getPatientById: function(id){ return getPatientById(id) },
  createNewPatient: function(last_first){ return createNewPatient(last_first) },
  updatePatient: function(id, updateObj){ updatePatient(id, updateObj) },
  
    sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  }

})

function getPatientsByName(last_first){
  arr = last_first_to_array(last_first)  
  
  last = arr[0].trim();
  first = arr[1].trim();

  var patients 
  if(first){
    patients = Patients.find({last: {$regex: new RegExp("^" + last + "$", "i") },
                        first: {$regex: new RegExp("^" + first + "$", "i") }}).fetch()
  }
  else{
    patients = Patients.find({last: {$regex: new RegExp("^" + last + "$", "i") }}).fetch()
  }
  return patients
}

function getPatientById(id){
  return Patients.findOne({_id: id})
}

function createNewPatient(last_first){
  newPatient = new Patient(last_first)
  new_id = Patients.insert(newPatient)
  newPatient._id = new_id
  return newPatient 
}
function updatePatient(id, updateObj){
  console.log("PreUpdate: ", Patients.findOne({_id: id}))
  Patients.update({_id: id}, { $set: updateObj })
  console.log("PostUpdate: ", Patients.findOne({_id: id}))
}

function last_first_to_array(last_first){
  var last_first_array = last_first.split(',');
  last_first_array[0] = (last_first_array[0] || "").trim();
  last_first_array[1] = (last_first_array[1] || "").trim();

  return last_first_array
}

function Patient(last_first){
  arr = last_first_to_array(last_first)  
  
  last = arr[0].trim();
  first = arr[1].trim();
  
  this.first = first
  this.last = last


  this.email = ""
  this.phone = ""

  this.address = ""

  this.needsTransportation = true
  
  this.problems = ["Alcohol", "Support group", "Dental", "Medical Care"]
}
