export type EditableLabelProps = {
    className: string,
    value: string,
    onValueChange(value: string): void,
    placeholder?: string,
    allowEmptySave?: boolean,
    trigger?: string
}