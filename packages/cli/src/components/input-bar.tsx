import { SplitBorder } from "./border";
import { CommandMenu } from "./command-menu";
import { StatusBar } from "./status-bar";
import type { KeyBinding } from "@opentui/core";
import { useRef, useCallback, useEffect } from "react";
import { useRenderer } from "@opentui/react";
import type { TextareaRenderable } from "@opentui/core";
import { useCommandMenu } from "./command-menu/use-command-menu";
import type { Command } from "./command-menu/types";
import { useToast } from "../providers/toast";
import {useKeyboardLayer} from "../providers/toast/keyboard-layer";
import { useDialog } from "../providers/dialog";
import { useTheme } from "../providers/theme";
type Props = {
    onSubmit: (text: string) => void;
    disabled?: boolean;
};

export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
    { name: "return", action: "submit" },
    { name: "enter", action: "submit" },
    { name: "return", shift: true, action: "newline" },
    { name: "enter", shift: true, action: "newline" },
];

export function InputBar({ onSubmit, disabled = false }: Props) {
    const textareaRef = useRef<TextareaRenderable>(null);
    const onSubmitRef = useRef<() => void>(() => {});
    const renderer = useRenderer();
    const dialog = useDialog();
    const {colors}=useTheme();
    const toast =useToast();
    const {isTopLayer,setResponder}=useKeyboardLayer();

    const {
        showCommandMenu,
        commandQuery,
        selectedCommandIndex,
        scrollRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex,
    } = useCommandMenu();


    const handleTextareaContentChange = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        handleContentChange(textarea.plainText);
    }, [handleContentChange]);

    const handleSubmit = useCallback(() => {
        if (disabled) return;
        const textarea = textareaRef.current;
        if (!textarea) return;

        const text = textarea.plainText.trim();
        if (text.length === 0) return;

        onSubmit(text);
        textarea.setText("");
    }, [disabled, onSubmit]);

    const handleCommand = useCallback((
        command:Command | undefined
    )=>{
        const textarea = textareaRef.current;
        if(!textarea || !command) return;
        textarea.setText("");
        if(command.action){
            command.action({
                exit:()=>renderer.destroy(),
                toast,
                dialog,
            })
        }else{
            textarea.insertText(command.value + " ");   
        }
    },[renderer, toast])

     const handleCommandExecute = useCallback(
        (index: number) => {
            const command = resolveCommand(index);
            if (!command) return;
            handleCommand(command);
        },
        [resolveCommand, handleCommand]
    );
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.setText("");
    }, []);

    onSubmitRef.current = () => {
        if (disabled) return;
        const textarea = textareaRef.current;
        if (!textarea) return;

        if (showCommandMenu) {
            const command = resolveCommand(selectedCommandIndex);
            if (!command) return;
            handleCommand(command);
            return;
        }
        handleSubmit();
    };
    // register the base layer
    useEffect(()=>{
        setResponder("base",()=>{
            if(disabled) return false;
            const textarea=textareaRef.current;
            if(textarea && textarea.plainText.length>0){
                textarea.setText("");
                return true;
            }
            return false;
        })
        return ()=>setResponder("base",null);
    },[disabled,setResponder]);

    return (
        <box width="100%" alignItems="center">
            <box
                width="50%"
                border={SplitBorder.border}
                borderColor={colors.primary}
                customBorderChars={SplitBorder.customBorderChars}
            >
                <box
                    position="relative"
                    justifyContent="center"
                    paddingX={2}
                    paddingY={1}
                    backgroundColor={colors.surface}
                    width="100%"
                    gap={1}
                >
                    {showCommandMenu && (
                        <box
                            position="absolute"
                            bottom="100%"
                            left={0}
                            width="100%"
                            backgroundColor={colors.surface}
                            zIndex={10}
                        >
                            <CommandMenu
                                query={commandQuery}
                                selectedIndex={selectedCommandIndex}
                                scrollRef={scrollRef}
                                onSelect={(i) => setSelectedIndex(i)}
                                onExecute={handleCommandExecute}
                            />
                        </box>
                    )}
                    <textarea
                        ref={textareaRef}
                        focused={
                            !disabled && (isTopLayer("base") || isTopLayer("command"))}
                        width="100%"
                        keyBindings={TEXTAREA_KEY_BINDINGS}
                        onContentChange={handleTextareaContentChange}
                        onSubmit={() => onSubmitRef.current()}
                        placeholder={`Ask Anything..."Fix a bug in the database"`}
                    />
                    <StatusBar />
                </box>
            </box>
        </box>
    );
}