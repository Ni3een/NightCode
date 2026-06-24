import "opentui-spinner/react"
import type { ModeType } from "@nightcode/shared"
import {useTheme} from "../providers/theme"
type Props={
    mode?:ModeType
}
export function Spinner({ mode = "BUILD" }: Props){
    const {colors}=useTheme();
    const activeColor = mode === "PLAN" ? colors.planMode : colors.primary;
    return <spinner name="aesthetic" color={activeColor}></spinner>
}