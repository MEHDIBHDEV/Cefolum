import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Breadcrumb from '../components/layout/Breadcrumb'

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = (data) => {
    console.log('Register form', data)
  }

  return (
    <main className="space-y-10 pb-20">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Créer un compte' },
        ]}
      />

      <section className="container-app max-w-xl">
        <div className="surface space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-semibold">Créer votre espace</h1>
            <p className="text-sm text-muted-foreground">
              Profitez d’avantages personnalisés et suivez vos projets déco en temps réel.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-2">
              <label htmlFor="register-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nom complet
              </label>
              <input
                id="register-name"
                type="text"
                className={`input ${errors.name ? 'border-danger focus:ring-danger' : ''}`}
                {...register('name', { required: 'Nom requis.' })}
              />
              {errors.name && <span className="text-xs text-danger">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="register-email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                className={`input ${errors.email ? 'border-danger focus:ring-danger' : ''}`}
                {...register('email', { required: 'Email requis.' })}
              />
              {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="register-password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Mot de passe
                </label>
                <input
                  id="register-password"
                  type="password"
                  className={`input ${errors.password ? 'border-danger focus:ring-danger' : ''}`}
                  {...register('password', {
                    required: 'Mot de passe requis.',
                    minLength: { value: 8, message: '8 caractères minimum.' },
                  })}
                />
                {errors.password && <span className="text-xs text-danger">{errors.password.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="register-confirm" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Confirmation
                </label>
                <input
                  id="register-confirm"
                  type="password"
                  className={`input ${errors.confirm ? 'border-danger focus:ring-danger' : ''}`}
                  {...register('confirm', {
                    required: 'Confirmation requise.',
                    validate: (value) => value === password || 'Les mots de passe ne correspondent pas.',
                  })}
                />
                {errors.confirm && <span className="text-xs text-danger">{errors.confirm.message}</span>}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Créer le compte
            </button>
          </form>
          <p className="text-xs text-muted-foreground">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-primary">
              Connectez-vous
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

