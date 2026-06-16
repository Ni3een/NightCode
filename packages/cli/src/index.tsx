import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";
import { useTheme } from "./providers/theme";
import { ToastProvider} from "./providers/toast";
import { KeyboardLayerProvider } from "./providers/toast/keyboard-layer";
import { DialogProvider } from "./providers/dialog";
import { ThemeProvider } from "./providers/theme";
function ThemedRoot(){
  const {colors}=useTheme();
  return(
     <box
            alignItems="center"
            justifyContent="center"
            backgroundColor={colors.background}
            width="100%"
            height="100%"
            gap={2}
          >
            <Header/>
            <InputBar onSubmit={()=>{}}/>
          </box>
  )
}
function App() {
  return (
    <ThemeProvider>
    <KeyboardLayerProvider>
      <DialogProvider>
        <ToastProvider>
          <ThemedRoot/>
        </ToastProvider>
      </DialogProvider>
    </KeyboardLayerProvider>
      </ThemeProvider>

  );
}

const renderer = await createCliRenderer({
  targetFps:60,
  exitOnCtrlC:false,
});
createRoot(renderer).render(<App />);
