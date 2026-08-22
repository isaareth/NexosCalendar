# Aprovisionar las 6 cuentas directivas

No hay registro público (Constitución, Technology Constraints). Las cuentas se crean a mano:

1. Entra al dashboard de Supabase del proyecto → **Authentication → Users**.
2. Por cada área (General, Deportes, Edición, Mercadeo, RRPP, Talento Humano), clic en
   **Add user → Create new user**:
   - Email: el correo real del directivo de esa área.
   - Password: una contraseña temporal fuerte: pídele al directivo que la cambie en su
     primer inicio de sesión (Supabase Auth no fuerza esto automáticamente — comunicarlo por
     fuera del sistema).
   - Marca **Auto Confirm User** para que no dependa de un correo de verificación.
3. Repite hasta tener 6 usuarios. Cualquiera de los 6 puede gestionar actividades de
   cualquier categoría (spec 001-nexos-agenda, sección Assumptions) — no hay un rol
   diferenciado por área a nivel de base de datos.
4. Verifica que ningún usuario adicional pueda registrarse: no debe existir ninguna pantalla
   de "Crear cuenta" en `/admin/login`.

No se necesita `SUPABASE_SERVICE_ROLE_KEY` para este proceso — se hace desde el dashboard,
no desde un script.
