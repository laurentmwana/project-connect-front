import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@/services/auth/auth.service';
import { LoaderComponent } from '@/shared/loader/loader.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [NgIf, LoaderComponent],
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent implements OnInit {
  isPending = false;
  error: string | null = null;
  isSuccess: boolean = false;

  constructor(private auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const callback = this.route.snapshot.queryParamMap.get('callback');

    if (!callback) {
      this.error = 'Le lien est incomplet ou invalide.';
      return;
    }

    this.verifyEmail(callback);
  }

  private verifyEmail(url: string): void {
    this.isPending = true;
    this.error = null;

    this.auth
      .verifyEmail(url)

      .then((observer) => {
        observer.subscribe({
          next: (response) => {
            this.isPending = false;
            this.isSuccess = true;
            console.log('Vérification réussie :', response);
          },
          error: (err: HttpErrorResponse) => {
            this.isPending = false;
            if (err.status === 410) {
              this.error = 'Le lien de vérification a expiré.';
            } else {
              this.error =
                err.error?.message ||
                'La vérification a échoué. Veuillez réessayer.';
            }
          },
          complete: () => {
            this.isPending = false;
          },
        });
      });
  }
}
