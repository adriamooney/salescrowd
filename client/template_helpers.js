/*Template.registerHelper('isSalesPerson', function() {
	var user = Meteor.user();
	if(user) {
		var userType =  user.profile.userType;
		if (userType == 'salesperson') {
			return true;
		}
	}
		
});
 */
/*Template.registerHelper('isCompany', function() {

		var user = Meteor.user();
		if(user) {
			var userType =  user.profile.userType;
			if (userType == 'company') {
				return true;
			}
		}
}); */

/*Template.registerHelper('userType', function() {

	if (Meteor.user()) {
		return Meteor.user().profile.userType;
	}
		
}); */

/*Template.registerHelper('thisCompany', function() {

	if (Meteor.user()) {

		var userId = Meteor.userId();

		if(userId == companyId) {
			var company = Companies.findOne({companyId: userId});
			return company;
		}
	}
		
});  */

Template.registerHelper('currentUserIsCompany', function() {
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
