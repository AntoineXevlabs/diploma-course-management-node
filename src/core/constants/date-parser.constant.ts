export const DateParser = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
}
