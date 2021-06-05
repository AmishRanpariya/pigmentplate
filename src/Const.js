export const DATABASE_ENDPOINT = "http://localhost:3002/";

export const PALETTE_COLLECTION = {
	collection_name: "palettes",
	// collection_name: "test_palettes",
	timeField: "createdAt",
};

export const PAGINATE = {
	initialFetchCount: 15,
	subSequentFetchCount: 10,
};

export const USER_COLLECTION = {
	collection_name: "users",
	// collection_name: "test_users",
	timeField: "createdAt",
};

export const DEFAULT_PALETTE = {
	id: "555555777777aaaaaacccccc",
	colors: ["555555", "777777", "aaaaaa", "cccccc"],
	likeCount: 0,
	createdAt: 1622565372548,
	createdBy: "",
	likedBy: [],
	interactionCount: 0,
};

export const LOCALSTORAGE = {
	prefix_liked: "PigmentPlateLiked/",
	prefix_created: "PigmentPlateCreated/",
	prefix_userId: "PigmentPlateUID",
	prefix_interaction: "PigmentPlate/interactionCount",
};

export const BASEURL = "pigmentplate.io";
