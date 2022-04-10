import { colord, Colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

export type ColorQueryType =
  | 'editorBackground'
  | 'activityBarBackground'
  | 'statusBarBackground'
  | 'tabActiveBackground'
  | 'titleBarActiveBackground';

export type ColorQuery = {
  type: ColorQueryType;
  color?: string;
};

export const types: ColorQueryType[] = [
  'editorBackground',
  'activityBarBackground',
  'statusBarBackground',
  'tabActiveBackground',
  'titleBarActiveBackground',
];

export const parse = (value: string): ColorQuery => {
  const [type, color] = value.split('|');
  if (!color) throw new Error(`Missing ColorQuery color`);
  if (!isValidColorType(type))
    throw new Error(`Invalid ColorQuery type '${type}'`);

  return {
    type,
    color: colord(color).alpha(1).toHex(),
  };
};

export const stringify = (value: unknown): string => {
  if (!isValidColorQuery(value)) return '';
  if (!isValidColorType(value.type)) return '';

  return `${value.type}|${value.color || ''}`;
};

export const find = (
  colors: ColorQuery[],
  type: ColorQueryType,
): string | undefined => {
  return colors.find((c) => c.type === type)?.color;
};

export const next = (colors: ColorQuery[]): ColorQuery | undefined => {
  for (const type of types) {
    if (colors.findIndex((c) => c.type === type) === -1) {
      return {
        type,
        color: undefined,
      };
    }
  }
};

export const name = (index: number) => `color${index + 1}`;

export const isValidColorQuery = (value: unknown): value is ColorQuery => {
  if (typeof value !== 'object') return false;
  if (!value) return false;
  if (!('type' in value)) return false;
  if (!('color' in value)) return false;

  return true;
};

export const isValidColorType = (value: string): value is ColorQueryType => {
  return (types as string[]).indexOf(value) !== -1;
};

export const isValidColor = (value: string): boolean => {
  try {
    colord(value);
    return true;
  } catch (err) {
    return false;
  }
};

export const primaryColor = (color: Colord, dark = true) => {
  let { h, s, l } = color.toHsl();

  if (dark) {
    l = 35;
  } else {
    l = 35;
  }

  return colord({ h, s, l }).toHex();
};

export const mutedForegroundColor = (color: Colord, dark = true) => {
  let { h, s, l } = color.toHsl();

  if (dark) {
    s = Math.min(30, s);
    l = 35;
  } else {
    s = Math.min(30, s);
    l = 70;
  }

  return colord({ h, s, l }).toHex();
};

export const mutedBorderColor = (color: Colord, dark = true) => {
  let { h, s, l } = color.toHsl();

  if (dark) {
    l = 15;
  } else {
    l = 60;
  }

  return colord({ h, s, l }).toHex();
};

export const borderColor = (color: Colord, dark = true) => {
  let { h, s, l } = color.toHsl();

  if (dark) {
    l = 35;
  } else {
    l = 35;
  }

  return colord({ h, s, l }).toHex();
};

export const backgroundActiveColor = (color: Colord, dark = true) => {
  let { h, s, l } = color.toHsl();

  if (dark) {
    s = Math.min(s, 60);
    l = Math.min(l, 9);
  } else {
    s = Math.min(s, 60);
    l = Math.max(l, 90);
  }

  return colord({ h, s, l }).toHex();
};

export const backgroundColor = (color: Colord, dark = true) => {
  let { h, s, l } = color.toHsl();
  const originalL = l;

  if (dark) {
    s = Math.min(s, 30);
    l = Math.min(l, 7);

    const ldelta = originalL - l;
    if (Math.abs(ldelta) < 5) {
      if (ldelta < 0) {
        l -= 5 - Math.abs(ldelta);
      } else {
        l += 5 - ldelta;
      }
    }
  } else {
    s = Math.min(s, 30);
    l = Math.max(l, 95);
  }

  return colord({ h, s, l }).toHex();
};
