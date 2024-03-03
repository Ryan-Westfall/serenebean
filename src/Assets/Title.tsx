import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_FAMILY} from './constants';

const title: React.CSSProperties = {
	fontFamily: FONT_FAMILY,
	fontWeight: 'bold',
	textAlign: 'center',
	position: 'absolute',
	width: '100%',
	stroke: 'black',
	WebkitTextStroke: '7px black',
	paddingRight: '100px',
	paddingLeft: '100px',
	lineHeight: '180px',
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
		<h1 style={{...title, top: placement, fontSize}}>
			{words.map((t, i) => {
				const delay = i * 3;

				const scale = spring({
					fps: videoConfig.fps,
					frame: frame - delay,
					config: {
						damping: 200,
					},
				});

				return (
					<span
						key={t}
						style={{
							...word,
							color: titleColor,
							transform: `scale(${scale})`,
						}}
					>
						{t}
					</span>
				);
			})}
		</h1>
	);
};
