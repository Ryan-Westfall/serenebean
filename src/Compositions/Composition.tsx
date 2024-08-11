import {Audio} from 'remotion'
import {z} from 'zod'
import { OffthreadVideo, useCurrentFrame} from 'remotion'
import {interpolate} from 'remotion'
import {Img, Sequence} from 'remotion'
import { AbsoluteFill, staticFile} from "remotion";
import { Title } from "../Assets/Title";
import images from '../Data/image-paths.json';
import imagine from '../../imagine.json';

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
        fontSize: 30,
        backgroundColor: "black",
      }}
    >
        <Audio loop volume={.1} src={musicSource} placeholder={undefined} />
        <Sequence durationInFrames={101}>
            <OffthreadVideo muted src={videoSource} endAt={100} style={{opacity: '50%'}}/>
            <Title titleText={imagine.videoTitle} titleColor="white" placementVertical={400} placementHorizontal={-500} fontSize={90} backgroundColor='none'/>

        </Sequence> 
        <Sequence from={101} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[1]}`)} style={{right: interpolate(useCurrentFrame(), [101,181], [-150, -200]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="1" titleColor="white" placementVertical={100} fontSize={100}/>
        </Sequence>
        <Sequence from={180} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[2]}`)} style={{right: interpolate(useCurrentFrame(), [181,261], [-100, -60]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="2" titleColor="white" placementVertical={100}fontSize={100}/>
        </Sequence>
        <Sequence from={260} durationInFrames={81}> 
            <Img placeholder='' src={staticFile(`images/${images[3]}`)}style={{right: interpolate(useCurrentFrame(), [261,341], [-140, -180]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="3" titleColor="white" placementVertical={100}fontSize={100}/>
        </Sequence>
        <Sequence from={340} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[4]}`)}style={{right: interpolate(useCurrentFrame(), [341,421], [-200, -160]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="4" titleColor="white" placementVertical={100}fontSize={100}/>
        </Sequence>
        <Sequence from={420} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[5]}`)}style={{right: interpolate(useCurrentFrame(), [421,501], [-130, -170]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="5" titleColor="white" placementVertical={100}fontSize={100}/>
        </Sequence>
        <Sequence from={500} durationInFrames={81}>
            <Img placeholder='' src={staticFile(`images/${images[6]}`)}style={{right: interpolate(useCurrentFrame(), [501,581], [-190, -150]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="6" titleColor="white" placementVertical={100}fontSize={100}/>
        </Sequence>
    </AbsoluteFill>
  );
};