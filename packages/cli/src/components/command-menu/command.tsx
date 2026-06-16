import { ThemeDialogContent } from "../dialogs";
import type { Command, CommandContext } from "./types";
export const COMMANDS: Command[] = [
{
    name:"new",
    description:"Start a new Conversation",
    value:"/new",
    action:(ctx: CommandContext)=>{
        ctx.toast.show({message:"Starting a new conversation..."})
    },
},
{
    name:"agents",
    description:"Switch agents",
    value:"/agents",
    action:(ctx: CommandContext)=>{
        ctx.dialog.open({
            title:"Select an Agent",
            children:<text>"Agent selection coming soon..."</text>
        })
    }
},
{
    name:"model",
    description:"Select AI Model for generation",
    value:"/model",
    action:(ctx: CommandContext)=>{
        ctx.dialog.open({
            title:"Select a Model",
            children:<text>"Model selection coming soon..."</text>
        })
    }
},
{
    name:"sessions",
    description:"Browse past sessions",
    value:"/sessions",
    action:(ctx: CommandContext)=>{
        ctx.toast.show({message:"Browsing past sessions..."})
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
    action:(ctx: CommandContext)=>{
        ctx.toast.show({message:"Opening login page..."})
    }
},
{
    name:"logout",
    description:"Sign out of your account",
    value:"/logout",
    action:(ctx: CommandContext)=>{
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