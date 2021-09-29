import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Rol } from 'src/app/interfaces/rol';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  lista_usuarios: Usuario[];
  usuario: Usuario;
  mensaje_contrasena: string;
  contrasena_confirmar: any;
  rol_seleccionado: Rol;
  roles: Rol[];
  roles_seleccionados: Rol[];
  filtrarUsuarios: string;

  constructor(
    private usuariosService: UsuarioService,
    private ngbModal: NgbModal,
    private usuarioService: UsuarioService
  ) {
    this.inicializaVariables();
  }

  ngOnInit(): void {
    this.listarUsuarios();
    this.listarRoles();
  }

  listarRoles() {
    this.usuarioService.listarRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  listarUsuarios() {
    this.usuariosService.listarUsuarios().subscribe((usuario) => {
      this.lista_usuarios = usuario;
    });
  }

  inicializaVariables() {
    this.lista_usuarios = [];
    this.roles = [];
    this.roles_seleccionados = [];
    this.rol_seleccionado = {};
    this.usuario = {};
    this.contrasena_confirmar = {};
    this.mensaje_contrasena = '';
  }

  abrirModalRoles(modalRoles, usuarioConsulta: Usuario) {
    this.usuario = usuarioConsulta;
    this.ngbModal
      .open(modalRoles, {
        centered: true,
        size: 'lg',
        scrollable: true,
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  abrirModalConfirma(modalConfirmar, usuarioConsulta: Usuario) {
    this.usuario = usuarioConsulta;
    this.ngbModal
      .open(modalConfirmar, {
        centered: true,
        size: 'lg',
        scrollable: true,
        backdrop: 'static',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  abrirModalEditarUsuario(modalEditarUsuario, usuarioConsulta: Usuario) {
    // asignamos una variable a un nuevo espacio en memoria para que no se altere el objeto anterior
    this.usuario = JSON.parse(JSON.stringify(usuarioConsulta));
    try {
      // agrege validacion cuando un usuario que se registro antes de la funcionaldida de roles
      if (!this.usuario.roles && this.usuario.roles.length > 0) {
        this.roles_seleccionados = this.usuario.roles;
      } else {
        this.roles_seleccionados = [];
      }
    } catch (e) {
      this.roles_seleccionados = [];
    }
    this.contrasena_confirmar = this.usuario.contrasena;

    this.ngbModal
      .open(modalEditarUsuario, {
        centered: true,
        size: 'xl',
        scrollable: true,
        backdrop: 'static',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  passwordDif(): boolean {
    return this.usuario.contrasena != this.contrasena_confirmar ? true : false;
  }

  addRol() {
    if (this.existeRol()) {
      Swal.fire({
        icon: 'warning',
        title: 'Este rol esta seleccionado',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      this.roles_seleccionados.push(this.rol_seleccionado);
    }
  }

  existeRol(): boolean {
    let existe_rol = this.roles_seleccionados.find(
      (rol) => rol.rol_id == this.rol_seleccionado.rol_id
    );

    if (existe_rol) {
      return true;
    } else {
      return false;
    }
  }

  quitarRol(indice) {
    this.roles_seleccionados.splice(indice, 1);
  }

  keyPress(event) {
    if (this.passwordDif()) {
      this.mensaje_contrasena = '';
    } else {
      this.mensaje_contrasena = '*Contraseñas no coinciden';
    }
  }

  borrarUsuario(modalConfirmar, usuario_id: string) {
    this.usuariosService
      .borrarUsuario(usuario_id)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario eliminado correctamente',
          showConfirmButton: false,
          timer: 1500,
        });
        this.ngbModal.dismissAll(modalConfirmar);
      })
      .catch((error) => {
        Swal.fire(
          'Oops...',
          'Error al actualizar usuario ' + this.usuario.nombres + ': ' + error,
          'error'
        );
      });
  }

  editarUsuario(frmEditarUsuario: NgForm, modalEditarUsuario) {
    if (frmEditarUsuario.valid) {
      this.usuariosService
        .editarUsuario(this.usuario)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado correctamente',
            showConfirmButton: false,
            timer: 1500,
          });

          this.ngbModal.dismissAll(modalEditarUsuario);
          //modalEditarUsuario.dismissAll(reason?: any);
        })
        .catch((error) => {
          Swal.fire(
            'Oops...',
            'Error al actualizar usuario ' +
              this.usuario.nombres +
              ': ' +
              error,
            'error'
          );
        });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Formulario invalido. Revise los campos obligatorios',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
