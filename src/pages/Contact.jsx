import React from 'react'
import { useForm } from 'react-hook-form'
import Breadcrumb from '../components/layout/Breadcrumb'

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm()

  const onSubmit = (data) => {
    console.log('Contact form submitted', data)
    reset()
  }

  return (
    <main className="space-y-10 pb-20">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Contact' },
        ]}
      />

      <section className="container-app grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <h1 className="text-3xl font-semibold">Contactez notre équipe</h1>
          <p className="text-sm text-muted-foreground">
            Un conseiller Cefolum vous répond sous 24h pour vous aider à sélectionner la pièce parfaite ou concevoir un projet sur mesure.
          </p>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold">Adresse :</span>
              <p className="text-muted-foreground">18 Rue des Arts, 75009 Paris</p>
            </div>
            <div>
              <span className="font-semibold">Téléphone :</span>
              <a href="tel:+33102030405" className="text-primary">
                +33 1 02 03 04 05
              </a>
            </div>
            <div>
              <span className="font-semibold">Email :</span>
              <a href="mailto:atelier@cefolum.fr" className="text-primary">
                atelier@cefolum.fr
              </a>
            </div>
          </div>
        </div>

        <form className="surface space-y-4 p-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              className={`input ${errors.name ? 'border-danger focus:ring-danger' : ''}`}
              placeholder="Votre nom"
              {...register('name', { required: 'Le nom est obligatoire.' })}
            />
            {errors.name && <FormError>{errors.name.message}</FormError>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`input ${errors.email ? 'border-danger focus:ring-danger' : ''}`}
              placeholder="vous@exemple.com"
              {...register('email', {
                required: 'L’email est obligatoire.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Adresse email invalide.',
                },
              })}
            />
            {errors.email && <FormError>{errors.email.message}</FormError>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Message
            </label>
            <textarea
              id="message"
              className={`textarea ${errors.message ? 'border-danger focus:ring-danger' : ''}`}
              placeholder="Expliquez votre projet, vos envies, vos contraintes..."
              rows={6}
              {...register('message', {
                required: 'Le message est obligatoire.',
                minLength: { value: 20, message: 'Ajoutez quelques détails supplémentaires.' },
              })}
            />
            {errors.message && <FormError>{errors.message.message}</FormError>}
          </div>

          <button type="submit" className="btn-primary">
            Envoyer la demande
          </button>

          {isSubmitSuccessful && (
            <p role="status" className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">
              Merci ! Nous revenons vers vous très vite.
            </p>
          )}
        </form>
      </section>
    </main>
  )
}

function FormError({ children }) {
  return (
    <span className="text-xs font-medium text-danger" role="alert">
      {children}
    </span>
  )
}

