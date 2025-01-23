// src/components/MeetingAnalysis/components/ParticipationTrend.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, useColorModeValue } from '@chakra-ui/react';

interface TrendData {
  topic: string;
  participants: {
    [key: string]: number;
  };
}

interface TrendProps {
  data: TrendData[];
  participants: string[];
}

export const ParticipationTrend = ({ data, participants }: TrendProps) => {
  const lineColors = ['#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#ED64A6'];
  const chartData = data.map((item) => ({
    topic: item.topic,
    ...item.participants
  }));

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      borderRadius="lg"
      boxShadow="sm"
      height="400px"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="topic" />
          <YAxis />
          <Tooltip />
          <Legend />
          {participants.map((participant, index) => (
            <Line
              key={participant}
              type="monotone"
              dataKey={participant}
              stroke={lineColors[index % lineColors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};