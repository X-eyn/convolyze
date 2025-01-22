'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Box, 
    Container, 
    Heading, 
    Text, 
    Stack, 
    Button, 
    SimpleGrid,
    Icon,
    useColorModeValue,
    IconButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaRobot, FaChartBar, FaClock, FaUsers, FaSun, FaMoon } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useInView } from 'react-intersection-observer';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import { css, keyframes } from '@emotion/react';

// Motion components
const MotionBox = motion(Box);

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientTextStyle = css`
  background: linear-gradient(to right, #4299E1, #63B3ED);
  background-clip: text;
  color: transparent;
`;

// Spring animation config
const springTransition = {
    type: "spring",
    damping: 10,
    stiffness: 100
};

// Variants for animations
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
        transition: springTransition
    }
};

interface FeatureProps {
    title: string;
    text: string;
    icon: IconType;
    delay: number;
}

const Feature = ({ title, text, icon, delay }: FeatureProps) => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    return (
        <MotionBox
            ref={ref}
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={delay}
            p={8}
            rounded="2xl"
            bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')}
            style={{ 
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
            }}
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            boxShadow="xl"
            _hover={{
                transform: 'translateY(-8px)',
                boxShadow: '2xl',
                borderColor: 'blue.400'
            }}
            position="relative"
            overflow="hidden"
            whileHover={{ y: -8 }}
        >
            <Box
                position="absolute"
                top="-20px"
                right="-20px"
                width="100px"
                height="100px"
                bg="blue.400"
                opacity="0.1"
                borderRadius="full"
                transform="rotate(-45deg)"
            />
            <Box position="relative" zIndex={1}>
                <Box
                    bg={useColorModeValue('blue.50', 'blue.900')}
                    p={4}
                    rounded="full"
                    width="fit-content"
                    mb={4}
                    css={{ animation: `${float} 6s ease-in-out infinite` }}
                >
                    <Icon as={icon} w={8} h={8} color="blue.400" />
                </Box>
                <Text
                    fontWeight="bold"
                    fontSize="2xl"
                    mb={4}
                    css={gradientTextStyle}
                >
                    {title}
                </Text>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    {text}
                </Text>
            </Box>
        </MotionBox>
    );
};

export default function Home() {
    const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    const particlesInit = async (engine: Engine) => {
        await loadSlim(engine);
    };

    return (
        <Box 
            bg={bgColor}
            minH="100vh"
            position="relative"
            overflow="hidden"
        >
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    background: { color: { value: "transparent" } },
                    particles: {
                        number: {
                            value: 50,
                            density: { enable: true, value_area: 800 }
                        },
                        color: { value: "#4299E1" },
                        shape: { type: "circle" },
                        opacity: {
                            value: 0.5,
                            random: true
                        },
                        size: {
                            value: 3,
                            random: true
                        },
                        move: {
                            enable: true,
                            speed: 2,
                            direction: "none",
                            random: true,
                            straight: false,
                            outMode: "bounce",
                            attract: {
                                enable: true,
                                rotateX: 600,
                                rotateY: 1200
                            }
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
                            onHover: {
                                enable: true,
                                mode: "grab"
                            },
                            resize: true
                        },
                        modes: {
                            grab: {
                                distance: 140,
                                links: { opacity: 0.5 }
                            }
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

            <Box
                position="absolute"
                top="-20%"
                left="-20%"
                width="140%"
                height="140%"
                transform="rotate(-3deg)"
                bgGradient="linear(to-r, blue.400, purple.500)"
                opacity={0.05}
                filter="blur(100px)"
            />

            <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                position="fixed"
                top={4}
                right={4}
                onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
                zIndex={2}
                variant="ghost"
                size="lg"
                _hover={{
                    bg: useColorModeValue('gray.200', 'gray.700')
                }}
            />

            <Container maxW="7xl" py={20} position="relative" zIndex={1}>
                <MotionBox
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Stack spacing={12} align="center" textAlign="center">
                        <MotionBox variants={itemVariants}>
                            <Heading
                                fontSize={{ base: "4xl", md: "7xl" }}
                                fontWeight="bold"
                                lineHeight="shorter"
                                letterSpacing="tight"
                                mb={6}
                            >
                                Transform Meetings into{' '}
                                <Text
                                    as="span"
                                    css={gradientTextStyle}
                                    display="inline-block"
                                    style={{
                                        animation: `${pulse} 4s ease-in-out infinite`
                                    }}
                                >
                                    Actionable Insights
                                </Text>
                            </Heading>
                        </MotionBox>

                        <MotionBox variants={itemVariants}>
                            <Text
                                fontSize={{ base: "xl", md: "2xl" }}
                                color={useColorModeValue('gray.600', 'gray.400')}
                                maxW="3xl"
                                mx="auto"
                                lineHeight="tall"
                            >
                                Leverage AI-powered analytics to extract meaningful insights from your meetings.
                                Make data-driven decisions and optimize team collaboration.
                            </Text>
                        </MotionBox>

                        <MotionBox 
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href="/meeting/upload">
                                <Button
                                    colorScheme="blue"
                                    size="lg"
                                    fontSize="md"
                                    rounded="full"
                                    px={10}
                                    py={7}
                                    rightIcon={<Icon as={FaRobot} />}
                                >
                                    CONVULYZE
                                </Button>
                            </Link>
                        </MotionBox>
                    </Stack>

                    <SimpleGrid
                        columns={{ base: 1, md: 4 }}
                        spacing={10}
                        mt={20}
                        px={4}
                    >
                        <Feature
                            icon={FaRobot}
                            title="Smart Analysis"
                            text="State-of-the-art AI models analyze your meetings"
                            delay={0.3}
                        />
                        <Feature
                            icon={FaChartBar}
                            title="Real-time Insights"
                            text="Get instant analytics on participation and engagement"
                            delay={0.4}
                        />
                        <Feature
                            icon={FaClock}
                            title="Time Analytics"
                            text="Optimize meeting efficiency with data-driven insights"
                            delay={0.5}
                        />
                        <Feature
                            icon={FaUsers}
                            title="Team Metrics"
                            text="Track and improve team collaboration effectively"
                            delay={0.6}
                        />
                    </SimpleGrid>
                </MotionBox>
            </Container>
        </Box>
    );
}