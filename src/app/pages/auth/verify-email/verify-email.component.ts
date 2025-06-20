import { UserLocalService } from '@/services/user-local.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@/services/auth.service';
import { LoaderComponent } from '@/shared/loader/loader.component';
import { NgIf } from '@angular/common';
import { AuthenticatedUser } from '@/model/auth';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [NgIf, LoaderComponent],
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent implements OnInit {
  isPending = false;
  error: string | null = null;
  isSuccess = false;

  constructor(
    private auth: AuthService,
    private userLocalService: UserLocalService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('userId') ?? '0',
      10
    );
    const hashToken = this.activatedRoute.snapshot.paramMap.get('hash');

    const token = this.activatedRoute.snapshot.queryParamMap.get('token') ?? '';

    if (userId <= 0) {
      this.error = 'Le lien est incomplet ou invalide.';
      return;
    }

    if (!hashToken) {
      this.error = 'Le lien est incomplet ou invalide.';
      return;
    }

    this.verifyEmail(userId, hashToken, token);
  }

  private verifyEmail(userId: number, hashToken: string, token?: string): void {
    this.isPending = true;
    this.error = null;

    this.auth
      .verifyEmail(userId, hashToken, token)
      .then((observer) => {
        observer.subscribe({
          next: (response) => {
            this.isPending = false;

            const { status, message, data } = response as {
              status: number;
              message: string;
              data?: AuthenticatedUser;
            };

            if (status === 404) {
              this.error = message;
              return;
            }

            if (data) {
              this.userLocalService.createUser(data);
              this.isSuccess = true;
              this.router.navigate(['/']);
            } else {
              this.error = 'Une erreur est survenue, merci de réessayer';
            }
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
      })
      .catch(() => {
        this.isPending = false;
        this.error = 'Erreur de connexion au serveur. Veuillez réessayer.';
      });
  }
}
