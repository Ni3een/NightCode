import {useCallback,useEffect,useRef} from "react"
import {useDialog} from "../../providers/dialog"
import {useTheme} from "../../providers/theme"

import {DialogSearchList} from "../command-menu/dialog-search-list"
import {THEMES} from "../../theme"
import type {Theme} from "../../theme"

export const ThemeDialogContent=()=>{
    const dialog=useDialog();

    const {setTheme,currentTheme}=useTheme();
    const originaltheme=useRef(currentTheme);
    const confirmedRef=useRef(false);

    // revert to original theme if user cancels the dialog
    useEffect(()=>{
        return ()=>{
        if(!confirmedRef.current){
            setTheme(originaltheme.current);
        }
        }
},[setTheme]);

const handleSelect=useCallback((theme:Theme)=>{
    confirmedRef.current=true;
    setTheme(theme);
    dialog.close();

},[setTheme,dialog]);

const handleHighlight=useCallback((theme:Theme)=>{
    setTheme(theme);
},[setTheme]);
return (
    <DialogSearchList
        items={THEMES}
        onSelect={handleSelect}
        onHighlight={handleHighlight}
        filterFn={(t,query)=>t.name.toLowerCase().includes(query.toLocaleLowerCase())}
        renderItem={(theme,isSelected)=>(
            <text selectable={false} fg={isSelected? " black" : "white"}>
                {theme.name===originaltheme.current.name ? "\u0020\u2022\u0020" : "\u0020\u0020\u0020"}
                 {theme.name}
            </text>
        )}
                    getKey={(t)=>t.name}
                    placeholder="Search themes..."
                    emptyText="No themes found"
        />
)
}