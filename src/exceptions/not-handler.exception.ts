import { ClassConstructor } from '../types/class-constructor.type';

export class NotHandlerException extends Error {
  constructor(target: ClassConstructor) {
    super(`Specified class (${target.name}) is not a message handler.`);
  }
}
