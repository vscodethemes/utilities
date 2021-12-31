import color from 'color';

export default function toLab(value: string): [number, number, number] {
  const [l, a, b] = color(value).lab().array();
  return [Math.round(l), Math.round(a), Math.round(b)];
}
