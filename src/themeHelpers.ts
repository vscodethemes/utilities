import { colord, Colord } from 'colord';

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
