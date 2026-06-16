import {mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {homedir} from "node:os";
import {join} from "node:path";
import {createContext,useContext,useState,useCallback} from "react";
import type {ReactNode} from "react";

import type {ThemeColors,Theme} from "../../theme";
import {DEFAULT_THEME,THEMES} from "../../theme";

const CONFIG_DIR=join(homedir(),".nightcode");

const THEME_PREFENCES_PATH=join(CONFIG_DIR,"prefences.json");

type ThemePrefennces={
    themeName:string;

}
function getIntialTheme():Theme{
    try{
        const prefences=JSON.parse(readFileSync(THEME_PREFENCES_PATH,"utf-8")) as Partial<ThemePrefennces>;
        const savedTheme=THEMES.find((theme)=>theme.name===prefences.themeName);
        if(savedTheme){
            return savedTheme;
        } else return DEFAULT_THEME;
    }catch{
        return DEFAULT_THEME;
        
    }
}
function persistTheme(theme:Theme){
    try{
        mkdirSync(CONFIG_DIR,{recursive:true});
        writeFileSync(THEME_PREFENCES_PATH,JSON.stringify({themeName:theme.name} satisfies ThemePrefennces,null,2),"utf-8");
    }catch(error){

    }
    }
type ThemeContextValue={
    colors:ThemeColors;
    currentTheme:Theme;
    setTheme:(theme:Theme)=>void;
}
const ThemeContext=createContext<ThemeContextValue | null>(null);
export function useTheme():ThemeContextValue{
    const value=useContext(ThemeContext);
    if(!value){
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return value;
}
type ThemeProviderProps={
    children:ReactNode;
}
export function ThemeProvider({children}:ThemeProviderProps){
    const [currentTheme,setCurrentTheme]=useState<Theme>(getIntialTheme());
    const setTheme=useCallback((theme:Theme)=>{
        setCurrentTheme(theme);
        persistTheme(theme);
    },[]);
    return (
        <ThemeContext.Provider value={{colors:currentTheme.colors,currentTheme,setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};
