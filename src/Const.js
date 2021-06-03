export const DATABASE_ENDPOINT = "http://localhost:3002/";

export const PALETTE_COLLECTION = {
	collection_name: "palettes",
	// collection_name: "test_palettes",
	timeField: "createdAt",
};

export const PAGINATE = {
	initialFetchCount: 40,
	subSequentFetchCount: 10,
};

export const USER_COLLECTION = {
	collection_name: "users",
	// collection_name: "test_users",
	timeField: "createdAt",
};

export const DEFAULT_PALETTE = {
	id: "333333777777aaaaaacccccc",
	colors: ["333333", "777777", "aaaaaa", "cccccc"],
	likeCount: 0,
	createdAt: "",
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

export const BASEURL = "www.pigmentplate.io";
