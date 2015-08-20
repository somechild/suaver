/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
//var Vector2 = require('vector2');
// preferences decl
var signedIn = true;
var user = 'User';
var pass = '';
var data = [ 'facebook id here', 'twitter id here', 'linkedin id here',
  'instagram id here', 'tumblr id here', 'snapchat id here'];
/*var fb = '';
var twt = '';
var lnkIn = '';
var ig = '';
var tblr = '';
var snpcht = '';*/



Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
  Pebble.openURL('http://54.149.139.194/pebblelogin');
});
Pebble.addEventListener('webviewclosed', function(e) {
  // Decode and parse config data as JSON
  var config_data = JSON.parse(decodeURIComponent(e.response));
  console.log('Config window returned: ', JSON.stringify(config_data));
 /* var success = config_data['signedIn'];
  console.log('sucess var loaded', JSON.stringify(success));
  if (JSON.stringify(success) == 'true' || JSON.stringify(success) == ' true') {signedIn = true;}
  else {signedIn = false;
       console.log('not signed in if block ');}*/
  if (true) {
         console.log('signed in if block ');
    user = config_data['email'];
    pass = config_data['password'];
    localStorage.setItem(0, config_data['facebook']);
    console.log('----- item in local (remote call return) store ----', JSON.stringify(localStorage.getItem(0)));
    localStorage.setItem(1, config_data['twitter']);
    localStorage.setItem(2, config_data['linkedin']);
    localStorage.setItem(3, config_data['instagram']);
    localStorage.setItem(4, config_data['tumblr']);
    localStorage.setItem(5, config_data['snapchat']);
  }

    // Send settings to Pebble watchapp
    Pebble.sendAppMessage({}, function(){
      console.log('Sent config data to Pebble');  
      }, function() {
      console.log('Failed to send config data!');
    });
  
 /* // Prepare AppMessage payload
  var dict = {
    'KEY_ANIMATIONS': config_data[animSetting],
    'KEY_TICK': config_data[tickSetting],
    'KEY_BACKGROUND_COLOR': config_data[bgColor]
  };

  // Send settings to Pebble watchapp
  Pebble.sendAppMessage(dict, function(){
    console.log('Sent config data to Pebble');  
  }, function() {
    console.log('Failed to send config data!');
  });*/
});
if (!signedIn) {
  var main1 = new UI.Card({
    title: 'Suaver',
    icon: 'logo',
    subtitle: 'Sign In',
    body: 'Please sign in through app config.'
  });
  main1.show();
}

if(signedIn) {
  var shareItems = [{
    title: 'Share Facebook',
    //icon: 'images/menu_icon.png',
    subtitle: 'Tap to share Facebook profile',
    id: 0
  }, {
    title: 'Share Twitter',
    subtitle: 'Tap to share Twitter profile',
    id: 1
  }, {
    title: 'Share LinkedIn',
    subtitle: 'Tap to share LinkedIn profile',
    id: 2
  }, {
    title: 'Share Instagram',
    subtitle: 'Tap to share Instagram profile',
    id: 3
  }, {
    title: 'Share Tumblr',
    subtitle: 'Tap to share Tumblr profile',
    id: 4
  }, {
    title: 'Share Snapchat',
    subtitle: 'Tap to share Snapchat profile',
    id: 5
  }];
  var menu = new UI.Menu({
      sections: [{
        items: shareItems
      }],
    backgroundColor: 'orange',
    highlightColor: 'yellow',
    textColor: 'white',
    highlightTextColor: 'white'
  });
  var main = new UI.Card({
    title: 'Suaver',
    icon: 'logo',
    subtitle: 'Welcome ' + user,
    body: 'Press up button to go to menu.' 
  });
  main.show();
  /*main.on('click', 'select', function(e) {
    var wind = new UI.Window({
      fullscreen: true,
    });
    var textfield = new UI.Text({
      position: new Vector2(0, 65),
      size: new Vector2(144, 30),
      font: 'gothic-24-bold',
      text: 'Text Anywhere!',
      textAlign: 'center'
    });
    wind.add(textfield);
    wind.show();
  });

  main.on('click', 'down', function(e) {
    var card = new UI.Card();
    card.title('A Card');
    card.subtitle('Is a Window');
    card.body('The simplest window type in Pebble.js.');
    card.show();
  });*/

  main.on('click', 'up', function(e) {
    menu.show();
    menu.on('select', function(e) {
      var detailCard = new UI.Card({
        title: shareItems[e.itemIndex].title,
        body: data[shareItems[e.itemIndex].id],
        style: "small"
      });
      detailCard.show();
    });  
  });
}

Pebble.addEventListener("appmessage", function(e) {
 //if (signedIn) {main.show(); }
 // console.log('data returned##### ', JSON.stringify(e.payload));
  signedIn = true;
  data[0] = localStorage.getItem(0);
  
    data[1] = localStorage.getItem(1);
    data[2] = localStorage.getItem(2);
    data[3] = localStorage.getItem(3);
    data[4] = localStorage.getItem(4);
    data[5] = localStorage.getItem(5);
  console.log('----- item in local store ----', JSON.stringify(localStorage.getItem(0)));
});