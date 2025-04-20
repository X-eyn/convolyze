// src/components/MeetingAnalysis/components/ModelSelector.tsx
import { ChevronDownIcon } from "@chakra-ui/icons"
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { GPT_MODELS, GEMINI_MODELS } from "@/constants";
import React from "react";

export const ModelSelector = ({onChange, selected}: {onChange: React.Dispatch<React.SetStateAction<string>>, selected: string}) => {
    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {selected || "Select Model"}
            </MenuButton>
            <MenuList zIndex={999999}>
                <MenuItem disabled style={{fontWeight: 'bold', backgroundColor: '#f0f0f0'}}>
                    OpenAI Models
                </MenuItem>
                {GPT_MODELS.map(m => 
                    <MenuItem key={m} onClick={() => onChange(m)}>{m}</MenuItem>
                )}
                {/* Commenting out other models as requested
                <MenuItem disabled style={{fontWeight: 'bold', backgroundColor: '#f0f0f0'}}>
                    Google Models
                </MenuItem>
                {GEMINI_MODELS.map(m => 
                    <MenuItem key={m} onClick={() => onChange(m)}>{m}</MenuItem>
                )}
                */}
            </MenuList>
        </Menu>
    )
}