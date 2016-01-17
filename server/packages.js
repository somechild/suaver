if (Meteor.isServer) {
	Meteor.startup(function () {
		Future = Meteor.npmRequire("fibers/future");
		Crypto = Meteor.npmRequire('cryptojs');
	});
};