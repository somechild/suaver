Meteor.startup(function () {
	smtp = {
		username: 'noreply@suaver.me',
		password: '465823',
		server:   'mail.privateemail.com',
		port: 587
	}

	process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

	Accounts.emailTemplates.from = 'Suaver <noreply@suaver.me>';

	Accounts.emailTemplates.siteName = 'Suaver';

	Accounts.emailTemplates.verifyEmail.subject = function(user) {
		return 'Welcome to Suaver.';
	};

	Accounts.emailTemplates.verifyEmail.html = function(user, url) {
		return '<body><img src="http://suaver.me/images/favicon.png" style="width:50px;"><h1 style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif;text-align:center;width:100%;display:block;font-size:18px;font-weight:normal;">Welome to Suaver, '+ user.profile.fullName +'!</h1><p><a style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif;text-align:center;width:100%;display:block;color:orange;font-size:14px;text-decoration:none;" href="'+ url +'">Click here to confirm your email</a></p></body>';
	};

});	
if(Meteor.isServer){
	Accounts.onCreateUser(function(options, user) {

		if(!options.profile.fullName || !options.email){
			throw new Meteor.Error("Account creation err.");
		}
		var emailRegEx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
		var emailFormatCheck = emailRegEx.test(options.email);
		if(!emailFormatCheck){
			throw new Meteor.Error("Account creation err.");
		}

		var checkEmailExists = options.email.toLowerCase();
		if(Meteor.users.findOne({"emails": {$elemMatch:{"address": checkEmailExists}}})){
			throw new Meteor.Error("Email already taken.")
		}

		if (options.profile){
			options.email = options.email.toLowerCase();
			user.profile = options.profile;
		}
		// we wait for Meteor to create the user before sending an email
		Meteor.setTimeout(function() {
			if (Meteor.users.findOne({"_id": user._id})) {
				Accounts.sendVerificationEmail(user._id);
			}
		}, 2 * 1000);

		return user;
	});
}