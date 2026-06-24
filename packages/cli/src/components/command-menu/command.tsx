import {AgentsDialogContent, ThemeDialogContent,ModelsDialogContent } from "../dialogs";
import type { Command, CommandContext } from "./types";
import { SessionsDialogContent } from "../dialogs/session-dialogs";
import { SUPPORTED_CHAT_MODELS } from "../../../../shared/src/models";
import { performLogin } from "../../lib/oauth";
import {clearAuth} from "../../lib/auth"
import { openBillingPortal, openUpgradeCheckout } from "../../lib/upgrade"
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
    action: async (ctx: CommandContext)=>{
        ctx.toast.show({message:"Opening upgrade page..."})
        try {
            await openUpgradeCheckout();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to open upgrade page";
            ctx.toast.show({ variant: "error", message });
        }
    }
},
{
    name:"usage",
    description:"Open billing portal in your browser",
    value:"/usage",
    action: async (ctx: CommandContext)=>{
        ctx.toast.show({message:"Opening billing portal..."})
        try {
            await openBillingPortal();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to open billing portal";
            ctx.toast.show({ variant: "error", message });
        }
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