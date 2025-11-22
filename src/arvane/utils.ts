type StartWith = 'start' | 'end';

export function insertStr(
  originStr: string,
  codepoint: string,
  stride: number,
  offset: number = 0,
  startWith: StartWith = 'start'
): string {
  if (!originStr || stride <= 0 || !codepoint) {
    return originStr;
  }

  const units: string[] = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(originStr), s => s.segment)
    : Array.from(originStr);

  if (startWith === 'start') {
    const start = Math.max(0, Math.min(offset, units.length));
    const head = units.slice(0, start).join('');
    const tailUnits = units.slice(start);

    if (tailUnits.length === 0) {
      return head;
    }

    const out: string[] = [];
    for (let i = 0; i < tailUnits.length; i++) {
      out.push(tailUnits[i]);
      if (i < tailUnits.length - 1 && (i + 1) % stride === 0) {
        out.push(codepoint);
      }
    }
    return head + out.join('');

  } else {
      const backSkip = Math.max(0, Math.min(offset, units.length));
      const splitIndex = units.length - backSkip;
      
      const headUnits = units.slice(0, splitIndex);
      const tail = units.slice(splitIndex).join('');

      if (headUnits.length === 0) {
        return tail;
      }

      const rev = [...headUnits].reverse();
      const outRev: string[] = [];
      for (let i = 0; i < rev.length; i++) {
        outRev.push(rev[i]);
        if (i < rev.length - 1 && (i + 1) % stride === 0) {
          outRev.push(codepoint);
        }
      }

      const head = outRev.reverse().join('');
      return head + tail;
  }
}
