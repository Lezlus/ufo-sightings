"use client";
import { useEffect, useState, ViewTransition } from "react"; 
import Image from "next/image";
import Link from "next/link";
import { Badge, Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";
import { getUfoCards } from '../actions/ufo-card-actions';
import type { UfoCardTypeArray } from "@/types";

interface RecordingCardProps {
  imageURL: string;
  audioURL: string;
  title: string;
  description: string;
  id: number;
}

interface AudioRecording {
  imageURL: string;
  audioURL: string;
}

type AudioRecordingData = AudioRecording[];

const RecordingCard = (props: RecordingCardProps) => {
  const { imageURL, audioURL, title, description, id } = props;

  return (
    <Link transitionTypes={["nav-foward"]} href={`audio-recordings/${id}`}>
      <ViewTransition default={'none'} share={"morph"} name={`recording-${id}`}>
        <Box
          // as={'button'}
          textAlign={'left'}
          position="relative"
          bg='#e2dcc8'
          p={4}
          boxShadow={'md'}
          transition={'all 0.3s'}
          rotate={1231252 % 2 === 0 ? "1deg" : "-1.5deg"}
          _hover={{
            transform: "translateY(-5px) scale(1.02)",
            boxShadow: 'xl',
            zIndex: 10,
            rotate: '0deg'
          }}
          maxW={"300px"}
          border={"1px solid rgba(0, 0, 0, 0.1)"}
          overflow="hidden"
          // _before={{
          //   content: '""',
          //   position: "absolute",
          //   inset: 0,
          //   zIndex: 2,
          //   background: "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)",
          //   pointerEvents: "none",
          // }}
        >
          <Badge
            zIndex={'10'}
            position={'absolute'}
            top={'1'}
            right={'2'}
            colorScheme={'red'}
            variant={'solid'}
            fontFamily={'mono'}
          >
            {1.32} REEL
          </Badge>
          <Flex direction={'column'} gap={3} align={'start'}>
            <Box
              overflow={'hidden'}
              bg={'black'}
              w={'full'}
              aspectRatio={4/3}
              position={'relative'}
            >
              <ChakraImage
                src={imageURL} 
                alt='Evidence'
                filter={'sepia(0.4) contrast(1.2) brightness(0.3)'} 
                _hover={{ filter: 'none' }}
                transition={'filter 0.5s'}
              />
              <Box
                position={'absolute'}
                inset={0}
                background={"linear-gradient(to bottom, transparent, 50%, rgba(0, 0, 0, 0.1) 50%"}
                backgroundSize={'100% 4px'}
                pointerEvents={'none'}
              />
            </Box>
            <Flex direction={'column'} align={'start'} gap={0} w='full'>
              <Text
                fontFamily={'mono'}
                fontWeight={'bold'}
                fontSize={'xs'}
                color={'gray.600'}
                textTransform={'uppercase'}
              >
                File ID: {`${id}`.slice(0, 4)}
              </Text>
              <Text
                fontFamily="'Courier New', Courier, monospace"
                fontSize={'sm'}
                color={'blackAlpha.800'}
                lineHeight={'shorter'}
              >
                {description}
              </Text>
            </Flex>
            <Flex cursor={'pointer'} w={'full'} justify={'center'} pt={2}>
              <Text fontSize={'10px'} fontFamily={'mono'} color={'red.700'} fontWeight={'bold'}>
                [ CLICK TO INITALIZE PLAYBACK ]
              </Text>
            </Flex>
          </Flex>
        </Box>
      </ViewTransition>
    </Link>
  )
}

export default function AudioRecording() {
  const awsCdn = process.env.NEXT_PUBLIC_AWS_CDN_URL;

  const [audioRecordingData, setAudioRecordingData] = useState<UfoCardTypeArray>([]);

  useEffect(() => {
    const initalizeAudioRecordingData = async () => {
      const data =  await getUfoCards();
      setAudioRecordingData(data);
    }
    initalizeAudioRecordingData();
  }, [])
  console.log(awsCdn);
  return (
    <Grid justifyContent={'center'} templateColumns={'repeat(3, 1fr)'} gap={3}>
      {audioRecordingData.map(recording => (
        <ViewTransition key={recording.id}>
          <RecordingCard 
            imageURL={`https://${awsCdn}${recording.image_url}`} 
            audioURL={`https://${awsCdn}${recording.audio_url}`}
            {...recording}
          />
        </ViewTransition>
      ))}
    </Grid>
  )
} 