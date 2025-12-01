import type { ParamsDictionary } from 'express-serve-static-core'
import type { ParsedQs } from 'qs'
import type { AuthenticatedRequest } from '../middleware/auth.ts'

// ===== Fully Typed Request (body, params, query) =====
export interface TypedRequest<
  TBody = unknown,
  TParams extends ParamsDictionary = ParamsDictionary,
  TQuery extends ParsedQs = ParsedQs,
> extends AuthenticatedRequest {
  body: TBody
  params: TParams
  query: TQuery
}

// ===== Legacy types (keep for backward compatibility or remove) =====
/** @deprecated Use TypedRequest<TBody> instead */
export type TypedRequestBody<T> = TypedRequest<T>

/** @deprecated Use TypedRequest<unknown, TParams> instead */
export type TypedRequestParams<TParams extends ParamsDictionary> = TypedRequest<
  unknown,
  TParams
>

/** @deprecated Use TypedRequest<TBody> instead */
export type AuthenticatedRequestBody<T> = TypedRequest<T>
