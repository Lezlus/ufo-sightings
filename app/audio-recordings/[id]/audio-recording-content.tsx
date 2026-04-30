"use client"

import React, { useEffect, useId, useMemo, useRef, useState, ViewTransition, Suspense } from "react";
import type { UfoCardType, UfoCardTypeArray } from "@/types";
import { getUfoCard, getAudioCaptions, getUfoCards } from "@/app/actions/ufo-card-actions";
import { Flex, Badge, Box, Text } from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";
import { LuPlay, LuPause } from "react-icons/lu";
import RecordingCardSkeleton from '../AudioRecordingContentSkeleton';
import AudioRecordingContentArrow from "./audio-recording-content-arrow";

interface AudioRecordingContentProps {
  id: string
}

const str_pad_left = (str: number, pad: string, length: number) => {
  return (new Array(length + 1).join(pad) + str).slice(-length);
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds - mins * 60;
  const finalTime = str_pad_left(mins, '0', 2) + ':' + str_pad_left(secs, "0", 2);

  return finalTime;
};

export function AudioRecordingContent({ id }: { id: string }) {
  const awsCdn = process.env.NEXT_PUBLIC_AWS_CDN_URL;
  const [recordingData, setRecordingData] = useState<UfoCardType>();
  const [captions, setCaptions] = useState<string | undefined>();
  const [isLoadingCaptions, setIsLoadingCaptions] = useState(false);
  const [rotate, setRotate] = useState({x: 0, y: 0});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showTranscript, setShowTranscript] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioDuratinon, setAudioDuration] = useState("00:00");
  const [ufoCards, setUfoCards] = useState<UfoCardTypeArray>([]);
  const [nextCard, setNextCard] = useState<UfoCardType>();
  const [prevCard, setPrevCard] = useState<UfoCardType>();

  useEffect(() => {
    const getUfoData = async () => {
      const data = await getUfoCards();
      const idx = data.findIndex((card) => card.id === Number(id));
      const prevRecord = idx > 0 ? data[idx - 1] : undefined;
      const nextRecord = idx < data.length - 1 ? data[idx + 1] : undefined;
      setPrevCard(prevRecord);
      setNextCard(nextRecord);
      setUfoCards(data);
    }
    getUfoData();
  }, [id]);

  useEffect(() => {
    const getUfoCardData = async () => {
      const data = await getUfoCard(id);
      setRecordingData(data);

    }
    getUfoCardData();
  }, [id, awsCdn]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current.getBoundingClientRect();
    const cardCenterX = card.left + card.width / 2;
    const cardCenterY = card.top + card.height / 2;
    const rotateX = (e.clientX - cardCenterY) / (card.height / 2);
    const rotateY = (e.clientX - cardCenterX) / (card.width / 2);

    setRotate({ x: rotateX * -15, y: rotateY * 15 });
  };

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }

  const onAudioLoaded = () => {
    if (audioRef.current) {
      setAudioLoaded(true);
      const formattedDuration = formatTime(audioRef.current.duration);
      setAudioDuration(formattedDuration);

    }
  }

  const pausePlayIcons = () => {
    if (!audioLoaded) {
      return <LuPlay color="rgba(240, 91, 45, 0.3)" />
    } else {
      return !audioPlaying ? <LuPlay cursor={'pointer'} color="rgb(240, 91, 45)" onClick={toggleAudio} /> : <LuPause cursor={'pointer'} color="rgb(240, 91, 45)" onClick={toggleAudio} />
    }
  }

  const handleOpenCaptions = async () => {
    setShowTranscript(!showTranscript);
    if (!captions && recordingData) {
      setIsLoadingCaptions(true);
      // const captions = await getAudioCaptions(`https://${awsCdn}${recordingData.audio_url}`);
      setCaptions("");
      setIsLoadingCaptions(false);
    }
    
  }

  console.log(captions);
  return (
    <Suspense
      fallback={
        <ViewTransition exit={'slide-down'}>
          <RecordingCardSkeleton />
        </ViewTransition>
      }
    >
      <Box>
        { prevCard && <AudioRecordingContentArrow mode="prev" record={prevCard} />}
      </Box>
      <ViewTransition enter={"slide-up"} name={`recording-${id}`}>
        {recordingData && (
        <>
          <Flex
            onMouseMove={handleGlobalMouseMove}
            direction={'column'}
            justify={'center'}
            align={'center'}
            minH="calc(100vh - 64px)"
            perspective={'1000px'}
            pt={3}
          >
            {/* Glow effect */}
            <Box
              position={'fixed'}
              inset={0}
              pointerEvents={'none'}
              zIndex={5}
              bg="rgba(0, 0, 0, 0.9)"
              style={{
                background: `radial-gradient(
                  600px circle at ${mousePos.x}px ${mousePos.y}px,
                  rgba(0, 0, 0, 0) 0%,
                  rgba(0, 0, 0, 0.4) 30%,
                  rgba(0, 0, 0, 0.35) 80%
                )`
              }}
            />
            <Box
              ref={cardRef}
              onMouseMove={handleMouseMove}            
              onMouseLeave={handleMouseLeave}
              textAlign={'left'}
              overflow={'hidden'}
              position="relative"
              bg='#e2dcc8'
              p={6}
              zIndex={4}
              boxShadow={`0 0 40px rgba(255, 255, 200, 0.1)`}
              transition={'transform 0.1s ease-out, box-shadow 0.3s'}
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.5)`,
                transformStyle: "preserve-3d",
                // transformOrigin: "top center",
              }}
              maxW={'350px'}
              w={'full'}
              aspectRatio={3/4}
              border={"1px solid rgba(0, 0, 0, 0.1)"}
              // css={{
              //   "&::before": {
              //     content: `""`,
              //     position: "absolute",
              //     top: "-120px",
              //     left: "50%",
              //     transform: "translateX(-50%)",
              //     width: "2px",
              //     height: "120px",
              //     background: "linear-gradient(to bottom, #555, #aaa)",
              //     opacity: 0.7
              //   },
              //   "&::after": {
              //     content: '""',
              //     position: "absolute",
              //     top: "-10px",
              //     left: "50%",
              //     transform: "translateX(-50%)",
              //     width: "10px",
              //     height: "10px",
              //     borderRadius: "50%",
              //     background: "#222",
              //     boxShadow: "0 0 6px rgba(0,0,0,0.6)",
              //   }
              // }}
            >
              <Box position={'relative'} zIndex={2} pb={2}>
                <Badge
                  zIndex={'10'}
                  position={'absolute'}
                  top={'1'}
                  right={'2'}
                  colorScheme={'red'}
                  variant={'solid'}
                  fontFamily={'mono'}
                  transform="translateZ(20px)"
                >
                  {audioDuratinon}
                </Badge>
                <Flex direction={'column'} gap={4} align={'start'}>
                  <Box
                    overflow={'hidden'}
                    bg={'black'}
                    w={'full'}
                    aspectRatio={4/3}
                    boxShadow={'inner'}
                    transform={'translateZ(10px)'}
                    position={'relative'}
                  >
                    <ChakraImage
                      src={`https://${awsCdn}${recordingData.image_url}`} 
                      alt='Evidence'
                      filter={'sepia(0.2) contrast(1.1) brightness(0.9)'} 
                      transition={'filter 0.5s'}
                    />
                    {/* <Box
                      position={'absolute'}
                      inset={0}
                      background={"linear-gradient(to bottom, transparent, 50%, rgba(0, 0, 0, 0.1) 50%"}
                      backgroundSize={'100% 4px'}
                      pointerEvents={'none'}
                    /> */}
                  </Box>
                </Flex>
              </Box>
              <Box
                className="transcript"
                position={'absolute'}
                left={0}
                right={0}
                bottom={showTranscript ? "-10%" : "-110%"}
                bg={'#dcd4bc'}
                zIndex={4}
                p={4}
                pt={8}
                transition="bottom 0.6s cubic-bezier(0.4, 0, 0.3, 1)"
                // transform={showTranscript ? "translateY(10%)" : "translateY(-100%)"}
                height="55%" // Occupies the bottom half
                overflowY="auto"
                borderTop="1px dashed rgba(0,0,0,0.2)"
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { background: '#444', borderRadius: '10px' }
                }}
              >
                <Flex justifyContent={'space-between'}>
                  <Text 
                    fontFamily="mono" 
                    fontSize="10px" 
                    mb={2} 
                    color="blackAlpha.600"
                  >
                    [ TRANSCRIPT_DATA ]
                  </Text>
                  <Text onClick={() => handleOpenCaptions()} fontSize="9px" cursor={'pointer'} fontFamily={'mono'} color={'red.700'} fontWeight={'bold'}>
                    {showTranscript ? "[ HIDE DATA ]" : "[ CLICK TO SHOW TRANSCRIPT ]"}
                  </Text>
                  <Text>
                    {pausePlayIcons()}
                  </Text>
                </Flex>
                <Text 
                  fontFamily="'Courier New', Courier, monospace" 
                  fontSize="11px" 
                  lineHeight="1.4"
                >
                  {isLoadingCaptions ? "Loading..." : captions}
                </Text>
              </Box>
              <Flex
                direction="column"
                gap={1}
                w={'full'}
                p={1}
                bg={"#e2dcc8"}
                position={'relative'}
                zIndex={3}
              >
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
                  fontSize={'xs'}
                  color={'blackAlpha.800'}
                  lineHeight={'short'}
                >
                  {recordingData.description}
                </Text>
                <Flex
                  cursor={'pointer'}
                  w={'full'}
                  justify={'center'}
                  pt={2}
                >
                  <Text onClick={() => handleOpenCaptions()} fontSize={'10px'} fontFamily={'mono'} color={'red.700'} fontWeight={'bold'}>
                    {showTranscript ? "[ HIDE DATA ]" : "[ SHOW TRANSCRIPT ]"}
                  </Text>
                  <Text>
                    <audio 
                      onLoadedData={() => onAudioLoaded()}
                      onPlay={() => setAudioPlaying(true)}
                      onPause={() => setAudioPlaying(false)}
                      onEnded={() => setAudioPlaying(false)}
                      ref={audioRef} 
                      src={`https://${awsCdn}${recordingData.audio_url}`} 
                    />
                    {pausePlayIcons()}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </Flex>
          <Box 
            position="absolute"
            inset={0}
            opacity="0.36" // Keep it very subtle
            pointerEvents="none"
            backgroundImage="url('https://www.transparenttextures.com/patterns/stardust.png')" // Or a local noise SVG
            zIndex={2}
          />
        </>
        )}
      </ViewTransition>
      <Box>
        {nextCard && <AudioRecordingContentArrow mode='next' record={nextCard} />}
      </Box>
    </Suspense>
  )
}