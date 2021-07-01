import { ClassConstructor, IMiddleware } from '../types';
import { METADATA_KEYS } from '../constants';
import { NotHandlerException } from '../exceptions';

type HandlerType = ClassConstructor;
type MessageType = ClassConstructor;
type MiddlewareType = ClassConstructor<IMiddleware>;

function defineHandlerOf<
  THandler extends HandlerType = HandlerType,
  TMessage extends MessageType = MessageType,
>(target: THandler, key: string, message: TMessage): THandler {
  let of: MessageType[] = Reflect.getOwnMetadata(key, target) ?? [];
  of = [...new Set([...of, message])];
  Reflect.defineMetadata(key, of, target);
  return target;
}

export function defineRequestHandler<
  THandler extends HandlerType = HandlerType,
  TRequest extends MessageType = MessageType,
>(target: THandler, request: TRequest): THandler {
  return defineHandlerOf(target, METADATA_KEYS.REQUEST_HANDLER_OF, request);
}

export function defineNotificationHandler<
  THandler extends HandlerType = HandlerType,
  TRequest extends MessageType = MessageType,
>(target: THandler, request: TRequest): THandler {
  return defineHandlerOf(
    target,
    METADATA_KEYS.NOTIFICATION_HANDLER_OF,
    request,
  );
}

export function isRequestHandler(target: HandlerType): boolean {
  const of: MessageType[] =
    Reflect.getOwnMetadata(METADATA_KEYS.REQUEST_HANDLER_OF, target) ?? [];
  return of.length > 0;
}

export function isNotificationHandler(target: HandlerType): boolean {
  const of: MessageType[] =
    Reflect.getOwnMetadata(METADATA_KEYS.NOTIFICATION_HANDLER_OF, target) ?? [];
  return of.length > 0;
}

export function getHandledRequests(target: HandlerType): MessageType[] {
  const of: MessageType[] = Reflect.getOwnMetadata(
    METADATA_KEYS.REQUEST_HANDLER_OF,
    target,
  );

  if (!of) {
    throw new NotHandlerException(target);
  }

  return of;
}

export function getHandledNotifications(
  target: HandlerType,
): MessageType[] | null {
  const of: MessageType[] = Reflect.getOwnMetadata(
    METADATA_KEYS.NOTIFICATION_HANDLER_OF,
    target,
  );

  if (!of) {
    throw new NotHandlerException(target);
  }

  return of;
}

export function addMiddleware<THandler extends HandlerType = HandlerType>(
  target: THandler,
  middleware: MiddlewareType,
): THandler {
  const middlewares: IMiddleware[] =
    Reflect.getOwnMetadata(METADATA_KEYS.HANDLER_MIDDLEWARES, target) ?? [];

  Reflect.defineMetadata(
    METADATA_KEYS.HANDLER_MIDDLEWARES,
    [...middlewares, middleware],
    target,
  );

  return target;
}

export function getMiddlewares(target: HandlerType): IMiddleware[] {
  if (!isRequestHandler(target) && !isNotificationHandler(target)) {
    throw new NotHandlerException(target);
  }

  return (
    Reflect.getOwnMetadata(METADATA_KEYS.HANDLER_MIDDLEWARES, target) ?? []
  );
}
