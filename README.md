# 🍽️ Camarai - Carta Digital

Menú digital interactivo de alto rendimiento para el ecosistema Camarai. Diseñado para ser la terminal de cara al cliente que se sincroniza en tiempo real con el POS y el Dashboard.

## 📊 Estado Actual
*   **Fase**: Desarrollo de Alineación Técnica.
*   **Despliegue Local**: Operativo mediante `npm run dev`.
*   **Datos**: Actualmente utiliza **Mock Data** (datos de prueba) como mecanismo de seguridad si el servidor externo de catálogo no responde.
*   **Branding**: Logo actualizado a la nueva identidad visual (60px).
*   **Funcionalidades**:
    *   Carga de menú por categorías.
    *   Filtro por pestañas (Tabs).
    *   Carrito de la compra persistente.
    *   Proceso de checkout (Completar pedido).
    *   Soporte multi-idioma (i18n).

## 🗺️ Roadmap de Mejoras

### Fase 1: Estandarización de Datos (Urgente)
*   **Alineación de Nomenclatura**: Migración de atributos de Español a Inglés Técnico (`nombre_producto` -> `name`, `precio_venta` -> `price`) para uniformidad con Convex.
*   **Tipado en Céntimos**: Cambiar el manejo de precios de `string` a `number` representando céntimos (evitar errores de redondeo).

### Fase 2: Menú de Ingredientes y Opciones
*   **Modal de Producto (Modificadores)**: Implementar una vista de detalle al clicar un producto para:
    *   Seleccionar variaciones (ej: Pequeño, Grande, Combo).
    *   Ajustar ingredientes (Quitar/Añadir).
*   **Notas de Pedido**: Permitir al cliente añadir instrucciones específicas por plato.

### Fase 3: Integración Total (Convex)
*   **Sincronización Real-Time**: Sustituir los webhooks actuales por el SDK de Convex para una actualización instantánea del catálogo gestionado desde el Dashboard.
*   **Validación de Mesa**: Vincular la `session` de la URL directamente con el `tableId` de la sala.

### Fase 4: Experiencia Premium
*   **Micro-Mejoras UX-UI**: Transiciones suaves entre categorías y efectos de "añadir al carrito", mejorar estilos, paleta...
*   **Upselling Inteligente**: Recomendaciones de productos complementarios basadas en lo que hay en el carrito.

---
*Desarrollado por el equipo de Ingeniería de Camarai.*
