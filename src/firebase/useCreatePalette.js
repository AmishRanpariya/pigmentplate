// import { useEffect, useState } from "react";
// import { db } from "./config";

// const useCreatePalette = (palette) => {
// 	const [Palette] = useState(palette);
// 	const [isPending, setIsPending] = useState(true);
// 	const [error, setError] = useState(null);

// 	useEffect(() => {
// 		const unsub = db
// 			.collection("palettes")
// 			.doc(Palette.id)
// 			.set(Palette)
// 			.then(() => {
// 				console.log("palette added");
// 				setError(null);
// 				setIsPending(false);
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 				setError(err.message);
// 				setIsPending(false);
// 			});
// 		return () => unsub();
// 	}, [palette]);
// 	return { Palette, isPending, error };
// };

// export default useCreatePalette;
