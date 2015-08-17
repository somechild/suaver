var Schemas = {};
Schemas.GeneratedProfiles = new SimpleSchema({
	createdAt: {
        type: Date,
        optional: false
    },
    ownerId: {
    	type: String,
    	optional: false
    },
    sharedFields: {
    	type: [Object],
    	optional: true
    },
    "sharedFields.$.fieldType": {
    	type: String,
    	optional: true
    },
    "sharedFields.$.fieldValue": {
    	type: String,
    	optional: true
    },
    showBusinessCard: {
    	type: Boolean,
    	optional: true
    }
});


GeneratedProfiles = new Meteor.Collection("generatedprofiles");
GeneratedProfiles.attachSchema(Schemas.GeneratedProfiles);







GeneratedProfiles.allow({
        insert: function(userId, doc) {
            if (!userId) {
                throw new Meteor.Error(403, 'Unauthorized Access.')
                return false;
            };
        },
        update: function(userId, doc, fieldNames, modifier) {
            if (!userId) {
                throw new Meteor.Error(403, 'Unauthorized Access.')
                return false;
            };
        },
        remove: function(userId, doc) {
            if (!userId) {
                throw new Meteor.Error(403, 'Unauthorized Access.')
                return false;
            };
        }
    });