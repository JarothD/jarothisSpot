import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@features/auth/api/auth.api'
import { useAuthStore } from '@features/auth/model/auth.store'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

/**
 * Schema: without inline messages (set by z.config({ customError }))
 * - This avoids Sonar false positives about "deprecated" overloads.
 */
const schema = z.object({
  email: z.email(),
  password: z.string().min(6)
})
type FormData = z.infer<typeof schema>

/** Type guard for safely reading location.state */
type FromState = { from?: { pathname?: string } }
const isFromState = (v: unknown): v is FromState =>
  typeof v === 'object' && v !== null && 'from' in (v as Record<string, unknown>)

export function LoginForm() {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched'
  })
  const { errors, isSubmitting } = formState

  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = isFromState(location.state) && location.state.from?.pathname ? location.state.from.pathname : '/'

  const [formError, setFormError] = useState<string | null>(null)

  const onSubmit = async (values: FormData) => {
    setFormError(null)
    try {
      const token = await login(values.email, values.password)
      setAccessToken(token)
      navigate(fromPath, { replace: true })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Define expected error response type
        type ErrorResponse = { message?: string }
        // Try to read backend message; if not, use generic message
        const msg =
          (typeof err.response?.data === 'object' && err.response?.data && 'message' in err.response.data
            ? String((err.response.data as ErrorResponse).message)
            : null) ||
          (err.response?.status === 401 ? 'Invalid credentials' : null) ||
          'Could not sign in'
        setFormError(msg)
      } else if (err instanceof Error) {
        setFormError(err.message || 'Could not sign in')
      } else {
        setFormError('Could not sign in')
      }
    }
  }

  return (
    <form className="mx-auto max-w-sm space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="text-xl font-semibold">Sign in</h1>

      {formError && (
        <div role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {formError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded border p-2 outline-none focus:ring"
          {...register('email')}
          aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
          data-testid="email"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded border p-2 outline-none focus:ring"
          {...register('password')}
          aria-invalid={!!errors.password || undefined}
          aria-describedby={errors.password ? 'password-error' : undefined}
          data-testid="password"
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting || undefined}
        className="inline-flex w-full items-center justify-center rounded bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}