// File: src/components/MeetingAnalysis/index.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  StatGroup,
  Heading,
  OrderedList,
  ListItem,
  HStack,
  TagLabel,
  Tag,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  Box,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { css } from "@emotion/react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import { TopicStats } from "./TopicStats";
import { MeetingEffectiveness } from "./Effectiveness";
import { TopicChart } from "./TopicChart";
import { Summary } from "./components/Summary";
import { askModel } from "@/utils/apiUtils";
import { BsMicrosoftTeams } from 'react-icons/bs';
import { IoLogoLinkedin } from "react-icons/io";
import { GrMailOption } from "react-icons/gr";
import { SiWhatsapp } from "react-icons/si";
import { StatBox } from "../shared/StatBox";
import { ModelSelector } from "./components/ModelSelector";
import { GPT_MODELS } from "@/constants";
import { ParticipationTrend } from "./components/ParticipationTrend";
import { TopicTag } from "./components/TopicTag";

// Define interfaces for type safety
interface Meeting {
  id: number;
  title: string;
  duration: number;
}

interface Participant {
  [key: string]: number;
}

interface TopicData {
  topic: string;
  participants: Participant;
}

interface MeetingData {
  percentages: TopicData[];
}

interface TopicPercentages {
  [topic: string]: number;
}

interface LearningTopics {
  [participant: string]: string[];
}

// Motion components
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 10, stiffness: 100 }
  }
};

const CUT_OFF = 40;

export const MeetingAnalysis = ({ meeting }: { meeting: Meeting }) => {
  // State management with proper typing
  const [data, setData] = useState<MeetingData>({ percentages: [] });
  const [loading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(GPT_MODELS[0]);

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Initialize particles
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  // Fetch meeting statistics
  const getAllStats = useCallback(async () => {
    try {
      const percentages = await askModel({
        id: meeting.id,
        model: selectedModel,
        query: `Analyze the meeting transcript and provide detailed participant engagement statistics.
               For each topic discussed, calculate the percentage contribution of each participant.
               Return the data in this exact JSON format:
               {
                   "topics": [
                       {
                           "topic": "topic name",
                           "participants": {
                               "participant1": number,
                               "participant2": number
                           }
                       }
                   ]
               }`,
        responseKey: "response4",
        format: "json_object"
      });

      let parsedData: { topics: TopicData[] };
      try {
        parsedData = JSON.parse(percentages || '{"topics": []}');
        setData(prevData => ({
          ...prevData,
          percentages: parsedData.topics || []
        }));
      } catch (error) {
        console.error('JSON parse error:', error);
        setData(prevData => ({ ...prevData, percentages: [] }));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error in getAllStats:', error);
      setData(prevData => ({ ...prevData, percentages: [] }));
      setIsLoading(false);
    }
  }, [selectedModel, meeting.id]);

  // Calculate unique participants
  const getParticipants = useMemo((): string[] => {
    if (data.percentages && data.percentages.length > 0) {
      const participantSet = new Set<string>();
      data.percentages.forEach((obj) => {
        if (obj.participants) {
          Object.keys(obj.participants).forEach(name => {
            participantSet.add(name);
          });
        }
      });
      return Array.from(participantSet);
    }
    return [];
  }, [data.percentages]);

  // Calculate topic percentages
  const getTopicPercent = useMemo((): TopicPercentages => {
    if (data.percentages && data.percentages.length > 0) {
      const topicStats: TopicPercentages = {};
      data.percentages.forEach((p) => {
        if (p.participants) {
          topicStats[p.topic] = Object.values(p.participants)
            .reduce((acc, curr) => acc + curr, 0);
        }
      });

      const totalPercent = Object.values(topicStats)
        .reduce((acc, curr) => acc + curr, 0);

      Object.keys(topicStats).forEach((t) => {
        topicStats[t] = Math.round((topicStats[t] / totalPercent) * 100);
      });

      return topicStats;
    }
    return {};
  }, [data.percentages]);

  // Calculate learning topics
  const getLearningTopics = useMemo((): LearningTopics => {
    const learning: LearningTopics = {};
    const participants = getParticipants;

    if (data.percentages) {
      data.percentages.forEach((topicObj) => {
        participants.forEach((name) => {
          const participantScore = topicObj.participants[name] || 0;
          if (participantScore < CUT_OFF) {
            learning[name] = learning[name] || [];
            learning[name].push(topicObj.topic);
          }
        });
      });
    }

    return learning;
  }, [data.percentages, getParticipants]);

  // Effect to fetch data
  useEffect(() => {
    setIsLoading(true);
    setData({ percentages: [] });
    getAllStats();
  }, [getAllStats, selectedModel]);

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      position="relative"
      overflow="hidden"
      py={8}
    >
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 30, density: { enable: true, value_area: 800 } },
            color: { value: "#4299E1" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: true,
              straight: false,
              outMode: "bounce",
              attract: { enable: true, rotateX: 600, rotateY: 1200 }
            },
            links: {
              enable: true,
              distance: 150,
              color: "#4299E1",
              opacity: 0.2,
              width: 1
            }
          },
          interactivity: {
            detectsOn: "canvas",
            events: {
              onHover: { enable: true, mode: "grab" },
              resize: true
            },
            modes: {
              grab: { distance: 140, links: { opacity: 0.5 } }
            }
          }
        }}
        style={{
          position: "absolute",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
      />

      {/* Main Content Container */}
      <Container maxW="container.xl" position="relative" zIndex={1}>
        <MotionVStack
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          spacing={8}
        >
          {/* Header Section */}
          <HStack
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mb={6}
          >
            <Heading
              as="h1"
              size="lg"
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
            >
              {meeting.title}
            </Heading>
            <ModelSelector selected={selectedModel} onChange={setSelectedModel} />
          </HStack>

          {/* Stats Section */}
          <MotionBox
            variants={itemVariants}
            w="full"
            p={8}
            bg={cardBg}
            backdropFilter="blur(16px)"
            rounded="2xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="xl"
          >
            <HStack justifyContent="space-between" alignItems="flex-start">
              <StatGroup>
                <StatBox loading={loading} label="Participants" value={getParticipants.length} />
                <StatBox loading={loading} label="Topics" value={Object.keys(getTopicPercent).length} />
                <StatBox loading={loading} label="Duration" value={`${meeting.duration} mins`} />
              </StatGroup>
              <Box width="300px">
                <MeetingEffectiveness meetingId={meeting.id} model={selectedModel} />
              </Box>
            </HStack>
          </MotionBox>

          {/* Main Content Tabs */}
          <MotionBox
            variants={itemVariants}
            w="full"
            bg={cardBg}
            backdropFilter="blur(16px)"
            rounded="2xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="xl"
            overflow="hidden"
          >
            <Tabs>
              <TabList px={6} pt={4}>
                <Tab
                  _selected={{
                    color: "blue.500",
                    borderColor: "blue.500",
                    fontWeight: "bold"
                  }}
                >
                  Summary
                </Tab>
                <Tab
                  _selected={{
                    color: "blue.500",
                    borderColor: "blue.500",
                    fontWeight: "bold"
                  }}
                >
                  Participants
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {/* First Section: Summary and Charts */}
                  <HStack alignItems="flex-start" spacing={8}>
                    <VStack flex={1} align="stretch" spacing={6}>
                      {/* Meeting Summary */}
                      <Summary meetingId={meeting.id} model={selectedModel} />

                      {/* New Participation Trend Chart */}
                      <Box
                        bg={cardBg}
                        backdropFilter="blur(8px)"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                        p={4}
                      >
                        <ParticipationTrend
                          data={data.percentages}
                          participants={getParticipants}
                        />
                      </Box>
                    </VStack>

                    {/* Topic Distribution Chart */}
                    <Box width="40%">
                      <TopicChart topics={getTopicPercent} />
                    </Box>
                  </HStack>

                  {/* Second Section: Improvements Needed */}
                  <Box mt={8}>
                    <Heading
                      as="h3"
                      size="md"
                      mb={6}
                      bgGradient="linear(to-r, blue.400, blue.600)"
                      bgClip="text"
                    >
                      Participants need improvements
                    </Heading>
                    <OrderedList spacing={4}>
                      {Object.entries(getLearningTopics).map(([participant, topics]) => (
                        <ListItem key={participant}>
                          <HStack spacing={4} alignItems="flex-start">
                            <HStack>
                              <Text fontWeight="bold" minWidth="160px">{participant}</Text>
                              <HStack>
                                <Text>(</Text>
                                <Link
                                  href={`mailto:example@domain.com?subject=Areas for Improvement&body=Hi, \n you need improvement on these topics ${topics.join(", ")}`}
                                  isExternal
                                >
                                  <GrMailOption size={20} />
                                </Link>
                                <Link
                                  href={`https://web.whatsapp.com/send/?text=Hi you need improvement on these topics ${topics.join(", ")}`}
                                  isExternal
                                >
                                  <SiWhatsapp size={20} color="#25D366" />
                                </Link>
                                <Link
                                  href={`https://teams.microsoft.com/l/chat/0/0?users=example@domain.com&message=Hi you need improvement on these topics ${topics.join(", ")}`}
                                  isExternal
                                >
                                  <BsMicrosoftTeams size={20} color="#4E5FBF" />
                                </Link>
                                <Text>)</Text>
                              </HStack>
                            </HStack>
                            {/* Modify the HStack for the topic tags */}
                            <HStack spacing={2} wrap="wrap">
                              {topics.map((topic) => (
                                <TopicTag key={topic} topic={topic} />
                              ))} 
                            </HStack>
                          </HStack>
                        </ListItem>
                      ))}
                    </OrderedList>
                  </Box>
                </TabPanel>

                <TabPanel>
                  <TopicStats
                    data={data.percentages}
                    partcipants={getParticipants}
                  />
                  <TableContainer mt={8}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Topic Discussed</Th>
                          {getParticipants.map((p) => (
                            <Th key={p}>
                              {p}
                              {"   "}
                              <Link
                                href="https://teams.microsoft.com/l/chat/0/0?users=example@domain.com"
                                isExternal
                              >
                                <BsMicrosoftTeams size={16} color="#4E5FBF" />
                              </Link>
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data.percentages.map((topicObj) => (
                          <Tr key={topicObj.topic}>
                            <Td>
                              {topicObj.topic}{" "}
                              <b>({getTopicPercent[topicObj.topic] || 0}%)</b>
                            </Td>
                            {getParticipants.map((p) => (
                              <Td key={p}>
                                {(topicObj.participants[p] || 0) < CUT_OFF ? (
                                  <ArrowDownIcon color="red.500" />
                                ) : (
                                  <ArrowUpIcon color="green.500" />
                                )}
                                {topicObj.participants[p] || 0}%
                                {(topicObj.participants[p] || 0) < CUT_OFF && (
                                  <Link
                                    href={`https://www.linkedin.com/learning/search?keywords=${topicObj.topic}`}
                                    isExternal
                                    ml={2}
                                  >
                                    <IoLogoLinkedin size={16} color="#0077B5" />
                                  </Link>
                                )}
                              </Td>
                            ))}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </MotionBox>
        </MotionVStack>
      </Container>
    </Box>
  );
};