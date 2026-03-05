import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ha ocurrido un error inesperado.';

      if (error.status === 0) {
        message = 'No se puede conectar con el servidor. Verifique que el backend esté en ejecución.';
      } else if (error.status === 400) {
        message = error.error?.message || 'Solicitud incorrecta. Verifique los datos ingresados.';
      } else if (error.status === 404) {
        message = error.error?.message || 'Recurso no encontrado.';
      } else if (error.status === 409) {
        message = error.error?.message || 'Conflicto: el recurso ya existe.';
      } else if (error.status === 422) {
        message = error.error?.message || 'Datos de validación incorrectos.';
      } else if (error.status >= 500) {
        message = error.error?.message || 'Error interno del servidor.';
      }

      toast.error(message);
      return throwError(() => error);
    })
  );
};
