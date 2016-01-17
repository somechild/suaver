if (Meteor.isClient) {
	var imageStore = new FS.Store.S3("siteimages");
	SiteImages = new FS.Collection("siteimages", {
		stores: [imageStore],
		filter: {
			maxSize: 5000000,
			allow: {
				contentTypes: ['image/*']
			}
		}
	});
};