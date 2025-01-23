'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    VStack,
    Heading,
    Input,
    Button,
    Text,
    useColorModeValue,
    Icon,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
    useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaFileUpload, FaFileAlt, FaClipboardList } from 'react-icons/fa';
import { css, keyframes } from '@emotion/react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradientTextStyle = css`
  background: linear-gradient(to right, #4299E1, #63B3ED);
  background-clip: text;
  color: transparent;
`;

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

export default function MeetingUpload() {
    const router = useRouter();
    const toast = useToast();
    const inputRef = useRef<HTMLInputElement>(null);
    
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [agenda, setAgenda] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const particlesInit = async (engine: Engine) => {
        await loadSlim(engine);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Validate file type
            const validTypes = ['.txt', '.doc', '.docx'];
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
            
            if (!validTypes.includes(fileExtension)) {
                setError('Please upload a valid document file (.txt, .doc, .docx)');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB');
                return;
            }
            
            setUploadedFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!uploadedFile || !agenda.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append("agenda", agenda.trim());
            formData.append("transcribeFile", uploadedFile, uploadedFile.name);

            const response = await fetch("/api/meeting-upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === false) {
                throw new Error(data.error || 'Failed to process meeting');
            }

            if (data.id) {
                toast({
                    title: "Success",
                    description: "Meeting analysis started successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                router.push(`/meeting/${data.id}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error instanceof Error ? error.message : 'Failed to process meeting');
            toast({
                title: "Error",
                description: "Failed to process meeting. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            minH="100vh"
            bg={bgColor}
            position="relative"
            overflow="hidden"
            py={20}
        >
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

            <Container maxW="container.md" position="relative" zIndex={1}>
                <MotionVStack
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    spacing={8}
                >
                    <MotionBox variants={itemVariants}>
                        <Heading
                            fontSize={{ base: "3xl", md: "4xl" }}
                            textAlign="center"
                            mb={2}
                        >
                            Transform your meeting transcripts into{' '}
                            <Text as="span" css={gradientTextStyle}>
                                actionable insights
                            </Text>
                        </Heading>
                        <Text
                            color={useColorModeValue('gray.600', 'gray.400')}
                            textAlign="center"
                            fontSize="lg"
                        >
                            Upload your meeting transcript and let AI analyze it for you
                        </Text>
                    </MotionBox>

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
                        <VStack spacing={6}>
                            <FormControl isRequired>
                                <FormLabel fontWeight="medium">Meeting Agenda</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <Icon as={FaClipboardList} color="blue.500" />
                                    </InputLeftElement>
                                    <Input
                                        type="text"
                                        placeholder="Enter meeting agenda"
                                        value={agenda}
                                        onChange={(e) => setAgenda(e.target.value)}
                                        bg={useColorModeValue('white', 'gray.800')}
                                        border="1px solid"
                                        borderColor={borderColor}
                                        _hover={{
                                            borderColor: 'blue.400'
                                        }}
                                        _focus={{
                                            borderColor: 'blue.400',
                                            boxShadow: '0 0 0 1px #4299E1'
                                        }}
                                    />
                                </InputGroup>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontWeight="medium">Upload Transcribe</FormLabel>
                                <Box
                                    w="full"
                                    h="150px"
                                    border="2px dashed"
                                    borderColor={uploadedFile ? 'blue.400' : borderColor}
                                    rounded="lg"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    cursor="pointer"
                                    transition="all 0.2s"
                                    _hover={{
                                        borderColor: 'blue.400',
                                        transform: 'translateY(-2px)'
                                    }}
                                    onClick={() => inputRef.current?.click()}
                                    position="relative"
                                    overflow="hidden"
                                >
                                    <Input
                                        type="file"
                                        ref={inputRef}
                                        hidden
                                        accept=".txt,.doc,.docx"
                                        onChange={handleFileUpload}
                                    />
                                    <VStack spacing={2}>
                                        <Icon
                                            as={uploadedFile ? FaFileAlt : FaFileUpload}
                                            boxSize={8}
                                            color={uploadedFile ? 'blue.400' : 'gray.400'}
                                            css={{ animation: `${float} 3s ease-in-out infinite` }}
                                        />
                                        <Text color={useColorModeValue('gray.600', 'gray.400')}>
                                            {uploadedFile ? uploadedFile.name : 'Click to upload transcribe'}
                                        </Text>
                                        {error && (
                                            <Text color="red.500" fontSize="sm" textAlign="center">
                                                {error}
                                            </Text>
                                        )}
                                    </VStack>
                                </Box>
                            </FormControl>

                            <Button
                                colorScheme="blue"
                                size="lg"
                                width="full"
                                fontSize="md"
                                fontWeight="bold"
                                rounded="xl"
                                onClick={handleSubmit}
                                isDisabled={!uploadedFile || !agenda.trim()}
                                isLoading={submitting}
                                loadingText="Analyzing..."
                                _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'lg',
                                }}
                                _active={{
                                    transform: 'scale(0.98)',
                                }}
                            >
                                Analyze Meeting
                            </Button>
                        </VStack>
                    </MotionBox>
                </MotionVStack>
            </Container>
        </Box>
    );
}