"use client";
import { Container, Link as ChakraLink, Flex, Box, Text, Stack, Badge, Heading, SimpleGrid, Separator, List, Image } from "@chakra-ui/react";
// import Link from "next/link";
import "./styles/landingPage.scss";
import Link from "next/link";
const sources = [
  {
    label: "Library of Congress — National Recording Registry: The War of the Worlds",
    url: "https://www.loc.gov/item/ihas.200196247/",
  },
  {
    label: "Smithsonian Magazine — The Infamous War of the Worlds Radio Broadcast",
    url: "https://www.smithsonianmag.com/history/infamous-war-worlds-radio-broadcast-was-magnificent-fluke-180955180/",
  },
  {
    label: "Slate — The Myth of the War of the Worlds Panic",
    url: "https://slate.com/culture/2013/10/orson-welles-war-of-the-worlds-panic-myth-the-infamous-radio-broadcast-did-not-cause-a-nationwide-hysteria.html",
  },
  {
    label: "Project Gutenberg — H. G. Wells, The War of the Worlds",
    url: "https://www.gutenberg.org/ebooks/36",
  },
  {
    label: "Mercury Theatre on the Air — War of the Worlds broadcast materials",
    url: "https://www.mercurytheatre.info/",
  },
];
export default function Home() {
  const awsCdn = process.env.NEXT_PUBLIC_AWS_CDN_URL;
  const imageCards = [
    {
      title: "Orson Welles and the Mercury Theatre",
      src: awsCdn
        ? `https://${awsCdn}/images/Orson_Welles_1937.jpg`
        : "https://commons.wikimedia.org/wiki/Special:Redirect/file/Orson%20Welles%201937.jpg",
      alt: "Portrait of Orson Welles",
      caption:
        "Orson Welles directed and narrated the 1938 Mercury Theatre broadcast.",
    },
    {
      title: "A Story Before the Broadcast",
      src: awsCdn
        ? `https://${awsCdn}/images/H.G._Wells_by_Beresford.jpg`
        : "https://commons.wikimedia.org/wiki/Special:Redirect/file/H.G._Wells_by_Beresford.jpg",
      alt: "Portrait of H. G. Wells",
      caption:
        "The radio play adapted H. G. Wells’s 1898 science-fiction novel.",
    },
  ];
  return (
    <Flex direction={"column"}>
      <Box className="video-container">
        {awsCdn && <video autoPlay={true} loop={true} width={"100%"} muted={true}><source type="video/mp4" src={`https://${awsCdn}/video/warofworlds.mp4`} /></video>}
        <Text fontSize={'large'}>The War of The Worlds</Text>
      </Box>
      <Box as={'section'} className="main-content">
        <Stack gap={16} className="full-content">
          <Box p={4} className="section-card">
            <Badge colorScheme="red" mb={4}>
              Overview
            </Badge>

            <Heading as="h2" size="xl" mb={5}>
              What was the 1938 broadcast?
            </Heading>

            <Stack gap={4} color="gray.200" fontSize={{ base: "md", md: "lg" }}>
              <Text>
                On Sunday evening, October 30, 1938, CBS aired an episode of{" "}
                <Text as="span" fontStyle="italic">
                  The Mercury Theatre on the Air
                </Text>{" "}
                adapting H. G. Wells’s novel{" "}
                <Text as="span" fontStyle="italic">
                  The War of the Worlds
                </Text>
                . The production was directed by and starred Orson Welles. The
                Library of Congress describes the program as one of the most
                famous examples of radio drama and preserves it in the National
                Recording Registry.{" "}
                <ChakraLink href={sources[0].url} color="orange.300" target="_blank">
                  [Library of Congress]
                </ChakraLink>
              </Text>

              <Text>
                Instead of presenting the story as a straightforward play, the
                Mercury Theatre team staged much of it as a sequence of urgent
                news bulletins. Listeners heard
                reports of strange explosions on Mars, an object landing near
                Grover’s Mill, New Jersey, and terrifying descriptions of
                Martian machines attacking civilians.
              </Text>

              <Text>
                The result was a landmark in audio storytelling: a fictional
                invasion delivered through the familiar sound of live radio
                journalism.
              </Text>
            </Stack>
          </Box>

          <Flex gap={"4rem"} justifyContent={"center"}>
            {imageCards.map((item, index) => (
              <Box
                key={item.title}
                className="animated-image-card"
                style={{ animationDelay: `${index * 160}ms` }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  objectFit="cover"
                  maxW="300px"
                  maxH="100%"
                  borderTopRadius="2xl"
                />
                {/* <Image
                  src={item.src}
                  alt={item.alt}
                  objectFit="cover"
                  width="100%"
                  h="260px"
                  borderTopRadius="2xl"
                /> */}
                <Box p={5} maxW={"300px"}>
                  <Heading as="h3" size="md" mb={2}>
                    {item.title}
                  </Heading>
                  <Text color="gray.300">{item.caption}</Text>
                </Box>
              </Box>
            ))}
          </Flex>

          <Box className="section-card">
            <Badge colorScheme="orange" mb={4}>
              Why it sounded real
            </Badge>

            <Heading as="h2" size="xl" mb={5}>
              A drama disguised as live reporting
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
              <Stack gap={4} color="gray.200" fontSize={{ base: "md", md: "lg" }}>
                <Text>
                  The broadcast began with an announcement that it was a drama,
                  but the early portion soon shifted into a realistic simulation
                  of live radio coverage. The show copied the pacing and style
                  of breaking news: studio interruptions, expert interviews,
                  field reports, official-sounding statements, and escalating
                  descriptions of disaster.
                </Text>

                <Text>
                  This structure mattered because radio was a trusted,
                  immediate medium in the 1930s. News of the Depression, the
                  rise of fascism in Europe, and the possibility of war often
                  arrived through radio. The Mercury Theatre used that trust as
                  part of the performance.
                </Text>
              </Stack>
            </SimpleGrid>
          </Box>

          <Box className="section-card">
            <Badge colorScheme="purple" mb={4}>
              The panic question
            </Badge>

            <Heading as="h2" size="xl" mb={5}>
              Did it really cause mass panic?
            </Heading>

            <Stack gap={4} color="gray.200" fontSize={{ base: "md", md: "lg" }}>
              <Text>
                Newspaper headlines after the broadcast claimed that the nation
                had been thrown into widespread terror. Some listeners did call
                police stations, newspapers, and radio networks, and some people
                were genuinely frightened.
              </Text>

              <Text>
                However, later historians and media scholars have argued that
                the scale of the panic was exaggerated. Smithsonian Magazine
                notes that the broadcast’s reputation grew partly because the
                next day’s newspapers turned it into a national sensation.{" "}
                <ChakraLink href={sources[1].url} color="orange.300" target="_blank">
                  [Smithsonian]
                </ChakraLink>
              </Text>

              <Text>
                Scholars Jefferson Pooley and Michael Socolow similarly argue
                that the idea of a massive nationwide panic became a myth,
                amplified by press coverage and later retellings.{" "}
                <ChakraLink href={sources[2].url} color="orange.300" target="_blank">
                  [Pooley & Socolow]
                </ChakraLink>
              </Text>

              <Text>
                In other words: the broadcast did frighten some listeners, but
                the legend of an entire country fooled into chaos is probably
                larger than the event itself.
              </Text>
            </Stack>
          </Box>

          <Box className="section-card">
            <Badge colorScheme="green" mb={4}>
              Timeline
            </Badge>

            <Heading as="h2" size="xl" mb={5}>
              From novel to broadcast legend
            </Heading>

            <Stack gap={5} className="timeline">
              <Box className="timeline-item">
                <Text className="timeline-date">1898</Text>
                <Text>
                  H. G. Wells publishes{" "}
                  <Text as="span" fontStyle="italic">
                    The War of the Worlds
                  </Text>
                  , one of the foundational alien-invasion novels.{" "}
                  <ChakraLink href={sources[3].url} color="orange.300" target="_blank">
                    [Link To PDF]
                  </ChakraLink>
                </Text>
              </Box>

              <Box className="timeline-item">
                <Text className="timeline-date">1938</Text>
                <Text>
                  Orson Welles and the Mercury Theatre adapt the novel for CBS
                  radio, moving the invasion setting to contemporary America.
                </Text>
              </Box>

              <Box className="timeline-item">
                <Text className="timeline-date">Oct. 30, 1938</Text>
                <Text>
                  The Halloween-season broadcast airs as a realistic series of
                  fake bulletins, reports, and emergency announcements.
                </Text>
              </Box>

              <Box className="timeline-item">
                <Text className="timeline-date">Afterward</Text>
                <Text>
                  Newspapers report public alarm. Welles gives a press
                  conference, and the broadcast quickly becomes a case study in
                  media influence.
                </Text>
              </Box>

              <Box className="timeline-item">
                <Text className="timeline-date">Today</Text>
                <Text>
                  The broadcast is remembered as a masterpiece of radio drama
                  and a warning about how media formats can shape belief.
                </Text>
              </Box>
            </Stack>
          </Box>

          <Box className="section-card">
            <Badge colorScheme="cyan" mb={4}>
              Legacy
            </Badge>

            <Heading as="h2" size="xl" mb={5}>
              Why it still matters
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <Box className="legacy-card">
                <Heading as="h3" size="md" mb={3}>
                  Media literacy
                </Heading>
                <Text color="gray.300">
                  The broadcast shows why audiences need context: source,
                  format, timing, and verification all affect how information is
                  understood. Espicially now in the age of AI
                </Text>
              </Box>

              <Box className="legacy-card">
                <Heading as="h3" size="md" mb={3}>
                  Audio storytelling
                </Heading>
                <Text color="gray.300">
                  It remains a classic example of how sound design, pacing, and
                  performance can create a vivid imaginary world.
                </Text>
              </Box>

              <Box className="legacy-card">
                <Heading as="h3" size="md" mb={3}>
                  Myth and memory
                </Heading>
                <Text color="gray.300">
                  Its afterlife reminds us that the stories told about media
                  events can become as influential as the events themselves.
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          <Flex className="section-card" justifyContent={"space-between"}>
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Sources
              </Heading>

              <List.Root gap={3} color="gray.300">
                {sources.map((source) => (
                  <List.Item key={source.url}>
                    <ChakraLink href={source.url} color="orange.300" target="_blank">
                      {source.label}
                    </ChakraLink>
                  </List.Item>
                ))}
              </List.Root>
            </Box>
            <Flex direction={"column"} color={"white"} gap={2}>
              <Link href={"/map"}>Go To UFO Map →</Link>
              <Link href={"/audio-recordings"}>Go To Audio Recordings →</Link>
            </Flex>
            <Separator my={6} borderColor="whiteAlpha.300" />
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
}
