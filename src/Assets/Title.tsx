import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import { loadFont } from "@remotion/google-fonts/Jua";

const { fontFamily } = loadFont();

const title: React.CSSProperties = {
	fontWeight: 'bold',
	textAlign: 'center',
	position: 'absolute',
	marginLeft: "46%",
	lineHeight: '100px',
};

const word: React.CSSProperties = {
	marginRight: 3,
	display: 'inline-block',
};

export const Title: React.FC<{
	titleText: string;
	titleColor: string;
	placementVertical: number;
	placementHorizontal?: number;
	backgroundColor?: string;
	fontSize?: number;
}> = ({titleText, titleColor, placementVertical, placementHorizontal = 0, fontSize = 100, backgroundColor = "black"}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

	const words = titleText.split(' ');

	return (
		<h1 style={{...title, top: placementVertical, left: placementHorizontal, fontSize, fontFamily: fontFamily}}>
			{words.map((t, i) => {
				const delay = i * 5

				const scale = spring({
					fps: videoConfig.fps,
					frame: frame - delay,
					config: {
						damping: 150,
					},
				});

				return (
					<span
						key={t}
						style={{
							...word,
							color: titleColor,
							transform: `scale(${scale})`,
							backgroundColor, paddingLeft: "25px", paddingRight: "25px", paddingTop:"20px", paddingBottom: "20px", borderRadius: "20px"
						}}
					>
						{t}
					</span>
				);
			})}
		</h1>
	);
};
