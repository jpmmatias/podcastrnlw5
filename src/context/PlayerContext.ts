import { createContext } from 'react';

type Episode = {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
};

type PlayerContextData = {
	episodeList: Episode[];
	currentEpisode: number;
	play: (episode: Episode) => void;
	isPlaying: boolean;
	togglePlay: () => void;
	setPlayState: (state: boolean) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);
