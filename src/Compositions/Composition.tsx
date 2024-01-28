import {z} from 'zod'
import { useCurrentFrame} from 'remotion'
import {interpolate} from 'remotion'
import {Audio} from 'remotion'
import {Img, Sequence} from 'remotion'
import { AbsoluteFill, Video, staticFile} from "remotion";
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
        <Audio loop volume={.2} playbackRate={1.1} src={musicSource} placeholder={undefined} />
        <Sequence durationInFrames={100}>
            <Video muted src={videoSource} style={{right: '-900px',  height:"100%", position: 'absolute'}} endAt={100}/>
            <Title titleText="Which apartment would you choose? 🤔" titleColor="white" placement={450} fontSize={130}/>
        </Sequence> 
        <Sequence from={100} durationInFrames={101}>
            <Img placeholder='' src={staticFile(`images/${images[1]}`)} style={{right: interpolate(useCurrentFrame(), [150,250], [-300, -360]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="1" titleColor="white" placement={650} fontSize={200}/>
        </Sequence>
        <Sequence from={200} durationInFrames={101}>
            <Img placeholder='' src={staticFile(`images/${images[2]}`)} style={{right: interpolate(useCurrentFrame(), [250,350], [-420, -470]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="2" titleColor="white" placement={650}fontSize={200}/>
        </Sequence>
        <Sequence from={300} durationInFrames={101}>
            <Img placeholder='' src={staticFile(`images/${images[3]}`)}style={{right: interpolate(useCurrentFrame(), [350,450], [-460, -400]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="3" titleColor="white" placement={650}fontSize={200}/>
        </Sequence>
        <Sequence from={400} durationInFrames={101}>
            <Img placeholder='' src={staticFile(`images/${images[4]}`)}style={{right: interpolate(useCurrentFrame(), [450,550], [-410, -460]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="4" titleColor="white" placement={650}fontSize={200}/>
        </Sequence>
        <Sequence from={500} durationInFrames={101}>
            <Img placeholder='' src={staticFile(`images/${images[5]}`)}style={{right: interpolate(useCurrentFrame(), [550,650], [-470, -440]),  height:"100%", position: 'absolute'}}/>
            <Title titleText="5" titleColor="white" placement={650}fontSize={200}/>
        </Sequence>
        <Sequence from={595}>
            <Video muted src={videoSource} style={{right: '-900px',  height:"100%", position: 'absolute'}}/>
            <Title titleText="Like and share which one was your favorite!!!" titleColor="white" placement={350} fontSize={150}/>
        </Sequence>
    </AbsoluteFill>
  );
};