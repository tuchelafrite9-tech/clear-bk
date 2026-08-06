# Schéma initial Supabase

1. Dans le SQL Editor Supabase, exécutez `migrations/20260804_initial_schema.sql`.
2. Créez le premier administrateur dans Supabase Auth, puis exécutez :

```sql
update public.profiles set role = 'admin' where email = 'VOTRE_EMAIL_ADMIN';
```

3. Dans Supabase Auth, ajoutez les URL de redirection de production et de prévisualisation pour `/my-account` et `/reset-password`.
4. Vérifiez que les variables Vercel suivantes sont définies pour Production et Preview :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` ou `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_EMAIL_DOMAIN`
5. Déployez en prévisualisation et testez : demande d’ouverture, inscription, connexion, espace client, administration et envoi d’e-mail.
6. Importez les données historiques avant la bascule de production.

Les fichiers sont stockés dans le bucket privé `documents`. Les composants existants doivent être adaptés pour générer des URL signées avant la mise en production de documents sensibles.
