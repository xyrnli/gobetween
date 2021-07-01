import 'reflect-metadata';
import {
  defineNotificationHandler,
  defineRequestHandler,
  isRequestHandler,
  isNotificationHandler,
  getHandledRequests,
  getHandledNotifications,
  addMiddleware,
  getMiddlewares,
} from './metadata.helper';
import { NotHandlerException } from '../exceptions';
import { IMiddleware } from '../types';

describe('helpers / metadata', () => {
  it('define metadata for request handler', () => {
    class ExampleRequestHandler {}
    class RequestMessage {}

    const handler = defineRequestHandler(ExampleRequestHandler, RequestMessage);
    expect(handler).toBe(ExampleRequestHandler);

    const handlerOf = getHandledRequests(ExampleRequestHandler);
    expect(handlerOf).toEqual([RequestMessage]);
  });

  it('define metadata for notification handler', () => {
    class ExampleNotificationHandler {}
    class NotificationMessage {}

    const handler = defineNotificationHandler(
      ExampleNotificationHandler,
      NotificationMessage,
    );
    expect(handler).toBe(ExampleNotificationHandler);

    const handlerOf = getHandledNotifications(ExampleNotificationHandler);
    expect(handlerOf).toEqual([NotificationMessage]);
  });

  it('prevent duplication of handled messages in request handler', () => {
    class ExampleRequestHandler {}
    class RequestMessage {}

    let handler = defineRequestHandler(ExampleRequestHandler, RequestMessage);
    handler = defineRequestHandler(handler, RequestMessage);
    expect(handler).toBe(ExampleRequestHandler);

    const handlerOf = getHandledRequests(ExampleRequestHandler);
    expect(handlerOf).toEqual([RequestMessage]);
  });

  it('prevent duplication of handled messages in notification handler', () => {
    class ExampleNotificationHandler {}
    class NotificationMessage {}

    let handler = defineNotificationHandler(
      ExampleNotificationHandler,
      NotificationMessage,
    );
    handler = defineNotificationHandler(handler, NotificationMessage);
    expect(handler).toBe(ExampleNotificationHandler);

    const handlerOf = getHandledNotifications(ExampleNotificationHandler);
    expect(handlerOf).toEqual([NotificationMessage]);
  });

  it('is class request handler', () => {
    class ExampleRequestHandler {}
    class RequestMessage {}

    defineRequestHandler(ExampleRequestHandler, RequestMessage);

    const is = isRequestHandler(ExampleRequestHandler);
    expect(is).toBe(true);
  });

  it('is class not request handler', () => {
    class ExampleNotRequestHandler {}

    const is = isRequestHandler(ExampleNotRequestHandler);
    expect(is).toBe(false);
  });

  it('is class notification handler', () => {
    class ExampleNotificationHandler {}
    class NotificationMessage {}

    defineNotificationHandler(ExampleNotificationHandler, NotificationMessage);

    const is = isNotificationHandler(ExampleNotificationHandler);
    expect(is).toBe(true);
  });

  it('is class not notification handler', () => {
    class ExampleNotNotificationHandler {}

    const is = isNotificationHandler(ExampleNotNotificationHandler);
    expect(is).toBe(false);
  });

  it('is request handler not notification handler', () => {
    class ExampleRequestHandler {}
    class RequestMessage {}

    defineRequestHandler(ExampleRequestHandler, RequestMessage);

    const is = isNotificationHandler(ExampleRequestHandler);
    expect(is).toBe(false);
  });

  it('is notification handler not request handler', () => {
    class ExampleNotificationHandler {}
    class NotificationMessage {}

    defineNotificationHandler(ExampleNotificationHandler, NotificationMessage);

    const is = isRequestHandler(ExampleNotificationHandler);
    expect(is).toBe(false);
  });

  it('throw error while getting handled request messages of not request handler', () => {
    class ExampleNotRequestHandler {}

    try {
      getHandledRequests(ExampleNotRequestHandler);
    } catch (e) {
      expect(e).toBeInstanceOf(NotHandlerException);
    }
  });

  it('throw error while getting handled notification messages of not notification handler', () => {
    class ExampleNotNotificationHandler {}

    try {
      getHandledNotifications(ExampleNotNotificationHandler);
    } catch (e) {
      expect(e).toBeInstanceOf(NotHandlerException);
    }
  });

  it('add middleware to request handler', () => {
    class RequestMessage {}
    class ExampleRequestHandler {}
    class ExampleMiddleware implements IMiddleware {
      use(message: object, next: (m: object) => void) {
        return next(message);
      }
    }

    defineRequestHandler(ExampleRequestHandler, RequestMessage);

    const handler = addMiddleware(ExampleRequestHandler, ExampleMiddleware);
    expect(handler).toBe(ExampleRequestHandler);

    const middlewares = getMiddlewares(ExampleRequestHandler);
    expect(middlewares).toEqual([ExampleMiddleware]);
  });

  it('add middleware to notification handler', () => {
    class NotificationMessage {}
    class ExampleNotificationHandler {}
    class ExampleMiddleware implements IMiddleware {
      use(message: object, next: (m: object) => void) {
        return next(message);
      }
    }

    defineNotificationHandler(ExampleNotificationHandler, NotificationMessage);

    const handler = addMiddleware(
      ExampleNotificationHandler,
      ExampleMiddleware,
    );
    expect(handler).toBe(ExampleNotificationHandler);

    const middlewares = getMiddlewares(ExampleNotificationHandler);
    expect(middlewares).toEqual([ExampleMiddleware]);
  });

  it('throw error while getting middlewares of not handler', () => {
    class ExampleNotHandler {}

    try {
      getMiddlewares(ExampleNotHandler);
    } catch (e) {
      expect(e).toBeInstanceOf(NotHandlerException);
    }
  });
});
