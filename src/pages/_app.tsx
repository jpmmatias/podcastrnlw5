import { Header } from '../components/Header';
import { Player } from '../components/Player';
import '../styles/global.scss';
import { PlayerContext } from '../context/PlayerContext';
import styles from '../styles/app.module.scss';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisode, setCurrentEpisodeIndex] = useState(0);

	function play(episode) {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
	}

	return (
		<PlayerContext.Provider value={{ episodeList, currentEpisode, play }}>
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
