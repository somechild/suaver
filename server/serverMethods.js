if (Meteor.isServer) {
	Meteor.methods({
		changeProfileSettings: function(data) {
			if (!Meteor.userId()) {
				throw new Meteor.error('Unauthorized acces.');
			};
			var digest = {digest: data.passwordConfirm, algorithm: 'sha-256'};
			var result = Accounts._checkPassword(Meteor.user(), digest);

			if(result.error == null){
				var fullName = data.fullName.trim();
				if (fullName !== Meteor.user().profile.fullName) {
					if (fullName.length > 0) {
						Meteor.users.update(Meteor.userId(), {$set: {"profile.fullName": fullName}});
					}
					else{
						throw new Meteor.error('Please enter a valid name.');
					};
				};
				var email = data.email.trim();
				if (email !== Meteor.user().emails[0].address) {
					var regexp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
					if (regexp.test(email)) {
						if(typeof Meteor.users.findOne({"emails": {$elemMatch:{"address": email}}}) == 'undefined'){
							Meteor.users.update(Meteor.userId(), {$set: {"emails": [{"address": email, "verified" : false}]}});
							Accounts.sendVerificationEmail(Meteor.userId());
						}
						else{
							throw new Meteor.error('Email exists');
						};
					}
					else{
						throw new Meteor.error('Please enter a valid email');
					};
				};
			};
		},
		updateSocialSettings: function(socialObj) {
			if (!Meteor.userId()) {
				throw new Meteor.error('Unauthorized acces.');
			};
			if (typeof socialObj !== "object") {
				throw new Meteor.error('Invalid data sent.');
			};
			if (socialObj.arr.indexOf('fb') !== -1) {
				Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.fb": socialObj.fb}});
			};
			if (socialObj.arr.indexOf('twtr') !== -1) {
				Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.twtr": socialObj.twtr}});
			};
			if (socialObj.arr.indexOf('ig') !== -1) {
				Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.ig": socialObj.ig}});
			};
			if (socialObj.arr.indexOf('lnkd') !== -1) {
				Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.lnkd": socialObj.lnkd}});
			};
			if (socialObj.arr.indexOf('snpcht') !== -1) {
				Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.snpcht": socialObj.snpcht}});
			};
			if (socialObj.arr.indexOf('tmblr') !== -1) {
				Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.tmblr": socialObj.tmblr}});
			};
		},
		generatePageUrl: function(options) {
			if (!Meteor.userId()) {
				throw new Meteor.error('Unauthorized acces.');
			};
			var itemsToShareObj = options.fields;

			
			if (GeneratedProfiles.findOne({"ownerId": Meteor.userId(), "sharedFields": options})) {
				return GeneratedProfiles.findOne({"ownerId": Meteor.userId(), "sharedFields": options})._id;
			}
			else{
				var Fut = new Future();
				GeneratedProfiles.insert({
					"createdAt": new Date(),
					"ownerId": Meteor.userId(),
					"sharedFields": itemsToShareObj,
					"showBusinessCard": options.showBusinessCard
				}, function(err, thisId) {
					if (err) {
						throw new Meteor.error(err.error);
					}
					else{
						Fut['return'](thisId);
					};
				});
				return Fut.wait();
			};
		},
		bookmarkPage: function(pageId){
			if (!Meteor.userId()) {
				throw new Meteor.error('Unauthorized acces.');
			};
			Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.bookmarkedPages": pageId}});
		}
	});
};