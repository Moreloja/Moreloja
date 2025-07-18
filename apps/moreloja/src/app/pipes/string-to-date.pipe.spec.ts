import { StringToDatePipe } from './string-to-date.pipe';

describe('StringToDatePipe', () => {
  const pipe = new StringToDatePipe();

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert ISO date string to Date object', () => {
    const dateString = '2023-04-01T12:00:00.000Z';
    const result = pipe.transform(dateString);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe(dateString);
  });

  it('should convert non-ISO date string to Date object', () => {
    const dateString = '2023-04-01';
    const result = pipe.transform(dateString);
    expect(result).toBeInstanceOf(Date);
    expect(result.toDateString()).toBe('Sat Apr 01 2023');
  });
});
