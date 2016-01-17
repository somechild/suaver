Meteor.startup(function () {
  Router.configure({
    notFoundTemplate: 'fourofour',
    loadingTemplate: 'loadingPage',
    trackPageView: true
  });
  Router.map(function() {
  	this.route("signup", {
  		path: "/",
      onBeforeAction: function(){
        if (Meteor.user()) {
          Router.go('/p');
          return false;
        };
        this.next();
      },
      onAfterAction: function(){
        if (Meteor.isClient) {
          SEO.set({
            title: 'Sign Up | Suaver',
            meta: {
              'description': '',
              'keywords': ''
            }
          });
        };

      },
  		template: "signupPage"
  	}),
    this.route("login", {
      path: "/login",
       onBeforeAction: function(){
          if (Meteor.user()) {
            Router.go('/p');
          }else{
            this.next();
          };
       },
      onAfterAction: function(){
        if (Meteor.isClient) {
          SEO.set({
            title: 'Login | Suaver'
          });
        };

      },
      template: "loginPage"
    }),
    this.route("profile-settings", {
      path: "/p",
       onBeforeAction: function(){
          if (!Meteor.user()) {
            Router.go('/');
          }else{
            this.next();
          };
       },
      onAfterAction: function(){
        if (Meteor.isClient) {
          SEO.set({
            title: 'Profile Settings | Suaver'
          });
        };

      },
      template: "profileSetttings"
    }),
     this.route("pebblelogin", {
      path: "/pebblelogin",
       onBeforeAction: function(){
          if (Meteor.user()) {
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
          }else{
            this.next();
          };
       },
      onAfterAction: function(){
        if (Meteor.isClient) {
          SEO.set({
            title: 'Pebble Login | Suaver'
          });
        };

      },
      template: "loginPage"
    }),
     this.route("profileViewPage", {
      path: "/view/:pageId",
      waitOn: function() {
        return [Meteor.subscribe('userProfileDatas', this.params.pageId), Meteor.subscribe('pageViewData', this.params.pageId)];
      },
      onBeforeAction: function(){
        this.next();
      },
      onAfterAction: function(){
        if (Meteor.isClient) {
          if (GeneratedProfiles.findOne({"_id": this.params.pageId})) {
             var thisUserId = GeneratedProfiles.findOne({"_id": this.params.pageId}).ownerId;
              var userName = Meteor.users.findOne({"_id": thisUserId}).profile.fullName;
          };
          if (userName) {
            SEO.set({
              title: userName + ' | Suaver'
            });
          }
          else{
            SEO.set({
              title: 'Suaver'
            });
          };
        }
      },
        data: function() {
         return ({"thisPageId": this.params.pageId});
        },
      template: "viewProfilePage"
    }),
     this.route("sendProfile", {
      path: "/send",
       onBeforeAction: function(){
        if (!Meteor.user()) {
          Router.go('/');
        }else{
          if (!Meteor.user().emails[0].verified) {
            alert("Verify your email to do that");
            Router.go('/');
          }
          else{
            this.next();
          };
          
        };
        this.next();
       },
      onAfterAction: function(){
        if (Meteor.isClient) {
            SEO.set({
              title: 'Send your profile | Suaver'
            });
        };

      },
      template: "sendPage"
    })
  });

  if(Meteor.isClient){
    return SEO.config({
      title: 'Suaver'
    });
  }
});