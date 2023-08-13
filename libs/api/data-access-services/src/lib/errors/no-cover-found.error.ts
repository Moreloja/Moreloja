export class NoCoverFoundError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NoCoverFoundError.prototype);
  }
}
