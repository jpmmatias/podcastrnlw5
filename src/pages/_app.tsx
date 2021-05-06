import { Header } from '../components/Header';
import { Player } from '../components/Player';
import '../styles/global.scss';
import { PlayerContext } from '../context/PlayerContext';
import styles from '../styles/app.module.scss';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisode, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsplaying] = useState<boolean>(false);

	function togglePlay() {
		setIsplaying(!isPlaying);
	}

	function setPlayState(state: boolean) {
		setIsplaying(state);
	}
	function play(episode: any) {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
		setIsplaying(true);
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisode,
				play,
				isPlaying,
				togglePlay,
				setPlayState,
			}}
		>
			<div className={styles.wrapper}>
				<main>
					<Header />
					<Component {...pageProps} />
				</main>
				<Player />
			</div>
		</PlayerContext.Provider>
	);
}

export default MyApp;
