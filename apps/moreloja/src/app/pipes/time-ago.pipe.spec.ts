import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  const pipe = new TimeAgoPipe();

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "last year" for a year ago', () => {
    const date = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const result = pipe.transform(date);
    expect(result).toBe('last year');
  });

  it('should return "last month" for a month ago', () => {
    const date = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const result = pipe.transform(date);
    expect(result).toBe('last month');
  });

  it('should return "last week" for a week ago', () => {
    const date = new Date(new Date().setDate(new Date().getDate() - 7));
    const result = pipe.transform(date);
    expect(result).toBe('last week');
  });

  it('should return "yesterday" for a day ago', () => {
    const date = new Date(new Date().setDate(new Date().getDate() - 1));
    const result = pipe.transform(date);
    expect(result).toBe('yesterday');
  });

  it('should return "an hour ago" for an hour ago', () => {
    const date = new Date(new Date().setHours(new Date().getHours() - 1));
    const result = pipe.transform(date);
    expect(result).toBe('an hour ago');
  });

  it('should return "just now" for a second ago', () => {
    const date = new Date(new Date().setSeconds(new Date().getSeconds() - 1));
    const result = pipe.transform(date);
    expect(result).toBe('just now');
  });

  it('should return "in the future" for a future date', () => {
    const date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    const result = pipe.transform(date);
    expect(result).toBe('in the future');
  });

  it('should return "Invalid date" for null', () => {
    const date = null;
    const result = pipe.transform(date as unknown as Date);
    expect(result).toBe('Invalid date');
  });

  it('should return "Invalid date" for undefined', () => {
    const date = undefined;
    const result = pipe.transform(date as unknown as Date);
    expect(result).toBe('Invalid date');
  });
});
