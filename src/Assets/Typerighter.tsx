import React from 'react';
import { useCurrentFrame } from 'remotion';
import GraphemeSplitter from 'grapheme-splitter';

const cursor = {
    height: 60,
    width: 3,
    display: 'inline-block',
    backgroundColor: 'black',
    marginLeft: 4,
    marginTop: -4,
};

const textCss = {
    fontFamily: 'SF Pro Text, Helvetica, Arial, sans-serif',
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    paddingRight: '200px',
    paddingLeft: '200px',
    marginTop: "600px",
    lineHeight: '100px',
    letterSpacing: '3px',
    color: 'white',
};

export const Typerighter = ({titleText}) => {
    const frame = useCurrentFrame();
    const text = titleText;

    // Initialize GraphemeSplitter
    const splitter = new GraphemeSplitter();

    // Split the text into grapheme clusters (better handling of emojis)
    const textArray = splitter.splitGraphemes(text);

    // A new character (grapheme cluster) every 3 frames
    const charsShown = Math.floor(frame * 3 / 5);
    const textToShow = textArray.slice(0, charsShown).join('');
    // Show the cursor while the text is typing, then start blinking
    const cursorShown =
        textToShow.length === textArray.length ? Math.floor(frame / 10) % 2 === 1 : true;

    return (
        <h1
            style={{
                ...textCss,
                fontFamily: 'sans-serif',
                fontSize: 60,
            }}
        >
            {textToShow}
            <span
                style={{
                    ...cursor,
                    verticalAlign: 'middle',
                    opacity: Number(cursorShown),
                }}
            />
        </h1>
    );
};