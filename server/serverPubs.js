if (Meteor.isServer) {
	Meteor.publish('userProfileImage', function (ownerId) {
		return SiteImages.find({"ownerId": ownerId, "imageType": "profileImage"}, {sort: {"uploadedAt": -1}, limit: 1});
	});
	Meteor.publish('userBusinessCard', function (ownerId) {
		return SiteImages.find({"ownerId": ownerId, "imageType": "businessCard"}, {sort: {"uploadedAt": -1}, limit: 1});
	});
	Meteor.publish('userName', function (userId) {
		return Meteor.users.find({"_id": userId}, {"fields": {"profile.fullName": 1}});
	});
	Meteor.publish('userProfileDatas', function (generatedPageId) {
		if (!generatedPageId) {
			throw new Meteor.error('Invalid request.');
		};
		if (!GeneratedProfiles.findOne({"_id": generatedPageId})) {
			throw new Meteor.error('Page does not exist');
		};
		var genpg = GeneratedProfiles.findOne({"_id": generatedPageId});
		var sharedFields = genpg.sharedFields;
		var fieldsToUser = {};
		for (var i = 0; i < sharedFields.length; i++) {
			if (sharedFields.fieldType == 'fb') {
				fieldsToUser.fb = 1;
			}
			else{
				fieldsToUser.fb = 0;
			};
			if (sharedFields.fieldType == 'twtr') {
				fieldsToUser.twtr = 1;
			}
			else{
				fieldsToUser.twtr = 0;
			};
			if (sharedFields.fieldType == 'ig') {
				fieldsToUser.ig = 1;
			}
			else{
				fieldsToUser.ig = 0;
			};
			if (sharedFields.fieldType == 'lnkd') {
				fieldsToUser.lnkd = 1;
			}
			else{
				fieldsToUser.lnkd = 0;
			};
			if (sharedFields.fieldType == 'snpcht') {
				fieldsToUser.snpcht = 1;
			}
			else{
				fieldsToUser.snpcht = 0;
			};
			if (sharedFields.fieldType == 'tmblr') {
				fieldsToUser.tmblr = 1;
			}
			else{
				fieldsToUser.tmblr = 0;
			};
		};
		console.log(Meteor.users.findOne({"_id": genpg.ownerId}, {"profile.fb": fieldsToUser.fb, "profile.twtr": fieldsToUser.twtr, "profile.ig": fieldsToUser.ig, "profile.lnkd": fieldsToUser.lnkd, "profile.snpcht": fieldsToUser.snpcht, "profile.tmblr": fieldsToUser.tmblr}))
		return Meteor.users.find({"_id": genpg.ownerId}, {"profile.fb": fieldsToUser.fb, "profile.twtr": fieldsToUser.twtr, "profile.ig": fieldsToUser.ig, "profile.lnkd": fieldsToUser.lnkd, "profile.snpcht": fieldsToUser.snpcht, "profile.tmblr": fieldsToUser.tmblr});
	}),
	Meteor.publish('pageViewData', function (generatedPageId) {
		return GeneratedProfiles.find({"_id": generatedPageId});
	});
};