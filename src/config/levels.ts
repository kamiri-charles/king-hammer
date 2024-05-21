import { level_1_collision_blocks } from "../data/levels/1/level_1";

interface LevelData {
	collision_blocks: number[];
	player_position: { x: number; y: number };
}

interface Levels {
	[level_number: number]: LevelData;
}

export const levels: Levels = {
	1: {
		collision_blocks: level_1_collision_blocks,
		player_position: { x: 100, y: 200 },
	},
	// Will create other levels
};