//@ts-nocheck
interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

let messageList: Message[] = [];

export const startAnalysisPrompt = (agenda: string, meetingTranscribe: string) => {
    try {
        messageList = [
            {
                role: 'system',
                content: 'You need to analyze the meeting transcript with respect to meeting agenda and provide insights'
            },
            {
                role: 'user',
                content: `Meeting Agenda: ${agenda}`
            },
            {
                role: 'user',
                content: `Meeting Transcript: ${meetingTranscribe}`
            }
        ];
        
        // Make sure the data is serializable
        return JSON.parse(JSON.stringify(messageList));
    } catch (error) {
        console.error('Error in startAnalysisPrompt:', error);
        // Return a safe default if there's an error
        return [];
    }
};

export const getPrompt = (question: string, agenda: string) => {
    return `Can you summarize the discussed topics in the below conversation and list comma separated points of the topics discussed?
        ${question} [Agenda: ${agenda}]
        Once summarized, can you now put percentage on how close and far each person is from the agenda topic and put that in JSON format.
    `;
};

export const getAnalysisPrompt = () => {
    return messageList;
};