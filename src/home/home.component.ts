import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, mergeMap, of, switchMap } from 'rxjs';
import { CreateComponent } from 'src/create/create.component';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  foldersArray: any[] = [];
  loading = false;

  constructor(
    private api: ApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) {
    this.getFolders();
  }

  getFolders() {
    this.api.getAllFolders().pipe(
      map((res: any) => {
        this.foldersArray = res;
      })
    ).subscribe();
  }

  edit(name?: string, id?: string) {
    const dialogRef = this.dialog.open(CreateComponent, {
      enterAnimationDuration: 0,
      exitAnimationDuration: 0,
      data: { type: 'edit', name }
    });

    dialogRef.afterClosed()
      .pipe((
        switchMap((newName) => {
          this.loading = true;
          if (newName && newName !== name) {
            this.api.editFolder(id, newName).subscribe();
            return of(newName);
          } else {
            return of(false);
          }
        })),
        map((result) => {
          if (result) {
            this.foldersArray.map((value: any) => {
              if (value._id == id) {
                return value.name = result;
              } else {
                return value;
              }
            });
            this._snackBar.open('Nom du dossier ' + ' modifié!', 'Fermer', { duration: 500 });
          }
          this.loading = false;
        })
      ).subscribe();
  }

  add(del?: boolean, name?: string, id?: string) {
    const dialogRef = this.dialog.open(CreateComponent, {
      enterAnimationDuration: 0,
      exitAnimationDuration: 0,
      data: { type: del ? 'del' : 'add_forlder', id }
    });

    dialogRef.afterClosed()
      .pipe((
        switchMap((result) => {
          this.loading = true;
          return of(result);
        })),
        switchMap((result) => {
          if (result && !del) {
            return this.api.createFolder(result);
          } else if (result && del) {
            return this.api.deletFolder(id);
          } else {
            return of(false);
          }
        }),
        map((result) => {
          if (!del) {
            if (result) {
              this.foldersArray.unshift(result);
              this.loading = false;
              this._snackBar.open('Nouveau dossier ajouté!', 'Fermer', { duration: 500 });
            } else {
              this.loading = false;
            }
          } else {
            if (del && result) {
              this.foldersArray.map((value, index) => {
                if (value._id == id) this.foldersArray.splice(index, 1);
              });
              this._snackBar.open('Dossier ' + name + ' supprimé!', 'Fermer', { duration: 500 });
            }
            this.loading = false;
          }
        })
      ).subscribe();
  }

  open(name: any, id: string) {
    this.router.navigate(['/details', name], { queryParams: { id } });
  }

}
