var verbose = true; // hide console.logs


angular.module('BabyBoomApp').controller('ContactsController', function($http, $location){

  if (verbose) console.log('inside contacts controller');

var ctrl = this;



ctrl.addNewContact = function (newName, newEmail) {
//  console.log('contactToAdd', newName, newEmail);

  var contactToAdd = {
    contactname: newName,
    contactemail: newEmail,
  };

$http.post('/bbdb/addNewContact', contactToAdd).then(function () {

  ctrl.newContactEmail = "";
  ctrl.newContactName = "";
  ctrl.populateDom();

});


}

ctrl.deleteContact = function (contactToDelete) {
  if (verbose) console.log('contactToDelete', contactToDelete);

  $http.delete('/bbdb/deleteContact/' + contactToDelete.id)

  ctrl.populateDom();
}




ctrl.updateContact = function (contactToUpdate) {
    if (verbose)   console.log('contactToUpdate', contactToUpdate);
  $http.put('/bbdb/updateContact', contactToUpdate)

  ctrl.populateDom();
}


ctrl.populateDom = function () {
  $http.get('/bbdb/getContacts').then(function(response) {
//    console.log('here!' , response.data);
    ctrl.contactList = response.data; // contacts

  });

  //  ??? profit!!??
}; // close populateDom


ctrl.populateDom(); // calls the initial time


ctrl.logout = function() {
  $http.delete('/login').then(function(){
    console.log('Successfully logged out!');
    $location.path('/');
  }).catch(function(err){
    console.log('Error logging out');
  });
}; // closes logout

}); // closes controller
