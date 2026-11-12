import type { Response } from 'express'

/* BPK-140: Every API error uses this JSON shape so the frontend can handle errors in one place.
   Example: { "error": { "code": "PRODUCT_NOT_FOUND", "message": "No product found with id \"prod-999\"." } } */
export type ApiErrorCode =
  | 'INVALID_PRODUCT_ID'
  | 'PRODUCT_NOT_FOUND'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode
    message: string
  }
}

export function sendError(res: Response, status: number, code: ApiErrorCode, message: string) {
  const body: ApiErrorBody = { error: { code, message } }
  return res.status(status).json(body)
}
