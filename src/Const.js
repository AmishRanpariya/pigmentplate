export const PALETTE_COLLECTION = {
	collection_name: "palettes",
	timeField: "createdAt",
	likeCount: "likeCount",
	id: "id",
};

export const PAGINATE = {
	initialFetchCount: 30,
	subSequentFetchCount: 10,
};

export const USER_COLLECTION = {
	collection_name: "users",
	timeField: "createdAt",
};

export const DEFAULT_PALETTE = {
	id: "555555777777aaaaaacccccc",
	colors: ["555555", "777777", "aaaaaa", "cccccc"],
	likeCount: 0,
	createdAt: 0,
	createdBy: "",
	likedBy: [],
	interactionCount: 0,
};

export const LOCALSTORAGE = {
	// prefix_liked: "PigmentPlateLiked/",
	// prefix_created: "PigmentPlateCreated/",
	// prefix_userId: "PigmentPlateUID",
	prefix_interaction: "PigmentPlateIC",

	prefix_cached_user: "PigmentPlateUser",

	prefix_cached_palettes: "PigmentPlateCache",
	prefix_cached_palettes_date: "PigmentPlateCacheDate",
	prefix_cached_lastDoc: "PigmentPlateCachedLastDoc", //for firestore cursor in pagination
};

//in ms
// const oneDay = 86400000;
// const hours12 = 12 * 60 * 60 * 1000;
// const hours6 = 6 * 60 * 60 * 1000;
const hours1 = 60 * 60 * 1000;
// const hoursHalf = 30 * 60 * 1000;
// const minutes10 = 10 * 60 * 1000;
// const minutes5 = 5 * 60 * 1000;
// const minutes1 = 60 * 1000;

export const CACHE = {
	maxCacheTime: hours1, // time after cache will be renewed again
};

export const BASEURL = "pigmentplate.web.app"; //for download palette
