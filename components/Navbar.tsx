'use client';

import { Flex, Link as ChakraLink, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Navbar() {
  return (
    <Flex
      as="nav"
      className="navbar"
      height="64px"
      width="100%"
      align="center"
      justify="space-evenly"
      position="sticky"
      top="0"
      zIndex="999"
      bg="var(--background)" // Using your SCSS variables
      backdropFilter="blur(8px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      px="8"
    >
      <ChakraLink asChild>
        <NextLink href={"/"}>The War of the Worlds</NextLink>
      </ChakraLink>
      <ChakraLink asChild>
        <NextLink href="/map">UFO Map</NextLink>
      </ChakraLink>
      <ChakraLink asChild>
        <NextLink href="/audio-recordings">Audio Recordings</NextLink>
      </ChakraLink>

      <ChakraLink asChild>
        <NextLink href="/about">About</NextLink>
      </ChakraLink>
    </Flex>
  );
}