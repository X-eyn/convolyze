// src/components/MeetingAnalysis/components/TopicTag.tsx
import { Tag, TagLabel, Link, Box, useColorModeValue } from "@chakra-ui/react";
import { IoLogoLinkedin } from "react-icons/io";
import { motion } from "framer-motion";

const MotionTag = motion(Tag);

export const TopicTag = ({ topic }: { topic: string }) => {
  const tagBg = useColorModeValue('blue.50', 'blue.900');
  const tagBorder = useColorModeValue('blue.200', 'blue.700');
  
  return (
    <MotionTag
      size="lg"
      borderRadius="full"
      variant="subtle"
      bg={tagBg}
      border="1px solid"
      borderColor={tagBorder}
      boxShadow="sm"
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      <TagLabel fontSize="md" fontWeight="medium">
        {topic}
        <Link
          href={`https://www.linkedin.com/learning/search?keywords=${topic}`}
          isExternal
          ml={2}
          _hover={{ color: "blue.500" }}
        >
          <IoLogoLinkedin size={16} />
        </Link>
      </TagLabel>
    </MotionTag>
  );
};