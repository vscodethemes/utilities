import color from 'color';

export default function toLab(value: string): [number, number, number] {
  const [l, a, b] = color(value).lab().array();
  return [l, a, b];
}
