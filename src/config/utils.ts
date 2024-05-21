import { game_variables } from "./settings";

export const parse2D = (data: number[] = []) => {
	const rows = [];

	for (
		let i = 0;
		i < data.length;
		i += game_variables.GAME_WIDTH / game_variables.BLOCK_SIZE
	) {
		rows.push(
			data.slice(i, i + game_variables.GAME_WIDTH / game_variables.BLOCK_SIZE)
		);
	}

	return rows;
};


export const load_image = (src: string) => {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.src = src;
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error("Failed to load background image"));
	});
}