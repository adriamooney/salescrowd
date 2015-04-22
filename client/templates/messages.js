/*Template.threads.helpers({
	threads: function() {
		var threads = Threads.find({$or: [{$and: [{to: Meteor.userId()},{'status': 'active'}]}, {$and: [{from: Meteor.userId()},{'status': 'active'}]}]},  {sort: {timeStamp: -1}});
		if (threads.count() > 0) {
			return threads;
		}
		else {
			return false;
		}
	}
	
});

Template.thread.helpers({
	messages: function() {
		var threadId = this._id;
		var messages = Messages.find({$or: [{$and: [{threadId: threadId},{'status': 'unread'}]}, {$and: [{threadId: threadId},{'status': 'read'}]}]},  {sort: {timeStamp: -1}});
		if (messages.count() > 0) {
			return messages;
		}
		else {
			return false;
		}

	}
});  */

Template.messages.helpers({
	messages: function() {
		var threadId = this._id;
		var messages = Messages.find({$or: [{$and: [{threadId: threadId},{'status': 'unread'}]}, {$and: [{threadId: threadId},{'status': 'read'}]}]},  {sort: {timeStamp: 1}});
		if (messages.count() > 0) {
			return messages;
		}
		else {
			return false;
		}

	},
	threads: function() {
		var threads = Threads.find({$or: [{$and: [{to: Meteor.userId()},{'status': 'active'}]}, {$and: [{from: Meteor.userId()},{'status': 'active'}]}]},  {sort: {timeStamp: -1}});
		if (threads.count() > 0) {
			return threads;
		}
		else {
			return false;
		}
	},
	timeAgo: function() {
		var time = this.timeStamp;
		//return moment(time).fromNow();
		return moment().format('L');
	},
	messagesToMe: function() {
		//return Messages.find({$and: [{to: Meteor.userId()},{status: 'unread'}]}, {sort: {timeStamp: -1}});
		var messages = Messages.find({$or: [{$and: [{to: Meteor.userId()},{'status': 'unread'}]}, {$and: [{to: Meteor.userId()},{'status': 'read'}]}]},  {sort: {timeStamp: -1}});
		if (messages.count() > 0) {
			return messages;
		}
		else {
			return false;
		}
		//return Messages.find({$or: [{$and: [{to: Meteor.userId()},{'status': 'unread'}]}, {$and: [{to: Meteor.userId()},{'status': 'read'}]}]},  {sort: {timeStamp: -1}});
	},
	messagesFromMe: function() {
		var messages =  Messages.find({$or: [{$and: [{from: Meteor.userId()},{'status': 'unread'}]}, {$and: [{from: Meteor.userId()},{'status': 'read'}]}]},  {sort: {timeStamp: -1}});
		if (messages.count() > 0) {
			return messages;
		}
		else {
			return false;
		}
		//return Messages.find({$and: [{from: Meteor.userId()},{status: 'unread'}]}, {sort: {timeStamp: -1}});
	},
	fromId: function() {
		var fromId = this.from;
		var from =  Meteor.users.findOne({_id: fromId});
		if(from.profile.userType == 'company') {
			var companyId = from.profile.companyId;
			var company = Companies.findOne({_id: companyId});
			var person = company.name;
		}
		else {
			var person = from.profile.firstName+' '+ from.profile.lastName;
		}
		return person;
	},
	toId: function() {
		var toId = this.to;
		var to =  Meteor.users.findOne({_id: toId});
		console.log(toId);
		if(to.profile.userType == 'company') {
			var companyId = to.profile.companyId;
			console.log(companyId);
			var company = Companies.findOne({_id: companyId});
			var person = company.name;
		}
		else {
			var person = to.profile.firstName +' '+ to.profile.lastName;
		}
		return person;
	}
});

Template.thread.helpers({
	fromId: function() {
		var fromId = this.from;
		console.log(this);
		var from =  Meteor.users.findOne({_id: fromId});
		console.log(from);
		if(from.profile.userType == 'company') {
			var companyId = from.profile.companyId;
			console.log(companyId);
			var company = Companies.findOne({_id: companyId});
			var person = company.name;
		}
		else {
			var person = from.profile.firstName+' '+ from.profile.lastName;
		}
		return person;
	},
	toId: function() {
		var toId = this.to;
		var to =  Meteor.users.findOne({_id: toId});
		console.log(toId);
		if(to.profile.userType == 'company') {
			var companyId = to.profile.companyId;
			var company = Companies.findOne({_id: companyId});
			var person = company.name;
		}
		else {
			var person = to.profile.firstName +' '+ to.profile.lastName;
		}
		return person;
	},
	timeAgo: function() {
		var time = this.timeStamp;
		return moment().format('L');
		//return moment(time).fromNow();
	},
	messages: function() {
		var threadId = this._id;
		var messages = Messages.find({$or: [{$and: [{threadId: threadId},{'status': 'unread'}]}, {$and: [{threadId: threadId},{'status': 'read'}]}]},  {sort: {timeStamp: -1}});
		if (messages.count() > 0) {
			return messages;
		}
		else {
			return false;
		}

	}
});

Template.searchBox.helpers({
	fromId: function() {
		var fromId = this.from;
		var from =  Meteor.users.findOne({_id: fromId});
		if(from.profile.userType == 'company') {
			var companyId = from.profile.companyId;
			var company = Companies.findOne({_id: companyId});
			var person = company.name;
		}
		else {
			var person = from.profile.firstName+' '+ from.profile.lastName;
		}
		
		return person;
	},
	toId: function() {
		var toId = this.to;
		var to =  Meteor.users.findOne({_id: toId});
		if(to.profile.userType == 'company') {
			var companyId = to.profile.companyId;
			var company = Companies.findOne({_id: companyId});
			var person = company.name;
		}
		else {
			var person = to.profile.firstName +' '+ to.profile.lastName;
		}
		return person;
	},
	messageStatus: function(status) {
		console.log(status);
    	return this.status === status;
  	},
  	expandThread: function() {
  		//var threadId = Session.get('threadId');
  		var threadId = this.threadId;
  		var allMsgs = Messages.find({threadId: threadId}, {sort: {timeStamp: 1}});
  		return allMsgs;
  	},
  	threadIsExpanded: function() {
  		var thisThread = this.threadId;
  		var threadId = Session.get('threadId');
  		if(thisThread == threadId) {
  			return true;
  		}
  		else {
  			return false;
  		}
  	}
});

Template.searchBox.events({
	'click .expand-thread': function(event, template) {
		event.preventDefault();
		var threadId = this.threadId;
		Session.set('threadId', threadId);
		//var allMsgs = Messages.find({threadId: threadId});
	}
});

Template.messages.events({
	'click .delete-msg': function(event, template) {
		event.preventDefault();
		console.log(this);
		Meteor.call('deleteMessage', this._id, function() {
			AppMessages.throw('Message thread deleted', 'success');
		});
	},
	'click .archive-msg': function(event, template) {
		console.log('clicked');
		event.preventDefault();
		Meteor.call('archiveMessage', this._id, function() {
			AppMessages.throw('Message thread archived', 'success');
		});
	},
	'click .unarchive-msg': function(event, template) {
		event.preventDefault();
		console.log(this);
		Meteor.call('unarchiveMessage', this.threadId, function() {
			AppMessages.throw('Message thread unarchived', 'success');
		});

	},
	'click .expandThread': function(event, template) {
		var id = this._id;
		$(event.currentTarget).closest('.panel').find('.panel-body').removeClass('hidden');
		$('#toggle-'+id).html('<button class="hideThread pull-left btn btn-xs btn-info"><i class="glyphicon glyphicon-minus"></i></button>');
		//todo: use a session to show thread is read?  not sure how to handle this

	},
	'click .hideThread': function(event, template) {
		var id = this._id;
		$(event.currentTarget).closest('.panel').find('.panel-body').addClass('hidden');
		$('#toggle-'+id).html('<button class="expandThread pull-left btn btn-xs btn-info"><i class="glyphicon glyphicon-plus"></i></button>');
	}

});



Template.reply.events({
	'submit #replyToMessage': function(event, template) {
		event.preventDefault();

		var senderId = Meteor.userId();  //should be same as this.to

		var threadId = (this._id);
		console.log(threadId);

		/*var toId;
		if (this.replies) {
			var lastReplyArr = this.replies.pop();
			toId = lastReplyArr.from;
		}
		else {
			toId = this.from;
		} */
		
		//to should be the person who last said something.
		var self = this;

		var threadId = this._id;
		var lastMsg = Messages.find({threadId: threadId}, {sort: {timeStamp: -1}, limit:1}).fetch();

		var toId = lastMsg[0].from;


		var user =  Meteor.users.findOne({_id: toId});

		var to = user.emails;
		if(!to) {
			to = user.profile.emailAddress;
		}
		else {
			to = user.emails[0].address;
		}

		//var from = Meteor.user().profile.emailAddress;

		var msg = template.find('#message').value;

		if (msg != '') {
			Meteor.call('replyToMessage', this._id, senderId, toId, msg, threadId, function(err) {
				if(!err) {
					

					AppMessages.throw('your messages was sent', 'success');
					// sendEmail: function (to, from, subject, html, text) {
					var rootUrl = Session.get('rootUrl');
					var cleanmsg = msg.replace(/'/g, '&lsquo;');
					Meteor.call('sendEmail', to, 'noreply@launchtaffy.com', 'You have a LaunchTaffy Message', 'You have a LaunchTaffy Message:<br /><br />'+cleanmsg+'<br /><br /><a href="'+rootUrl+'/message/'+self._id+'">Reply</a>', 'You have a LaunchTaffy Message. Log in and check your inbox.');
					template.find('#message').value = ''; 
				}
				else {
					AppMessages.throw(err.reason, 'danger');
				}
			}); 
		}
		else {
			AppMessages.throw('You forgot to write a reply.', 'danger');
		}

		
	}
});