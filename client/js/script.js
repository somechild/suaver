 if (Meteor.isClient) {
 	//client code
 	Template.signupPage.created = function () {
 		if (Accounts._verifyEmailToken) {
   		  Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
		      if (err != null) {
		        if (err.message = 'Verify email link expired [403]') {
		          alert('Sorry this verification link has expired.');
		        };
		      }
		      else {
		        Router.go('/p');
		      };
		    });
		  }

 	};
 	Template.signupPage.events({
 		'submit form[name="signUp"]': function(e) {
 			e.preventDefault();
 			var email = $('input[name="email"]').val();
 			var fullName = $('input[name="full-name"]').val();
 			var password = $('input[name="password"]').val();
 			var passwordConf = $('input[name="passwordConf"]').val();
 			if (password==passwordConf) {
 				Accounts.createUser({"email": email, "password": password, "profile": {"createdAt": new Date(), "fullName": fullName}}, function(err) {
					if (err) {
						alert(err.error);
					};
				});
 			}
 			else{
 				alert('Passwords don\'t match');
 			};

 		}
 	});

 	Template.loginPage.events({
 		'submit form[name="login"]': function(e) {
 			e.preventDefault();
 			var email = $('input[name="email"]').val();
 			var password = $('input[name="password"]').val();
 			Meteor.loginWithPassword(email, password, function(err){
				if (err) {
					alert(err.error);
				}
				else{
					if (window.location.pathname.indexOf('pebblelogin') !== -1) {
						function getQueryParam(variable, defaultValue) {
						  // Find all URL parameters
						  var query = location.search.substring(1);
						  var vars = query.split('&');
						  for (var i = 0; i < vars.length; i++) {
						    var pair = vars[i].split('=');

						    // If the query variable parameter is found, decode it to use and return it for use
						    if (pair[0] === variable) {
						      return decodeURIComponent(pair[1]);
						    }
						  }
						  return defaultValue || false;
						}

						// Set the return URL depending on the runtime environment
						var return_to = getQueryParam('return_to', 'pebblejs://close#');
						var configObj = {
							'signedIn': true,
							'email': Meteor.user().emails[0].address,
							'password': password,
							'facebook': Meteor.user().profile.fb,
							'twitter': Meteor.user().profile.twtr,
							'linkedin': Meteor.user().profile.lnkd,
							'instagram': Meteor.user().profile.ig,
							'tumblr': Meteor.user().profile.tmblr,
							'snapchat': Meteor.user().profile.snpcht
						};
						location.href = return_to + encodeURIComponent(JSON.stringify(configObj));
					}
					else{
						Router.go('/p');
					};
				};
			});
 		}
 	});

 	Template.profileSetttings.rendered = function () {
 		var emailConf = Meteor.user().emails[0].verified;
 		if (!emailConf) {
 			alert('Please remember to verify your email.');
 		};
 	};
 	Template.profileSetttings.helpers({
 		getUserName: function() {
			return Meteor.user().profile.fullName;
		},
		email: function() {
			return Meteor.user().emails[0].address;
		},
		userProf: function() {
			return Meteor.user().profile;
		},
		userImg: function() {
			var a = Meteor.subscribe('userProfileImage', Meteor.userId());
			if (a.ready()) {
				var simgs = SiteImages.findOne({"imageType": "profileImage"}, {sort: {"uploadedAt": -1}, limit: 1});
				return simgs? simgs.url()? simgs.url(): '/images/loadIco.gif': '';
			};
		},
		businessImg: function() {
			var a = Meteor.subscribe('userBusinessCard', Meteor.userId());
			if (a.ready()) {
				var simgs = SiteImages.findOne({"imageType": "businessCard"}, {sort: {"uploadedAt": -1}, limit: 1});
				return simgs? simgs.url()? simgs.url(): '/images/loadIco.gif': '';
			};
		}
 	});
 	Template.profileSetttings.events({
 		'change input[name="profileImageChangeInput"]': function (e) {
 			var thisval = $(e.target)[0].files[0];
 			var file = new FS.File(thisval);
				file.imageType = 'profileImage';
				file.ownerId = Meteor.userId();
				if (SiteImages.findOne({"ownerId": Meteor.userId(), "imageType": "profileImage"})) {
					SiteImages.remove({"_id": SiteImages.findOne({"ownerId": Meteor.userId(), "imageType": "profileImage"})._id}, function(err) {
						if (err) {
							return alert(err.error);
						}
						else{
							SiteImages.insert(file, function(err) {
				 				if (err) {
				 					return alert(err.error);
				 				};
				 			});
						};
					});
				}
				else{
					SiteImages.insert(file, function(err) {
		 				if (err) {
		 					return alert(err.error);
		 				};
		 			});
				};
 			$(e.target).val('');
 		},
 		'change input[name="profileBusinessaCardUploadButtonInput"]': function(e) {
 			var thisval = $(e.target)[0].files[0];
 			var file = new FS.File(thisval);
				file.imageType = 'businessCard';
				file.ownerId = Meteor.userId();
				if (SiteImages.findOne({"ownerId": Meteor.userId(), "imageType": "businessCard"})) {
					SiteImages.remove({"_id": SiteImages.findOne({"ownerId": Meteor.userId(), "imageType": "businessCard"})._id}, function(err) {
						if (err) {
							return alert(err.error);
						}
						else{
							SiteImages.insert(file, function(err) {
				 				if (err) {
				 					return alert(err.error);
				 				};
				 			});
						};
					});
				}
				else{
					SiteImages.insert(file, function(err) {
		 				if (err) {
		 					return alert(err.error);
		 				};
		 			});
				};
 			$(e.target).val('');
 		},
 		'click #remove': function () {
 			if (SiteImages.findOne({"ownerId": Meteor.userId(), "imageType": "profileImage"})) {
	 			SiteImages.remove({"_id": SiteImages.findOne({"ownerId": Meteor.userId(), "imageType": "profileImage"})._id}, function(err) {
					if (err) {
						return alert(err.error);
					}
				});
			};
 		},
 		'click #saveProfile': function () {
			var email = $('input[name="profileEmail"]').val();
 			var fullName = $('input[name="profileFullname"]').val();
 			var password = $('input[name="profileNewPassword"]').val();
 			var passwordConfirm = $('input[name="profileNewPasswordConf"]').val();
 			if (passwordConfirm == password) {
	 			$('#profile-setting').before('<div id="modal" class="passwordConfModal"> <input type="password" placeholder="Your old password"><br><input type="submit" name="confirmPassword" value="Confirm" id="confirm"><input type="submit" name="cancelPassword" value="Cancel" id="cancel"></div>');
	 			$('.passwordConfModal input[name="confirmPassword"]').focus();
		 		$('.passwordConfModal input[name="confirmPassword"]').click(function() {
		 			var passwordVerify = $('.passwordConfModal>input[type="password"]').val();
	 				if (password.length > 0) {
	 					Accounts.changePassword(passwordVerify, password, function(err){
							if(err){
								alert(err.error);
							};
						});
		 			};
		 			var tempObj = {
		 				"passwordConfirm": Package.sha.SHA256(passwordVerify).toString(),
		 				"fullName": fullName,
		 				"email": email
		 			};
		 			Meteor.call('changeProfileSettings', tempObj, function (err) {
		 				if (err) {
		 					return alert(err.error);
		 				}
		 				else{
		 					alert('Saved.');
		 					$('.passwordConfModal').remove();
		 				};
		 			});
		 		});
		 		$('.passwordConfModal input[name="cancelPassword"]').click(function() {
		 			$('.passwordConfModal').remove();
		 		});
		 	};
 		},
 		'click #save-social': function () {
 			function ValidURL(str) {
			  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

			  if(!pattern.test(str)) {
			    return false;
			  } else {
			    return true;
			  }
			}
 			var twitter = $('input[name="twitterLink"]').val();
 			var facebook = $('input[name="facebookLink"]').val();
 			var instagram = $('input[name="instagramLink"]').val(); 
 			var linkedin = $('input[name="linkedinLink"]').val();
 			var snapchatUser = $('input[name="snapchatUsername"]').val();
 			var tumblrLink = $('input[name="tumblrLink"]').val();
 			var tempObj = {
 				arr: []
 			};
 			if (twitter.length>0) {
 				if(!ValidURL(twitter)){return alert('Non valid url: twitter')};
 				tempObj.arr.push('twtr');
 				tempObj.twtr = twitter;
 			};
 			if (facebook.length>0) {
 				if(!ValidURL(facebook)){return alert('Non valid url: facebook')};
 				tempObj.arr.push('fb');
 				tempObj.fb = facebook;
 			};
 			if (instagram.length>0) {
 				if(!ValidURL(instagram)){return alert('Non valid url: instagram')};
 				tempObj.arr.push('ig');
 				tempObj.ig = instagram;
 			};
 			if (linkedin.length>0) {
 				if(!ValidURL(linkedin)){return alert('Non valid url: linkedin')};
 				tempObj.arr.push('lnkd');
 				tempObj.lnkd = linkedin;
 			};
 			if (snapchatUser.length>0) {
 				tempObj.arr.push('snpcht');
 				tempObj.snpcht = snapchatUser;
 			};
 			if (tumblrLink.length>0) {
 				if(!ValidURL(tumblrLink)){return alert('Non valid url: tumblrLink')};
 				tempObj.arr.push('tmblr');
 				tempObj.tmblr = tumblrLink;
 			};
 			Meteor.call('updateSocialSettings', tempObj, function(err) {
 				if (err) {
 					return alert(err.error);
 				}
 				else{
 					alert('saved!');
 				};
 			});
 		}
 	});
 	Template.bookmarkedPages.created = function () {
 		var emailConf = Meteor.user().emails[0].verified;
 		if (!emailConf) {
 			alert('Please verify your email to use this.');
 			Router.go('/p');
 		};
 	};
	Template.bookmarkedPages.helpers({
		getUserName: function() {
			var thisPageId = this.value;
			var a = Meteor.subscribe('pageViewData', thisPageId);
			if (a.ready()) {
				var ownr = GeneratedProfiles.findOne({"_id": thisPageId}).ownerId;
				var b = Meteor.subscribe('userName', ownr);
				if (b.ready()) {
					return Meteor.users.findOne({"_id": ownr}).profile.fullName;
				};
			};
		},
		getUserDp: function() {
			var thisPageId = this.value;
			var a = Meteor.subscribe('pageViewData', thisPageId);
			if (a.ready()) {
				var ownr = GeneratedProfiles.findOne({"_id": thisPageId}).ownerId;
				var b = Meteor.subscribe('userProfileImage', ownr);
				if (b.ready()) {
					return SiteImages.findOne({"ownerId": ownr}).url();
				};
			};
		},
		bookmarkedPages: function() {
			if (Meteor.user()) {
				var a = Meteor.user().profile.bookmarkedPages;
				for (var i = 0; i < a.length; i++) {
					a[i] = {"value": a[i]};
				};
				return a;
			};
		}
	});


	Template.sendPage.events({
		'click .checkBox': function () {
			$(this).toggleClass('checked');
		},
		'click input[name="sendProfile"]': function() {
			var checkedOpts = [];
			$('input[name="link"]:checked').each(function() {
				var thisType = $(this).attr('value');
				var thisVal = Meteor.user().profile[thisType];
				checkedOpts.push({"fieldType": thisType,"fieldValue": thisVal});
			});
			var isBusinssChecked = $('input[name="link2"]').is(':checked');
			Meteor.call('generatePageUrl', {"fields": checkedOpts, "showBusinessCard": isBusinssChecked}, function(err, res) {
				if (err) {
					return alert(err.error);
				}
				else{
					Router.go('/view/'+ res);
				};
			});
		}
	});

	Template.viewProfilePage.helpers({
		currentPageInfo: function() {
			var a = Meteor.subscribe('pageViewData', this.thisPageId);
			if (a.ready()) {
				return GeneratedProfiles.findOne({"_id": this.thisPageId});
			};
		},
		currentUserProfile: function() {
			var a = Meteor.subscribe('userProfileDatas', this.thisPageId);
			if (a.ready()) {
				if(GeneratedProfiles.findOne({"_id": this.thisPageId})) {
					var idd = GeneratedProfiles.findOne({"_id": this.thisPageId}).ownerId
					return Meteor.users.findOne({"_id": idd});
				};
			};
		}
	});

 }