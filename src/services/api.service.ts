import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // FOLDERS
  getAllFolders() {
    const headers = new HttpHeaders();
    return this.http.get('http://localhost:5000/api/folders', { headers });
  }

  createFolder(obj: any) {
    const headers = new HttpHeaders();
    return this.http.post('http://localhost:5000/api/addFolder', obj, { headers });
  }

  editFolder(id: any, newName: string) {
    const headers = new HttpHeaders();
    return this.http.put('http://localhost:5000/api/editFolder', { id, newName }, { headers });
  }

  deletFolder(id: any) {
    const headers = new HttpHeaders();
    return this.http.delete('http://localhost:5000/api/deleteFolder/' + id, { headers });
  }
  // FOLDERS


  // FILES
  getFileById(id: string) {
    const headers = new HttpHeaders();
    return this.http.get('http://localhost:5000/api/filesFolder/' + id, { headers });
  }

  createFile(obj: any, id: string) {
    const headers = new HttpHeaders();
    return this.http.post('http://localhost:5000/api/addFileInfolder/' + id, obj, { headers });
  }

  editFile(idFile: any, newName: string) {
    const headers = new HttpHeaders();
    return this.http.put('http://localhost:5000/api/editFileInfolder', { idFile, newName }, { headers });
  }

  deletFile(id: string) {
    const headers = new HttpHeaders();
    return this.http.delete('http://localhost:5000/api/delFileInfolder/' + id, { headers });
  }
  // FILES


}
