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
  createNewPatient: function(last_first){ createNewPatient(last_first) }
})

function getPatientsByName(last_first){
  arr = last_first_to_array(last_first)  
  
  last = arr[0].trim();
  first = arr[1].trim();

  return Patients.find({last: {$regex: new RegExp("^" + last + "$", "i") },
                        first: {$regex: new RegExp("^" + first + "$", "i") }}).fetch()
}

function createNewPatient(last_first){
  Patients.insert(new Patient(last_first))
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


  this.email = "no_email@aol.com"
  this.phone = "1-555-123-1234"
  this.texting = false

  this.street_address = "123 Fake Street"
  
  this.problems = ["Everything", "Nothing"]
}