import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export class FileClass {
  name?: string;
  date?: Date;
  id_ref?: Date;
}

export class FolderClass {
  name?: string;
  nbr_files?: number;
  date?: Date;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateComponent>) { }

  form!: FormGroup;

  ngOnInit() {
    if (this.data?.type !== 'del') {
      this.form = new FormGroup({
        nameCtrl: new FormControl(
          this.data?.type === 'edit' ? this.data?.name : '', Validators.required)
      });
    }
  }

  valid() {
    if (this.data?.type !== 'del') {

      if (this.data?.type !== 'edit') {

        let itmFile = new FileClass();
        let itmFolder = new FolderClass();

        let itm = null;

        if (this.data?.type === 'add_file') {
          itmFile.name = this.form.value.nameCtrl;
          itmFile.date = new Date();
          itmFile.id_ref = this.data?.id;

          itm = itmFile;
        } else {
          itmFolder.name = this.form.value.nameCtrl;
          itmFolder.nbr_files = 0;
          itmFolder.date = new Date();

          itm = itmFolder;
        }

        if (this.form.valid) {
          this.dialogRef.close(itm);
        }

      } else {
        this.dialogRef.close(this.form.value.nameCtrl);
      }

    } else {
      this.dialogRef.close(true);
    }
  }

}
