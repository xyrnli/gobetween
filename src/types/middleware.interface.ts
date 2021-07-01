export interface IMiddleware<TMessage = object, TResponse = void> {
  use(message: TMessage, next: (message: TMessage) => TResponse): TResponse;
}
