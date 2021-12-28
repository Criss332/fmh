import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-login', 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  // tematica de la imagen
  styleImage = 'health';

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  isLoggedIn = false;
  isLoginFailed = false; 
  errorMessage = '';
  roles: string[] = []; 
  primengConfig: any;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private tokenStorage: TokenStorageService) { }
   
  ngOnInit(): void {
    this.buildForm();
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
      
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      }, 
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  private buildForm(): any {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  //Funcion NgStyle
  unsplashClass(): any {
    return {
      'min-height': '100%',
      // Imagenes random segun la variable que se le asigno en styleImage 
      background: `url("https://source.unsplash.com/random/1200x900?"${this.styleImage}) no-repeat center center`,
      'background-size': 'cover',
      position: 'relative',
    };
  }

  reloadPage(): void {
    window.location.reload();
  }
}