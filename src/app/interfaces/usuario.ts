import { Rol } from "./rol";

export interface Usuario {
    usuario_id?: string;
    nombres?: string;
    correo?:string;
    fecha_registro?: Date;
    contrasena?: string;
    roles?:Rol[]
  }
  