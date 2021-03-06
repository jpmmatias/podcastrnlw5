import { useRouter } from 'next/router';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import styles from './episode.module.scss';
import Image from 'next/image';

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

interface EpisodeProps {
	episode: EpisodeType;
}
const Episode = ({ episode }: EpisodeProps) => {
	const { query, isFallback } = useRouter();

	if (isFallback) {
		return <p>Carregando</p>;
	}
	return (
		<div className={styles.episode}>
			<div className={styles.thumbnailContainer}>
				<button type='button'>
					<img src='images/arrow-left.svg' alt='Voltar' />
				</button>
				<Image
					width={700}
					height={160}
					src={episode.thumbnail}
					objectFit='cover'
				></Image>
				<button type='button'>
					<img src='images/play.svg' alt='Tocar episódio' />
				</button>
			</div>

			<header>
				<h1>{episode.title}</h1>
				<span>{episode.members}</span>
				<span>{episode.publishedAt}</span>
				<span>{episode.durationString}</span>
			</header>
			<div
				className={styles.description}
				dangerouslySetInnerHTML={{ __html: episode.description }}
			/>
		</div>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async (ctx) => {
	const { slug } = ctx.params;
	const { data } = await api.get(`episodes/${slug}`);

	const episode = {
		id: data.id,
		title: data.title,
		members: data.members,
		publishdeAt: format(parseISO(data.published_at), 'd MM yy', {
			locale: ptBR,
		}),
		duration: Number(data.file.duration),
		durationAsString: convertDurationToTimeString(Number(data.file.duration)),
		description: data.description,
		url: data.file.url,
		thumbnail: data.thumbnail,
	};

	return {
		props: {
			episode,
		},
		revalidate: 60 * 60 * 8,
	};
};

export default Episode;
