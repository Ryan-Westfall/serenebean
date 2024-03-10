import {z} from 'zod'
import { OffthreadVideo, useCurrentFrame} from 'remotion'
import {interpolate} from 'remotion'
import {Audio} from 'remotion'
import {Img, Sequence} from 'remotion'
import { AbsoluteFill, staticFile} from "remotion";
import { Title } from "../Assets/Title";
import images from '../Data/image-paths.json';


export const myCompSchema = z.object({
	videoSource: z.string(),
	musicSource: z.string(),
});

export const MyComposition: React.FunctionComponent<z.infer<typeof myCompSchema>> = ({videoSource, musicSource}) => {

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontSize: 60,
        backgroundColor: "red",
      }}
    >
        {/* <Audio loop volume={.2} src={musicSource} placeholder={undefined} /> */}
        <Sequence durationInFrames={80}>
            <OffthreadVideo muted src={videoSource} endAt={100}/>
            <Title titleText="which cute animal would you choose?" titleColor="white" placement={450} fontSize={80}/>
            <Title titleText="🐣🐻‍❄️🐙🐨" titleColor="white" placement={670} fontSize={80}/>
        </Sequence> 
        <Sequence from={80} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[1]}`)} style={{right: interpolate(useCurrentFrame(), [150,250], [-300, -360]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="1" titleColor="white" placement={100} fontSize={100}/>
        </Sequence>
        <Sequence from={160} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[2]}`)} style={{right: interpolate(useCurrentFrame(), [250,350], [-470, -500]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="2" titleColor="white" placement={100}fontSize={100}/>
        </Sequence>
        <Sequence from={240} durationInFrames={81}> 
            <Img placeholder='' src={staticFile(`images/${images[3]}`)}style={{right: interpolate(useCurrentFrame(), [350,450], [-460, -400]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="3" titleColor="white" placement={100}fontSize={100}/>
        </Sequence>
        <Sequence from={320} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[4]}`)}style={{right: interpolate(useCurrentFrame(), [450,550], [-410, -460]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="4" titleColor="white" placement={100}fontSize={100}/>
        </Sequence>
        <Sequence from={400} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[5]}`)}style={{right: interpolate(useCurrentFrame(), [550,650], [-470, -440]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="5" titleColor="white" placement={100}fontSize={100}/>
        </Sequence>
        <Sequence from={480} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[6]}`)}style={{right: interpolate(useCurrentFrame(), [550,650], [-470, -440]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="6" titleColor="white" placement={100}fontSize={100}/>
        </Sequence>
    </AbsoluteFill>
  );
};