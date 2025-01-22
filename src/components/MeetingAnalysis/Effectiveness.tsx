import React, { useEffect, useState } from "react";

import { askModel } from "@/utils/apiUtils";
import { MeterGauge } from "../shared/MeterGauge";


export const MeetingEffectiveness = ({ meetingId, model }: { meetingId: number, model: string }) => {
  const [value, setValue] = useState(0);

const getEffectiveness = async () => {
    try {
        const effectiveness = await askModel({
            id: meetingId,
            model: model,
            query: `Analyze the meeting transcript and calculate an overall effectiveness score (0-100).
                Consider these factors:
                - Agenda adherence and topic coverage (40%)
                - Participant engagement and balanced participation (30%)
                - Meeting efficiency and time management (30%)
                
                Return ONLY a JSON object in this exact format:
                {"effectiveness": number}`,
            responseKey: "response2",
            format: "json_object"
        });

        let effectivenessValue = 0;
        try {
            const parsed = JSON.parse(effectiveness || '{"effectiveness": 0}');
            effectivenessValue = parsed.effectiveness || 0;
        } catch (error) {
            console.error('Error parsing effectiveness:', error);
            effectivenessValue = 0;
        }

        setValue(effectivenessValue);
    } catch (error) {
        console.error('Error getting effectiveness:', error);
        setValue(0);
    }
};

  useEffect(() => {
    setValue(0);
    getEffectiveness();
  }, [meetingId, model]);

  return (
    <MeterGauge value={value} />
  );
};
