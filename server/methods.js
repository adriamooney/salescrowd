Meteor.methods({
  getRootUrl: function(){
    var rootUrl = process.env.ROOT_URL;
    return rootUrl;
  },
  getReferralPathSession: function(referralPath, id) {
    Meteor.users.update({_id: id},{$set:{'profile.referralPath': referralPath}});
  },
  setUserType: function(userType, id) {
    Meteor.users.update({_id: id},{$set:{'profile.userType': userType}});
  },
  removeMsg: function(id) {
    AppMessages.collection.remove(id);
  },
  removeLinkedInMsg: function(id) {
    LinkedInMessages.remove(id);
  },
	sendInitialEmail: function(result) {
		return Accounts.sendEnrollmentEmail(result);
	},
  createNewSalesUser: function(email, password, username) {
  		//check(doc, Schema.User);
  	   Accounts.createUser({email: email, password : password, username: username, profile: {userType: 'salesperson', isActive: true, profileStatus: 0}});
  }, 
  createNewCompanyUser: function(email, password, username) {
    Accounts.createUser({email: email, password : password, username: username, profile: {userType: 'company', isActive: true, profileStatus: 0}});
  },
  updateSalesUser: function(id, userData) {
    Meteor.users.update( {_id: id}, {$set: userData});
  },
  switchUserType: function(id, newUserType) {
    Meteor.users.update({_id:id}, {$set: {'profile.userType': newUserType}});
  },
  //TODO: updateCompanyUser
  sendMessage: function(senderId, toId, msg) {
    //senderId, companyId, msg

    var thread = Threads.insert({'from': senderId, 'to': toId, 'status': 'active', timeStamp: new Date()}, function(err,doc) {
      Messages.insert({'threadId': doc, 'message': msg, 'from': senderId, 'to': toId, 'status': 'unread', 'timeStamp': new Date()} );
    });

    return thread;
  },
  replyToMessage: function(id, senderId, toId, msg, threadId) {
   // Messages.update( {_id: id}, {$push: {'replies': {'to': toId, 'status': 'unread', 'message': msg, 'from': senderId} }});

    Messages.insert({'threadId': threadId, 'message': msg, 'from': senderId, 'to': toId, 'status': 'unread', 'timeStamp': new Date()} );
    Threads.update({_id: threadId}, {$set:{'timeStamp': new Date()}})
  },
  deleteMessage: function(id) {
    Threads.remove({_id:id});
    Messages.remove({threadId: id}); 
  },
  archiveMessage: function(id) {
    Threads.update({_id:id}, {$set: {'status': 'archived'}});
    Messages.update({threadId: id}, {$set: {'status': 'archived'}}, { multi: true });
  },
  unarchiveMessage: function(id) {
    Threads.update({_id:id}, {$set: {'status': 'active'}});
    Messages.update({threadId: id}, {$set: {'status': 'read'}}, { multi: true });
  },
  readMessages: function() {
     Messages.update({to: Meteor.userId()}, {$set: {'status': 'read'}}, { multi: true } );
     //Messages.update({'replies.to': Meteor.userId()}, {$set: {'newReplies': 0}}, { multi: true });
  },
  sendEmail: function (to, from, subject, html, text) {
    check([to, from, subject, html], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    return Meteor.Mandrill.send({
        to: to,
        from: from,
        subject: subject,
        html: html,
        text: text
    });

    /*Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    }); */
  },
  approveSalesPerson: function(companyId, userId) {
    //Meteor.users.update({_id: userId}, {$addToSet: {'profile.approvedCompanies': {'company': companyId
    Meteor.users.update({_id: userId}, {$addToSet: {'profile.approvedCompanies': companyId}}); 
    Meteor.users.update({_id: this.userId}, {$addToSet: {'profile.approvedSalesPeople': userId}});  
  },
  removeSalesPerson: function(companyId, userId) {
   // Meteor.users.update({_id: userId}, {$pull: {'profile.approvedCompanies': {'company': companyId}}});
    Meteor.users.update({_id: userId}, {$pull: {'profile.approvedCompanies': companyId}});
    Meteor.users.update({_id: this.userId}, {$pull: {'profile.approvedSalesPeople': userId}}); 
  },
  updateSaleStatus: function(saleId, status) {
    Sales.update({_id: saleId}, {$set: {'status': status}});
  },
  updateLeadStatus: function(saleId, status) {
    Leads.update({_id: saleId}, {$set: {'status': status}});
  },
  addToCompanyFavorites: function(companyId, userId) {
    Meteor.users.update({_id: userId}, {$addToSet: {'profile.favoriteCompanies': companyId}});
  },
  removeFromCompanyFavorites: function(companyId, userId) {
    Meteor.users.update({_id: userId}, {$pull: {'profile.favoriteCompanies': companyId}});
  },
  addToSalesPeopleFavorites: function(salesId, userId) {
    Meteor.users.update({_id: userId}, {$addToSet: {'profile.favoriteSalesPeople': salesId}});
  },
  removeFromSalesPeopleFavorites: function(salesId, userId) {
    Meteor.users.update({_id: userId}, {$pull: {'profile.favoriteSalesPeople': salesId}});
  },
  addFeaturedSalesPeople: function(userId) {
    FeaturedSalesPeople.insert({userId: userId});
  },
  removeFeaturedSalesPeople: function(userId) {
    FeaturedSalesPeople.remove({userId: userId});
  },
  addFeaturedCompanies: function(companyId) {
    FeaturedCompanies.insert({companyId: companyId});
  },
  removeFeaturedCompanies: function(companyId) {
    FeaturedCompanies.remove({companyId: companyId});
  },
  lastLogin: function(id) {
    var now = new Date().getTime();
    Meteor.users.update({ _id: id }, {
        $set: { 'profile.lastActiveOn': new Date(now - 7 * 3600 * 1000) }
      }); 
  },
  addLogoToUser: function(url, id) {
    Meteor.users.update({_id: id}, {$set: {'profile.logo': url}});
  },
  addLogoToCompany: function(url, id) {
    Companies.update({_id: id}, {$set: {logo: url}});
  },
  newQuiz: function() {
    var userId = this.userId;
    var company = Companies.findOne({companyId: userId});
    var companyId = company._id;
    Quiz.insert({name: 'Quiz Name', companyId: companyId, companyUserId:userId, questions: [{'question':'', 'answers': [], 'correct': 0}]});
  },
  updateQuiz: function(id, name, question, answers, correct) {
  
    Quiz.update({_id: id}, {$addToSet: {questions: {'question': question, 'answers': answers, 'correct': correct} }, $set: {name:name}});

  },
  addQuizQuestion: function(id) {
        Quiz.update({_id: id}, {$push: {questions: {'question': '', 'answers': [], 'correct': 0} }});
  }
 /* getLinkedCompanyProfile: function(companyName) {


      if( Meteor.user().services.linkedin.accessToken) {
        var accessToken = Meteor.user().services.linkedin.accessToken;
        var linkedin = Linkedin().init(accessToken);
        var userId = this.userId;
        var self = this;
        linkedin.companies.name(companyName, Meteor.bindEnvironment(function(err, company) {

          console.log(company);
          console.log(err);


          if(!company.name) {

            var err = company;

            LinkedInMessages.insert({message: 'Your company name was entered incorrectly', messageType: 'danger'});
      
            throw new Meteor.Error( 500, err.message );

            return err;
          }
    // Here you go
        //console.log(company);
          var name = company.name;

          if(company.description) {
            var description = company.description;
          }
          else {
            var description = '';
          }

          if(company.websiteUrl) {
            var websiteUrl=company.websiteUrl;
          }
          else {
            var websiteUrl='';
          }
          
          if(company.logoUrl) {
            var logoUrl= company.logoUrl;
          }
          else {
            var logoUrl = '';
          }

          if(company.specialties) {
            var keywordsArr = company.specialties.values;
            var keywords = keywordsArr.toString();
          }
          else {
            var keywords = '';
          }
          

          var userId = self.userId;

          //var keywords = _.extend({}, keywordsArr);

          
          if(!err) {
            console.log(name);
            
           Companies.insert({
                name: name, 
                description: description, 
                websiteUrl: websiteUrl,
                logoUrl: logoUrl,
                //keywords: [keywords],
                keywords: keywords,
                accountIsActive: true, 
                companyId: userId, 
                companyProfileStatus:0,
                timeStamp: new Date(),
              }, function(err,doc) {
                console.log(err);
                Meteor.users.update({_id: userId}, {$set: {'profile.companyId': doc}}, function(err, doc) {
                  if(!err) {
                    LinkedInMessages.insert({message: 'Your company has been entered successfully', messageType: 'success'});
                  }
                  else {
                    LinkedInMessages.insert({message: 'There was an error submitting your company', messageType: 'danger'});
                  }
                });
              });

             

          } 
          else {
            console.log(err);
            
          }

        }));
      }

  }, 
  updateLinkedCompanyProfile: function(companyName, id) {

    if( Meteor.user().services.linkedin.accessToken) {
        var accessToken = Meteor.user().services.linkedin.accessToken;
        var linkedin = Linkedin().init(accessToken);
        var userId = this.userId;
        linkedin.companies.name(companyName, Meteor.bindEnvironment(function(err, company) {

          if(!company.name) {

            var err = company;

            LinkedInMessages.insert({message: 'Your company name was entered incorrectly', messageType: 'danger'});
      
            throw new Meteor.Error( 500, err.message );

            return err;
          }
    // Here you go
        //console.log(company);
          var name = company.name;

          if(company.description) {
            var description = company.description;
          }
          else {
            var description = '';
          }

          if(company.websiteUrl) {
            var websiteUrl=company.websiteUrl;
          }
          else {
            var websiteUrl='';
          }
          
          if(company.logoUrl) {
            var logoUrl= company.logoUrl;
          }
          else {
            var logoUrl = '';
          }

          if(company.specialties) {
            var keywordsArr = company.specialties.values;
            var keywords = keywordsArr.toString();
          }
          else {
            var keywords = '';
          }
          
          if(!err) {
            

            Companies.update({companyId: id}, {$set: {
              name: name, 
              description: description,
              websiteUrl: websiteUrl,
              logoUrl: logoUrl,
              keywords: keywords
            }}, function(err, doc) {
                if(!err) {
                  LinkedInMessages.insert({message: 'Your company has been updaged successfully', messageType: 'success'});
                }
            });

          }

        }));
      }

  } */

});


