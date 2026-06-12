import { Command } from "./types";
export const COMMANDS: Command[] = [
{
    name:"new",
    description:"Start a new Conversation",
    value:"/new",
},
{
    name:"agents",
    description:"Browse AI Agents",
    value:"/agents",
},
{
    name:"model",
    description:"Select AI Model for generation",
    value:"/model",
},
{
    name:"sessions",
    description:"Browse past sessions",
    value:"/sessions",
},
{
    name:"theme",
    description:"Change color theme",
    value:"/theme",
},
{
    name:"login",
    description:"Sign in with your browser",
    value:"/login",
},
{
    name:"logout",
    description:"Sign out of your account",
    value:"/logout",
},
{
    name:"upgrade",
    description:"Upgrade to Pro for more features",
    value:"/upgrade",
},
{
    name:"usage",
    description:"Open billing portal in your browser",
    value:"/usage",
},
{
    name:"exit",
    description:"Exit the application",
    value:"/exit",
    action:(ctx)=>{
        ctx.exit();
    },
}
];