"use client";
import React, { useEffect, useState } from 'react';
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
    VStack,
    Flex
} from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';
import { FaRobot, FaChartBar, FaClock, FaUsers } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useInView } from 'react-intersection-observer';
import ParticlesBackground from '@/components/ParticlesBackground';

// Color Theme Configuration
const colorTheme = {
    background: '#F4F7FA',
    primary: '#3B7AD8',
    secondary: '#5E4AB8',
    text: {
        dark: '#1A202C',
        light: '#2D3748'
    },
    accent: '#38B2AC'
};

// Typography Configuration
const typography = {
  fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  heading: {
      fontWeight: 800,
      letterSpacing: '-0.04em',
      lineHeight: '1.1',
  },
  subHeading: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: '1.2',
  },
  body: {
      fontWeight: 400,
      letterSpacing: '-0.01em',
      lineHeight: '1.6',
  }
};

// Create a custom motion component that works with Chakra UI
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

// Feature Component Props Interface
interface FeatureProps {
    title: string;
    text: string;
    icon: IconType;
    delay: number;
}

// Animation Variants
const headingVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 50
    },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.8,
            type: "spring",
            stiffness: 70
        }
    }
};

const featureVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 50,
        scale: 0.95
    },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            type: "spring",
            stiffness: 100
        }
    },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3 }
    }
};

// Feature Component
const Feature = ({ title, text, icon, delay }: FeatureProps) => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <MotionBox
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            whileHover="hover"
            variants={featureVariants}
            position="relative"
            overflow="hidden"
            bg="white"
            borderRadius="2xl"
            p={8}
            boxShadow={`0 20px 40px rgba(59, 122, 216, 0.1)`}
            border="1px solid"
            borderColor="gray.100"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${colorTheme.primary}10 0%, ${colorTheme.secondary}10 100%)`,
                opacity: 0.5,
                zIndex: -1,
                filter: 'blur(10px)'
            }}
        >
            <VStack spacing={4} align="center">
                <motion.div
                    animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    <Icon 
                        as={icon} 
                        w={12} 
                        h={12} 
                        color={colorTheme.primary}
                        mb={4}
                    />
                </motion.div>
                <Text
                    fontWeight={700}
                    fontSize={'xl'}
                    color={colorTheme.text.dark}
                    textAlign="center"
                    mb={2}
                    letterSpacing="-0.02em"
                >
                    {title}
                </Text>
                <Text 
                    color={colorTheme.text.light}
                    fontSize={'md'}
                    textAlign="center"
                    opacity={0.8}
                    letterSpacing="-0.01em"
                    lineHeight={1.5}
                >
                    {text}
                </Text>
            </VStack>
        </MotionBox>
    );
};

// Main Home Page Component
export default function Home() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Box 
            bg={colorTheme.background}
            color={colorTheme.text.dark}
            fontFamily={typography.fontFamily}
            minHeight="100vh"
            overflow="hidden"
            position="relative"
        >
            <ParticlesBackground />

            {/* Subtle Gradient Overlay */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg={`linear-gradient(135deg, ${colorTheme.primary}10 0%, ${colorTheme.secondary}10 100%)`}
                opacity={0.5}
                zIndex={1}
                pointerEvents="none"
            />

            <Container 
                maxW={'7xl'} 
                py={20} 
                position="relative" 
                zIndex={10}
            >
                <Stack
                    as={Box}
                    textAlign={'center'}
                    spacing={{ base: 8, md: 14 }}
                    pb={{ base: 20, md: 36 }}
                >
                    <MotionHeading
                        initial="hidden"
                        animate="visible"
                        variants={headingVariants}
                        fontWeight={typography.heading.fontWeight}
                        fontSize={{ base: '5xl', sm: '6xl', md: '7xl' }}
                        letterSpacing={typography.heading.letterSpacing}
                        lineHeight={typography.heading.lineHeight}
                        mb={4}
                        transform={`translateY(${scrollY * 0.2}px)`}
                        color={colorTheme.primary}
                        textShadow="0 10px 30px rgba(59, 122, 216, 0.2)"
                        position="relative"
                        _before={{
                            content: '""',
                            position: 'absolute',
                            bottom: '-0.15em',
                            left: 0,
                            width: 'full',
                            height: '0.1em',
                            bg: `${colorTheme.primary}40`,
                            borderRadius: 'full'
                        }}
                    >
                        Convolyze
                    </MotionHeading>

                    <Heading
                        fontWeight={typography.subHeading.fontWeight}
                        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                        letterSpacing={typography.subHeading.letterSpacing}
                        lineHeight={typography.subHeading.lineHeight}
                        color={colorTheme.text.light}
                        mb={6}
                    >
                        Transform Meetings into{' '}
                        <Text
                            as={'span'}
                            color={colorTheme.secondary}
                            position="relative"
                            _after={{
                                content: '""',
                                width: 'full',
                                height: '30%',
                                position: 'absolute',
                                bottom: 1,
                                left: 0,
                                bg: colorTheme.secondary,
                                opacity: 0.2,
                                borderRadius: 'full',
                                zIndex: -1,
                            }}
                        >
                            Actionable Insights
                        </Text>
                    </Heading>

                    <Text 
                        color={`${colorTheme.text.light}CC`}
                        maxW={'3xl'} 
                        fontSize={'xl'} 
                        margin={'auto'}
                        mb={10}
                        fontWeight={typography.body.fontWeight}
                        letterSpacing={typography.body.letterSpacing}
                        lineHeight={typography.body.lineHeight}
                    >
                        Leverage cutting-edge AI to transform your meetings from mundane discussions 
                        to strategic decision-making powerhouses. Extract meaningful insights, 
                        optimize team collaboration, and drive meaningful outcomes.
                    </Text>

                    <Flex 
                        direction="column" 
                        align="center" 
                        justify="center" 
                        width="full"
                    >
                        <MotionBox
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1,
                                transition: { 
                                    duration: 0.5, 
                                    delay: 0.7,
                                    type: "spring",
                                    stiffness: 120
                                }
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <Link href="/meeting/upload">
                                <Button
                                    size="lg"
                                    px={14}
                                    py={8}
                                    borderRadius={'full'}
                                    bg={colorTheme.primary}
                                    color={'white'}
                                    boxShadow={`0 15px 40px ${colorTheme.primary}4D`}
                                    _hover={{
                                        bg: colorTheme.secondary,
                                        transform: 'translateY(-5px)',
                                        boxShadow: `0 20px 50px ${colorTheme.secondary}4D`
                                    }}
                                    transition="all 0.3s ease"
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                >
                                    Start Analyzing
                                </Button>
                            </Link>
                        </MotionBox>
                    </Flex>
                </Stack>

                <SimpleGrid 
                    columns={{ base: 1, md: 4 }} 
                    spacing={8}
                    mt={16}
                    transform={`translateY(${scrollY * 0.05}px)`}
                >
                    <Feature
                        icon={FaRobot}
                        title={'Smart Analysis'}
                        text={'Advanced AI models dissect meeting dynamics with precision'}
                        delay={0.3}
                    />
                    <Feature
                        icon={FaChartBar}
                        title={'Real-time Insights'}
                        text={'Instant analytics on team participation and engagement levels'}
                        delay={0.4}
                    />
                    <Feature
                        icon={FaClock}
                        title={'Time Analytics'}
                        text={'Optimize meeting efficiency with comprehensive time tracking'}
                        delay={0.5}
                    />
                    <Feature
                        icon={FaUsers}
                        title={'Team Metrics'}
                        text={'Deep dive into collaboration patterns and team dynamics'}
                        delay={0.6}
                    />
                </SimpleGrid>
            </Container>
        </Box>
    );
}