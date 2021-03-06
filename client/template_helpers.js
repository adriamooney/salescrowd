Template.registerHelper('currentUserIsCompany', function() {   //TODO: these functions can be combined to use an argument  http://meteorcapture.com/spacebars/
	var user = Meteor.user().profile.userType;
	if (user == 'company') {
		return true;
	}
	else {
		return false;
	}
});

Template.registerHelper('currentUserIsSales', function() {
	var user = Meteor.user().profile.userType;
	if (user == 'salesperson') {
		return true;
	}
	else {
		return false;
	}
});

Template.registerHelper('noUserType', function() {
	var userType = Meteor.user().profile.userType;
	if (userType == 'other') {
		return true
	}
	else {
		return false;
	}
});

Template.registerHelper('userHasCompany', function() {
	var userType = Meteor.user().profile.userType;
	if (userType == 'company') {
		var id = Meteor.userId();
		var company = Companies.findOne({companyId: id});  

		if(company) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return true;
	}
});

Template.registerHelper('anyMessages', function() {
	var messages =  Messages.find({$or: [{from: Meteor.userId()},{to: Meteor.userId()}]}, {sort: {timeStamp: -1}});
	if (messages.count() > 0) {
		return true;
	}
	else {
		return false;
	}
});

Template.registerHelper('numNewMessages', function() {
	var messages = Messages.find({$and: [{to: Meteor.userId()},{'status': 'unread'}]});


	if (messages.count() > 0 ) {
		return messages.count();
	}
	else {
		return false;
	}
});

Template.registerHelper('approvedCompanies', function() {
	var companiesArr = Meteor.user().profile.approvedCompanies;
	if(companiesArr && companiesArr.length>0) {
		var ids = companiesArr;
		var companies = Companies.find({_id: {$in: ids}});
		return companies;
	}
	else {
		return false;
	}
	
});

Template.registerHelper('approvedSalesPeople', function() {

	var salesPeopleArr = Meteor.user().profile.approvedSalesPeople;
	if(salesPeopleArr && salesPeopleArr.length>0) {
		var salespeople = Meteor.users.find({_id: {$in: salesPeopleArr}});
		return salespeople; 
	}
	
	else {
		return false;
	}

});

Template.registerHelper('emptyCompanyProfile', function() {
    if(Meteor.user()) {

	    var userId = Meteor.userId();
	    var userType = Meteor.user().profile.userType;

	    var myCompany = Companies.findOne({'companyId': userId});
	    if(userType == 'company') {
	    	if(myCompany) {
		        if (myCompany.companyProfileStatus == 0 ) {
		            return true;
		        }
		    }
	        else {
	            return false;
	        }
	    }
	    else {
	        return false;
	    }
	}
	else {
		return false;
	}
});

Template.registerHelper('emptySalesProfile', function() {
	
	
	if(Meteor.user()) {
		var profileStatus = Meteor.user().profile.profileStatus;
		var userType = Meteor.user().profile.userType;
			if(userType == 'salesperson') {
			if (profileStatus == 0) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
	
	

});

Template.registerHelper('email', function() {
	var user = Meteor.user();
    if(!user.emails) {
        var userEmail = user.profile.emailAddress;
     }
     else {
        var userEmail = user.emails[0].address;
    }
    return userEmail;
});

Template.registerHelper('newDate', function() {
	return new Date();
});


// reviews 
Template.registerHelper('reviewExists', function(userId) {
		var commenterId = Meteor.userId();
		//var userId = this._id;
		var review = Reviews.findOne({userId: userId, commenterId: commenterId });
		
		if(review) {
			return true;
		}

		else {
			return false;
		}
});

Template.registerHelper('hasReviews', function(userId) {

		var review = Reviews.find({userId: userId }).count();
		
		if(review > 0) {
			return true;
		}

		else {
			return false;
		}
});

Template.registerHelper('allowedToReview', function(userId) {
		var commenterId = Meteor.userId();
		var reviewee = Meteor.users.findOne({_id: userId});
		//var userId = this._id;
		var review = Reviews.findOne({userId: userId, commenterId: commenterId });
		
		if(review) {
			return false;
		}


		if (Meteor.user().profile.userType == 'company' && reviewee.profile.userType == 'salesperson') {
			var salesPeopleArr = Meteor.user().profile.approvedSalesPeople;


			
				if(salesPeopleArr && salesPeopleArr.length>0) {
					console.log(salesPeopleArr);
					console.log(userId);
					//if there is a match, returns true
					return  _.contains(salesPeopleArr, userId);
				}
				else {
					return false;
				}
		
		}

		else if (Meteor.user().profile.userType == 'salesperson' && reviewee.profile.userType == 'company') {
			var companiesArr = Meteor.user().profile.approvedCompanies;  //id's of companies
			//need to know if userId maps to the company's companyId.  
			if(companiesArr && companiesArr.length>0) {
				console.log(companiesArr);
				console.log(userId);
				var companyUsersArr = [];
				var companies = Companies.find({_id: {$in: companiesArr}});

				companies.forEach(function (company) {
					companyUsersArr.push(company.companyId);

				});

				//if there is a match, returns true
				return  _.contains(companyUsersArr, userId);
			}
			else {
				return false;
			}
		}


		else {
			return false;
		}
});


Template.registerHelper('averageStarRating', function(userId) {

		//var userId = this._id;
		var reviews = Reviews.find({userId: userId });
		var arr = [];
		
		reviews.forEach(function(doc){  //cursor.forEach
			arr.push(doc.rating);
		});

		var avg = _.reduce(arr, function(memo, num) {  //get average rating
	        return memo + num;
	    }, 0) / (arr.length === 0 ? 1 : arr.length);

	    return avg.toFixed(1);
});
Template.registerHelper('numReviews', function(userId) {
		//var userId = this._id;
		var reviews = Reviews.find({userId: userId }).count();
		return reviews;
});

Template.registerHelper('reviewsForUser', function(userId) {
		//var userId = this._id;
		var reviews = Reviews.find({userId: userId });
		if(reviews.count() > 0) {
			return reviews;
		}
		else {
			return false;
		}
});

Template.registerHelper("equals_or", function(param, arr) {
   arr = arr.split(",");
   if (arr.indexOf(param) !== -1) {
      return true;
   } 
   else {
     return false;
   }
});




