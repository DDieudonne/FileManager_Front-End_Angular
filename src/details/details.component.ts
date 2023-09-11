import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { CreateComponent } from 'src/create/create.component';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  filesArray: any[] = [];
  loading = false;
  lct: string;
  id: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.lct = location.pathname;
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.getFiles(this.id);
  }

  getFiles(id: any) {
    this.api.getFileById(id).pipe(
      map((res: any) => {
        this.filesArray = res;
      })
    ).subscribe();
  }

  edit(name?: string, idFile?: string) {
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
            this.api.editFile(idFile, newName).subscribe();
            return of(newName);
          } else {
            return of(false);
          }
        })),
        map((result) => {
          if (result) {
            this.filesArray.map((value: any) => {
              if (value._id == idFile) {
                return value.name = result;
              } else {
                return value;
              }
            });
            this._snackBar.open('Nom du fichier ' + ' modifié!', 'Fermer', { duration: 500 });
          }
          this.loading = false;
        })
      ).subscribe();
  }


  add(del?: boolean, name?: string, id?: string) {

    const dialogRef = this.dialog.open(CreateComponent, {
      enterAnimationDuration: 0,
      exitAnimationDuration: 0,
      data: { type: del ? 'del' : 'add_file', id: this.id }
    });

    dialogRef.afterClosed()
      .pipe((
        switchMap((result) => {
          this.loading = true;
          return of(result);
        })),
        switchMap((result) => {
          if (result && !del) {
            return this.api.createFile(result, this.id);
          } else if (result && del) {
            return this.api.deletFile(this.id);
          } else {
            return of(false);
          }
        }),
        map((result) => {
          if (!del) {
            if (result) {
              this.filesArray.unshift(result);
              this.loading = false;
              this._snackBar.open('Nouveau fichier ajouté!', 'Fermer', { duration: 500 });
            } else {
              this.loading = false;
            }
          } else {
            if (del && result) {
              this.filesArray.map((value, index) => {
                if (value._id == id) this.filesArray.splice(index, 1);
              });
              this._snackBar.open('Ficher ' + name + ' supprimé!', 'Fermer', { duration: 500 });
            }
            this.loading = false;
          }
        })
      ).subscribe();
  }

}
