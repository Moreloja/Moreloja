import { SecondsToStringPipe } from './seconds-to-string.pipe';

describe('SecondsToStringPipe', () => {
  const pipe = new SecondsToStringPipe();

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert seconds to string', () => {
    const seconds = 3661;
    const result = pipe.transform(seconds);
    expect(result).toBe('01:01:01');
  });

  it('should convert seconds to string 2', () => {
    const seconds = 36610;
    const result = pipe.transform(seconds);
    expect(result).toBe('10:10:10');
  });

  it('should convert undefined to string', () => {
    const seconds = undefined;
    const result = pipe.transform(seconds);
    expect(result).toBe('-');
  });
});
