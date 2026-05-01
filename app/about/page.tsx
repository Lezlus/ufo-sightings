"use client";
import { Box, Container, Flex, Heading, List, Separator, Text } from "@chakra-ui/react";
import "../styles/aboutPage.scss";
import Link from "next/link";

export default function About() {
  return (
    <Container color={"white"}>
      <Heading textWrap={"balance"} p={3} size={"2xl"}>Aim of This Site</Heading>
      <Separator />
      <Flex gap={4} alignItems={"flex-start"} direction={"column"} className="about-content">
        <Text>
          This site is targeted towards users who find anything UFO related to be interesting.
          The website will be updated regularly. 
        </Text>
        <Flex direction={"column"} alignItems={"flex-start"}>
          <Heading as={'h2'}>Future Plans</Heading>
          <List.Root>
            <List.Item>Increase data points on map to accomodate all of Earth</List.Item>
            <List.Item>Gather more audio recordings from around the world and use OpenAI to translate into English</List.Item>
            <List.Item>Create more dedicated pages to other prominant UFO sightings (Roswell Incident)</List.Item>
            <List.Item>More interactivity on the site (animations, UI, UX, etc)</List.Item>
          </List.Root>
        </Flex>
        
        <Flex direction={"column"} alignItems={"flex-start"}>
          <Heading as={'h2'}>Where I Got My Data?</Heading>
          <List.Root>
            <List.Item><Link className="data-links" target="_blank" href={"https://www.kaggle.com/datasets/camnugent/ufo-sightings-around-the-world"}>Kaggle Dataset</Link></List.Item>
            <List.Item><Link className="data-links" target="_blank" href={"https://noufors.com/audio_clips.html"}>Audio Recordings (Use Wayback Machine)</Link></List.Item>
          </List.Root>
        </Flex>
      </Flex>
    </Container>
  )
}