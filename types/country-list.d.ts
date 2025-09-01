declare module 'country-list' {
  export function getNames(): string[];
}

declare module 'country-list/data/codes' {
  const codes: string[];
  export default codes;
}
