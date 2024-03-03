import {useMemo} from 'react'
import {random} from 'remotion'
import {staticFile} from 'remotion'
import {Composition} from 'remotion';
import { MyComposition, myCompSchema } from './Compositions/Composition';
import images from './Data/image-paths.json';
import videoPaths from './Data/video-paths.json'
import songs from './Data/song-urls.json';

const randomNumber = random(images[1])

export const RemotionRoot: React.FC = () => {
	const videoSource = useMemo(() => staticFile('videos/' + videoPaths.videos[Math.floor(randomNumber! * videoPaths.videos.length)])
	,[])
	const musicSource = useMemo(() => songs.music[Math.floor(randomNumber! * songs.music.length)]
	,[])


	return (
		<>
			<Composition
				id={`Which-Image-${images[1].substring(0, images[1].length - 4)}`}
				component={MyComposition}
				durationInFrames={481}
				fps={30}
				width={1080}
				height={1920}
				schema={myCompSchema}
				defaultProps={{
					videoSource,
					musicSource
				}}
			/>
		</>
	);
};