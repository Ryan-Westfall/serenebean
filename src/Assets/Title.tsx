import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const title: React.CSSProperties = {
	fontFamily: 'SF Pro Text, Helvetica, Arial, sans-serif',
	fontWeight: 'bold',
	textAlign: 'center',
	position: 'absolute',
	marginLeft: "46%",
	lineHeight: '100px',
	letterSpacing: '3px'
};

const word: React.CSSProperties = {
	marginLeft: 10,
	marginRight: 10,
	display: 'inline-block',
};

export const Title: React.FC<{
	titleText: string;
	titleColor: string;
	placement: number;
	fontSize?: number;
}> = ({titleText, titleColor, placement, fontSize = 100}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

	const words = titleText.split(' ');

	return (
		<h1 style={{...title, top: placement, fontSize, fontFamily: "avenir, monospace"}}>
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
							backgroundColor: "#d6b7a3", paddingLeft: "25px", paddingRight: "25px", paddingTop:"20px", paddingBottom: "20px", borderRadius: "20px"
						}}
					>
						{t}
					</span>
				);
			})}
		</h1>
	);
};
