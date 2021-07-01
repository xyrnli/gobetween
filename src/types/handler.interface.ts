import { ClassConstructor } from './class-constructor.type';

export interface IHandler<
  TMessage extends ClassConstructor = ClassConstructor,
  TReturn = void,
> {
  handle(message: TMessage): TReturn;
}

export interface IRequestHandler<
  TRequest extends ClassConstructor = ClassConstructor,
  TResponse = void,
> extends IHandler<TRequest, TResponse> {}

export interface INotificationHandler<
  TMessage extends ClassConstructor = ClassConstructor,
> extends IHandler<TMessage> {}
