"use client";
import { Flex, Box, } from "@chakra-ui/react";

export default function RecordingCardSkeleton() {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minH="calc(100vh - 64px)"
      pt={3}
    >
      <Box
        position="relative"
        overflow="hidden"
        bg="#e2dcc8"
        p={6}
        maxW="350px"
        w="full"
        aspectRatio={3/4}
        border="1px solid rgba(0, 0, 0, 0.1)"
      >
        {/* SHIMMER ANIMATION */}
        <Box
          position="absolute"
          inset={0}
          background="linear-gradient(
            110deg,
            transparent 25%,
            rgba(255,255,255,0.4) 50%,
            transparent 75%
          )"
          backgroundSize="200% 100%"
          animation="shimmer 1.5s infinite"
          zIndex={1}
        />

        {/* IMAGE PLACEHOLDER */}
        <Box
          bg="#cfc6ae"
          w="full"
          aspectRatio={4/3}
          mb={4}
        />

        {/* TEXT BLOCKS */}
        <Box bg="#cfc6ae" h="10px" w="40%" mb={2} />
        <Box bg="#cfc6ae" h="10px" w="90%" mb={1} />
        <Box bg="#cfc6ae" h="10px" w="85%" mb={1} />
        <Box bg="#cfc6ae" h="10px" w="60%" mb={4} />

        {/* BUTTON / FOOTER */}
        <Box bg="#cfc6ae" h="12px" w="50%" mx="auto" />
      </Box>

      {/* KEYFRAMES */}
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
    </Flex>
  );
};