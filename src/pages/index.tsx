import { GetStaticProps } from 'next';
import Link from 'next/link';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import convertDurationToTimeString from '../utils/convertDurationToTimeString';
import Image from 'next/image';

import styles from './home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

type EpisodeTypeApi = {
	id: string;
	title: string;
	members: string;
	published_at: string;
	description: string;
	file: {
		duration: string | number;
		url: string;
	};
	thumbnail: string;
};

type EpisodeType = {
	id: string;
	title: string;
	members: string;
	publishedAt: string;
	description: string;
	durationString: string;
	duration: number;
	url: string;
	thumbnail: string;
};

interface HomeProps {
	episodes: Array<EpisodeType>;
	latestEpisodes: Array<EpisodeType>;
	allEpisodes: Array<EpisodeType>;
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
	const { play } = useContext(PlayerContext);
	return (
		<div className={styles.homepage}>
			<section className={styles.latestEpisodes}>
				<h2>Ultimos Lançamentos</h2>
				<ul>
					{latestEpisodes.map((ep) => {
						return (
							<li key={ep.id}>
								<Image
									width={192}
									height={192}
									src={ep.thumbnail}
									alt={ep.title}
									objectFit='cover'
								/>
								<div className={styles.episodeDetails}>
									<Link href={`episode/${ep.id}`}>
										<a>{ep.title}</a>
									</Link>
									<p>{ep.members}</p>
									<span>{ep.publishedAt}</span>
									<span>{ep.durationString}</span>
								</div>

								<button onClick={() => play(ep)} type='button'>
									<img src='images/play-green.svg' alt='Tocar Episódio' />
								</button>
							</li>
						);
					})}
				</ul>
			</section>
			<section className={styles.allEpisodes}>
				<h2>Todos episódios</h2>
				<table cellSpacing={0}>
					<thead>
						<th></th>
						<th>Podcast</th>
						<th>Integrantes</th>
						<th>Data</th>
						<th>Duração</th>
					</thead>
					<tbody>
						{allEpisodes.map((episode) => {
							return (
								<tr key={episode.id}>
									<td>
										<Image
											width={120}
											height={120}
											src={episode.thumbnail}
											alt={episode.title}
											objectFit='cover'
										/>
									</td>
									<td>
										<Link href={`episode/${episode.id}`}>
											<a>{episode.title}</a>
										</Link>
									</td>
									<td>{episode.members}</td>
									<td>{episode.publishedAt}</td>
									<td>{episode.durationString}</td>
									<td>
										<button type='button'>
											<img src='images/play-green.svg' alt='Tocar episódio' />
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</section>
		</div>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get('episodes', {
		params: {
			_limit: 12,
			_sort: 'published_at',
			_order: 'desc',
		},
	});

	const episodes = data.map((ep: EpisodeTypeApi) => {
		return {
			id: ep.id,
			title: ep.title,
			members: ep.members,
			publishdeAt: format(parseISO(ep.published_at), 'd MM yy', {
				locale: ptBR,
			}),
			duration: Number(ep.file.duration),
			durationAsString: convertDurationToTimeString(Number(ep.file.duration)),
			description: ep.description,
			url: ep.file.url,
			thumbnail: ep.thumbnail,
		};
	});

	const latestEpisodes = episodes.slice(0, 2);
	const allEpisodes = episodes.slice(2, episodes.lenght);

	return {
		props: {
			episodes,
			latestEpisodes,
			allEpisodes,
		},
		revalidate: 60 * 60 * 8,
	};
};
