import { level_1_collision_blocks, level_1_objects_data } from "../data/levels/1/level_1";

interface LevelData {
	collision_blocks: number[];
	objects_data: {type: string, x: number, y: number, height: number}[];
	player_position: { x: number; y: number };
}

interface Levels {
	[level_number: number]: LevelData;
}

export const levels: Levels = {
	1: {
		collision_blocks: level_1_collision_blocks,
		objects_data: level_1_objects_data,
		player_position: { x: 200, y: 400 },
	},
	// Will create other levels
};