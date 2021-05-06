import { PlayerContext } from '../../context/PlayerContext';
import { useContext, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export function Player() {
	const {
		episodeList,
		currentEpisode,
		isPlaying,
		togglePlay,
		setPlayState,
	} = useContext(PlayerContext);

	const episode = episodeList[currentEpisode];

	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (!audioRef.current) {
			return;
		}
		if (!isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
	}, [isPlaying]);

	return (
		<div className={styles.playerContainer}>
			<header>
				<img src='images/playing.svg' alt='Tocando Agora' />
				<strong>Tocando agora {episode?.title}</strong>
			</header>

			{episode ? (
				<div className={styles.currentEpisode}>
					<Image
						objectFit='cover'
						width={592}
						height={592}
						src={episode.thumbnail}
					/>
					<strong>{episode.title}</strong>
					<span>{episode.members}</span>
				</div>
			) : (
				<div className={styles.empty}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
			)}

			<footer className={!episode ? styles.emptyFooter : ''}>
				<div className={styles.progress}>
					<span>00:00</span>
					<div className={styles.slider}>
						{episode ? (
							<Slider
								trackStyle={{ background: '#84d361' }}
								railStyle={{ backgroundColor: '#9f75ff' }}
								handleStyle={{ borderWidth: 4, borderColor: '#84d361' }}
							/>
						) : (
							<div className={styles.emptyslider}></div>
						)}
					</div>
					<span>00:00</span>
				</div>
				{episode && (
					<audio
						onPlay={() => setPlayState(true)}
						onPause={() => setPlayState(false)}
						ref={audioRef}
						src={episode.url}
						autoPlay
					/>
				)}
				<div className={styles.buttons}>
					<button type='button' disabled={!episode}>
						<img src='images/shuffle.svg' alt='Embaralhar' />
					</button>
					<button type='button' disabled={!episode}>
						<img src='images/play-previous.svg' alt='Tocar Anterior' />
					</button>
					<button
						onClick={() => togglePlay()}
						type='button'
						disabled={!episode}
						className={styles.playbtn}
					>
						{isPlaying ? (
							<img src='images/pause.svg' alt='Tocar' />
						) : (
							<img src='images/play.svg' alt='Tocar' />
						)}
					</button>
					<button type='button' disabled={!episode}>
						<img src='images/play-next.svg' alt='Tocar Próxima' />
					</button>
					<button type='button' disabled={!episode}>
						<img src='images/repeat.svg' alt='Repetir' />
					</button>
				</div>
			</footer>
		</div>
	);
}
