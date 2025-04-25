export default (n: number) =>
    typeof n === 'number' && n === Number(n) && Number.isFinite(n);