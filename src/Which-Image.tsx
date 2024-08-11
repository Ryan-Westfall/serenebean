import {useMemo} from 'react'
import {random} from 'remotion'
import {staticFile} from 'remotion'
import {Composition} from 'remotion';
import { MyComposition, myCompSchema } from './Compositions/Composition';
import images from './Data/image-paths.json';
import videoPaths from './Data/video-paths.json'
import musicPaths from './Data/music-paths.json';

const randomNumber = random(images[1])

export const RemotionRoot: React.FC = () => {
	const videoSource = useMemo(() => staticFile('videos/' + videoPaths.videos[Math.floor(randomNumber! * videoPaths.videos.length)])
	,[])
	const musicSource = useMemo(() => staticFile('music/' + musicPaths.music[Math.floor(randomNumber! * musicPaths.music.length)])
	,[])


	return (
		<>
			<Composition
				id="WhichImage"
				component={MyComposition}
				durationInFrames={561}
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