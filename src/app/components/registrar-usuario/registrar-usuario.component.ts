import { FirebaseCodeErrorService } from './../../services/firebase-code-error.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {
  registrarUsuario: FormGroup;
  submitted = false;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private _usuarioService: UsuarioService,
              private afAuth: AngularFireAuth,
              private toastr: ToastrService,
              private router: Router,
              private firebaseError: FirebaseCodeErrorService) {
    this.registrarUsuario = this.fb.group({
      name: ['', [Validators.required,
                  Validators.maxLength(10)],
            ],
      lastname: ['', Validators.required],
      email: ['', [Validators.required,
                  Validators.email]],
      password: ['', [Validators.required,
                      Validators.minLength(6)]],
      repetirPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  registrar() {
    this.submitted = true;

    if(this.registrarUsuario.invalid) {
      return;
    }
    const usuario: any = {
      nombre: this.registrarUsuario.value.name,
      apellido: this.registrarUsuario.value.lastname,
      correo: this.registrarUsuario.value.email,
      password: this.registrarUsuario.value.password,
      repetirPassword: this.registrarUsuario.value.repetirPassword,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    console.log(this.registrarUsuario);
    if(usuario.password !== usuario.repetirPassword) {
      this.toastr.error('Las contraseñas deben ser las mismas', 'Error!!!');
      return;
    }

    this.loading = true;

    this.afAuth.createUserWithEmailAndPassword(usuario.correo, usuario.password).then(() => {
        this._usuarioService.agregarUsuario(usuario).then(() => {
        this.verificarCorreo();
      }).catch((error) => {
        this.loading = false;
        this.toastr.error(this.firebaseError.codeError(error.code), 'Error!!!');
      });
    }).catch((error) => {
      this.loading = false;
      this.toastr.error(this.firebaseError.codeError(error.code), 'Error!!!');
    });
  }

  verificarCorreo() {
    this.afAuth.currentUser.then(user => user?.sendEmailVerification()).then(() => {
      this.toastr.info('Le enviamos un correo electronico para su verificacion', 'Verificar Correo!!!');
      this.router.navigate(['/login']);
    })
  }
}
