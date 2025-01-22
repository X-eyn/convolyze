"use client";

import { askModel } from "@/utils/apiUtils";
import { useEffect, useState } from "react";
import { Box, SkeletonText } from "@chakra-ui/react";
import Markdown from 'react-markdown';

export const Summary = ({ meetingId, model }: { meetingId: number, model: string }) => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState("");

  const getSummary = async () => {
    const summary = await askModel({
      id: meetingId,
      model: model,
      query: `Please provide a comprehensive meeting analysis with the following structure:

      1. First, summarize the key points discussed in clear paragraphs.
      2. List the main topics covered with bullet points.
      3. Identify participant contributions and engagement levels.
      4. Highlight any action items or decisions made.
      
      Format the response using proper markdown for readability.
      Keep the summary concise but informative.`,
      responseKey: "response1"
    });
    setSummaryData(summary)
    setLoading(false);
};

  useEffect(() => {
    setLoading(true);
    getSummary();
  }, [meetingId, model]);

  if (loading) {
    return (
      <Box padding="4" boxShadow="xlg" bg="white" width="100%">
        <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="2" />
      </Box>
    );
  }
  return <div style={{paddingLeft: "24px"}}>
    <Markdown>{(summaryData || "").toString()}</Markdown>
</div>;
};
