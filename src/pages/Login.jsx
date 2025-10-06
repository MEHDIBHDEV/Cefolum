import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Breadcrumb from '../components/layout/Breadcrumb'

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log('Login form', data)
  }

  return (
    <main className="space-y-10 pb-20">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Login' },
        ]}
      />

      <section className="container-app max-w-lg">
        <div className="surface space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-semibold">Bienvenue</h1>
            <p className="text-sm text-muted-foreground">
              Accédez à votre espace pour suivre vos commandes et gérer vos préférences.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className={`input ${errors.email ? 'border-danger focus:ring-danger' : ''}`}
                placeholder="vous@exemple.com"
                {...register('email', { required: 'Email requis.' })}
              />
              {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                className={`input ${errors.password ? 'border-danger focus:ring-danger' : ''}`}
                placeholder="••••••••"
                {...register('password', { required: 'Mot de passe requis.' })}
              />
              {errors.password && <span className="text-xs text-danger">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn-primary w-full">
              Se connecter
            </button>
          </form>
          <p className="text-xs text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary">
              Créer un compte
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

