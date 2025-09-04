export type Ok<T> = [value: T, error: undefined];
export type Err<E = Error> = [value: undefined, error: E];
export type Result<T, E = Error> = Ok<T> | Err<E>;

export type MaybePromiseLike<T> = PromiseLike<T> | T;
export type TryCatchReturnType<
	F extends () => MaybePromiseLike<unknown>,
	E = Error,
> = ReturnType<F> extends PromiseLike<infer T>
	? PromiseLike<Result<T, E>>
	: Result<ReturnType<F>, E>;

export function ok<T>(value: T): Ok<T> {
	return [value, undefined];
}

export function err<E = Error>(error: E): Err<E> {
	return [undefined, error];
}

export function tryPromise<T, E = Error>(
	result: MaybePromiseLike<T>,
): Result<T, E> | Promise<Result<T, E>> {
	if (isPromiseLike(result)) {
		let promise = result.then(ok);
		if ("catch" in promise && typeof promise.catch === "function") {
			promise = promise.catch(err);
		}
		return promise as Promise<Result<T, E>>;
	}
	return ok(result) as Result<T, E>;
}

export function tryFunction<
	T,
	F extends () => MaybePromiseLike<T> = () => MaybePromiseLike<T>,
	E = Error,
>(fn: F): TryCatchReturnType<F, E> {
	try {
		return tryPromise(fn()) as never;
	} catch (error) {
		return err(error as E) as never;
	}
}

export function trycatch<
	T,
	F extends () => MaybePromiseLike<T> = () => MaybePromiseLike<T>,
	E = Error,
>(fn: F): TryCatchReturnType<F, E>;
export function trycatch<T, E = Error>(
	result: MaybePromiseLike<T>,
): Result<T, E> | Promise<Result<T, E>>;

export function trycatch(fn: unknown) {
	if (typeof fn === "function") {
		return tryFunction(fn as never);
	}
	return tryPromise(fn);
}

export function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
	return (
		value !== null &&
		typeof value === "object" &&
		// biome-ignore lint/suspicious/noExplicitAny: check then function
		typeof (value as any).then === "function"
	);
}
