"use client"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default function ClientPage() {
    return (
        <FieldSet>
            <FieldLegend>Informacion del comprador</FieldLegend>
            <FieldDescription>Se le contactara a traves de la informacion proporcionada</FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                    <Input id="name" autoComplete="off" placeholder="Juan" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="lastname">Apellidos</FieldLabel>
                    <Input id="lastname" autoComplete="off" placeholder="Perez Gomez" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="number">Numero telefonico</FieldLabel>
                    <Input id="number" autoComplete="off" placeholder="54267483" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Correo electronico</FieldLabel>
                    <Input id="email" type="email" autoComplete="off" placeholder="juan@gmail.com" />
                </Field>
                <FieldSeparator />
                <FieldSet>
                    <FieldLegend>Informacion de entrega</FieldLegend>
                    <FieldDescription>
                        Necesitamos su informacion para entregar su informacion.
                    </FieldDescription>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="street">Calle</FieldLabel>
                            <Input id="street" type="text" placeholder="Independencia" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="state">Entre\calle</FieldLabel>
                            <Input id="state" type="text" placeholder="Maximo Gomez y Jose Marti" />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="city"># de casa o apartamento</FieldLabel>
                                <Input id="city" type="text" placeholder="18" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="zip">Municipio</FieldLabel>
                                <Input id="zip" type="text" placeholder="Centro Habana" />
                            </Field>
                        </div>
                    </FieldGroup>
                </FieldSet>
                <Field orientation="horizontal">
                    <Button type="submit">Submit</Button>
                    <Button variant="outline" type="button">
                        Cancel
                    </Button>
                </Field>
            </FieldGroup>
        </FieldSet>
    )
}
