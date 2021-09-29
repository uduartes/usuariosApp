import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  coleccion_usuarios: string = 'usuarios';
  caleccion_roles: string = 'roles';
  constructor(  private afs: AngularFirestore) { 

  }

  listarUsuarios() {
    return this.afs.collection(this.coleccion_usuarios).valueChanges();
  }

  listarRoles() {
    return this.afs.collection(this.caleccion_roles).valueChanges();
  }


  agregarUsuario(usuario: Usuario) {
    usuario.usuario_id = this.agregarCodigoId(usuario);
    return this.afs
      .doc(this.coleccion_usuarios + '/' + usuario.usuario_id)
      .set(usuario);
  }

  agregarCodigoId(usuario: Usuario) {
    let fecha_actual_ms: string = new Date().getTime().toString();
    let letra_nombre: string = usuario.nombres.substring(0, 3);

    return fecha_actual_ms + letra_nombre;
  }


  editarUsuario(usuario: Usuario) {
    return this.afs
      .doc(this.coleccion_usuarios + '/' + usuario.usuario_id)
      .update(usuario);
  }

  borrarUsuario(usuario_id: string) {
    return this.afs
      .doc(this.coleccion_usuarios + '/' + usuario_id)
      .delete();
  }
}
