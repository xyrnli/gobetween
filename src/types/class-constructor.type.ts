export type ClassConstructor<T extends InstanceType<any> = InstanceType<any>> =
  {
    new (...args: unknown[]): T;
  };
