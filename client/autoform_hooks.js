AutoForm.hooks({
  insertCompanyForm: {

    // Called when any submit operation succeeds
    onSuccess: function(formType, result) {
      //console.log(result);
      var company = Companies.findOne({_id: result});
      var email = company.email;

      //Router.go('/');

      //console.log(email);
      //Accounts.createUser({email:email, password: 'password', profile: {companyId: result, userType: 'company'} });
      
      //Meteor.call('createNewCompanyUser', email, result);
       //Accounts.sendEnrollmentEmail(result); //needs to be called from server. make a method for this
    }
  }/*,
  userSignup: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {

     // var email = insertDoc.emails[0].address;
      console.log(insertDoc);


      Accounts.createUser({
        email: insertDoc.email,
        password: insertDoc.password
      });  


      this.done();

      return false;
    }

  }  */

});

