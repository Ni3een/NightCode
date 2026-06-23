import {AgentsDialogContent, ThemeDialogContent,ModelsDialogContent } from "../dialogs";
import type { Command, CommandContext } from "./types";
import { SessionsDialogContent } from "../dialogs/session-dialogs";
import { SUPPORTED_CHAT_MODELS } from "../../../../shared/src/models";
import { performLogin } from "../../lib/oauth";
import {clearAuth} from "../../lib/auth"
export const COMMANDS: Command[] = [
{
    name:"new",
    description:"Start a new Conversation",
    value:"/new",
    action:(ctx: CommandContext)=>{
        ctx.navigate("/");
    },
},
{
    name:"agents",
    description:"Switch agents",
    value:"/agents",
    action:(ctx: CommandContext)=>{
        ctx.dialog.open({
            title:"Select an Agent",
            children:<AgentsDialogContent currentMode={ctx.mode} onSelectMode={ctx.setMode} />
        })
    }
},
{
    name:"model",
    description:"Select AI Model for generation",
    value:"/model",
    action:(ctx)=>{
        ctx.dialog.open({
            title:"Select a Model",
            children:(
                <ModelsDialogContent models={SUPPORTED_CHAT_MODELS.map((model) => model.id)} onSelectModel={ctx.setModel} />
            )
        })
    }
},
{
    name:"sessions",
    description:"Browse past sessions",
    value:"/sessions",
    action:(ctx: CommandContext)=>{
        ctx.dialog.open({
            title:"Select a Session",
            children:<SessionsDialogContent/>
        })
    }

},
{
    name:"theme",
    description:"Change color theme",
    value:"/theme",
    action:(ctx: CommandContext)=>{
        ctx.dialog.open({
            title:"Select a Theme",
            children:<ThemeDialogContent/>
        })
    }
},
{
    name:"login",
    description:"Sign in with your browser",
    value:"/login",
    action: async (ctx)=>{
        ctx.toast.show({message:"Opening login page..."})
        try{
            await performLogin();
            ctx.toast.show({variant:"success",message:"Signed in"})
        }
        catch(error){
            const message=error instanceof Error ? error.message :"Sign in failed or timed out";

            ctx.toast.show({variant:"error",message})
        }
    }
},
{
    name:"logout",
    description:"Sign out of your account",
    value:"/logout",
    action:(ctx: CommandContext)=>{
        clearAuth();
        ctx.toast.show({message:"Signing out..."})
    }
},
{
    name:"upgrade",
    description:"Upgrade to Pro for more features",
    value:"/upgrade",
    action:(ctx: CommandContext)=>{
        ctx.toast.show({message:"Opening upgrade page..."})
    }
},
{
    name:"usage",
    description:"Open billing portal in your browser",
    value:"/usage",
    action:(ctx: CommandContext)=>{
        ctx.toast.show({message:"Opening billing portal..."})
    }
},
{
    name:"exit",
    description:"Exit the application",
    value:"/exit",
    action:(ctx: CommandContext)=>{
        ctx.exit();
    },
}
];