import { Switch } from "./switch";
import { useState } from "react";
import { useProduct } from "@/components/contextoGlobal"

export function SwitcherTuneado({ checked, onCheckedChange }) {
    const [dataCurated, setDataCurated] = useState([{}]);
    return (
        <>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />

        </>

    )
}