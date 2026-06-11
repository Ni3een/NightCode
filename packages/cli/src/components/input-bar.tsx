import { EmptyBorder } from "./border";
import { CommandMenu } from "./command-menu";
import { StatusBar } from "./status-bar";
import { KeyBinding } from "@opentui/core";
import { useRef, useCallback, useEffect } from "react";
import { useRenderer } from "@opentui/react";
import type { TextareaRenderable } from "@opentui/core";
import { useCommandMenu } from "./command-menu/use-command-menu";

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

    const {
        showCommandMenu,
        commandQuery,
        selectedCommandIndex,
        scrollRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex,
    } = useCommandMenu();

    const handleCommandExecute = useCallback(
        (index: number) => {
            const command = resolveCommand(index);
            if (!command) return;
            if (command.action) {
                void command.action({ exit: () => renderer.destroy() });
            } else {
                textareaRef.current?.insertText(command.value + " ");
            }
        },
        [resolveCommand, renderer]
    );

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
            if (command.action) {
                void command.action({ exit: () => renderer.destroy() });
            } else {
                textarea.insertText(command.value + " ");
            }
            return;
        }
        handleSubmit();
    };

    return (
        <box width="100%" alignItems="center">
            <box
                width="50%"
                border={["left"]}
                borderColor="cyan"
                customBorderChars={{
                    ...EmptyBorder,
                    vertical: "┃",
                    bottomLeft: "┃",
                }}
            >
                <box
                    position="relative"
                    justifyContent="center"
                    paddingX={2}
                    paddingY={1}
                    backgroundColor="#1A1A24"
                    width="100%"
                    gap={1}
                >
                    {showCommandMenu && (
                        <box
                            position="absolute"
                            bottom="100%"
                            left={0}
                            width="100%"
                            backgroundColor="#1A1A24"
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
                        focused={!disabled}
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