import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { register as registerUser, RegisterRequest } from '@features/auth/api/auth.api'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

/**
 * Schema de validación para el formulario de registro
 */
const schema = z.object({
  email: z.email(),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type FormData = z.infer<typeof schema>

export function RegisterForm() {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched'
  })
  const { errors, isSubmitting } = formState

  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      type ErrorResponse = { error?: string; message?: string }
      
      if (typeof err.response?.data === 'object' && err.response?.data) {
        const errorData = err.response.data as ErrorResponse
        if (errorData.error) return errorData.error
        if (errorData.message) return errorData.message
      }
      
      if (err.response?.status === 409) return 'Email or phone already exists'
      if (err.response?.status === 422) return 'Invalid data provided'
    }
    
    if (err instanceof Error) return err.message || 'Could not create account'
    return 'Could not create account'
  }

  const onSubmit = async (values: FormData) => {
    setFormError(null)
    try {
      const registerData: RegisterRequest = {
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword
      }
      
      await registerUser(registerData)
      navigate('/login', { replace: true })
    } catch (err) {
      setFormError(getErrorMessage(err))
    }
  }

  return (
    <form className="mx-auto max-w-sm space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="text-xl font-semibold">Sign up</h1>

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
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          className="w-full rounded border p-2 outline-none focus:ring"
          placeholder="+1234567890"
          {...register('phone')}
          aria-invalid={!!errors.phone || undefined}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          data-testid="phone"
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone.message}
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
          autoComplete="new-password"
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

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="w-full rounded border p-2 outline-none focus:ring"
          {...register('confirmPassword')}
          aria-invalid={!!errors.confirmPassword || undefined}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          data-testid="confirmPassword"
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting || undefined}
        className="btn btn-interactive hover:animate-shake w-full bg-black text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Creating account…' : 'Sign Up'}
      </button>

      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link to="/login" className="text-black underline hover:no-underline">
          Sign in
        </Link>
      </div>
    </form>
  )
}
