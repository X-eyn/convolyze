// src/components/MotionBox.tsx
'use client'
import { Box, BoxProps } from '@chakra-ui/react'
import { motion, MotionProps } from 'framer-motion'

export type MotionBoxProps = Omit<BoxProps, keyof MotionProps> & MotionProps

export const MotionBox = motion(Box)