import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css']
})
export class FileUpload implements OnInit {

  files: {
    source: File | null,
    reference1: File | null,
    reference2: File | null
  } = {
    source: null,
    reference1: null,
    reference2: null
  };

  referenceDocsFromServer: string[] = [];
  showReferenceList: boolean = false;

  uploadProgress = {
    source: -1,
    reference1: -1,
    reference2: -1
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  onFileSelected(event: any, type: 'source' | 'reference1' | 'reference2') {
    const file = event.target.files[0];
    if (!file) return;

    this.files[type] = file;
    this.uploadFile(file, type);
  }

  uploadFile(file: File, type: 'source' | 'reference1' | 'reference2') {
    const formData = new FormData();
    formData.append('file', file);

    this.uploadProgress[type] = 0;

    this.http.post('http://127.0.0.1:8000/upload/file', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            this.uploadProgress[type] = percentDone;
          } else {
            this.uploadProgress[type] = 50;
          }
          this.cd.detectChanges();
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress[type] = 100;
          this.cd.detectChanges();
          console.log(`${type} uploaded successfully.`);
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.uploadProgress[type] = -1;
      }
    });
  }

  show() {
    this.fetchReferenceDocs();
    console.log('Running reconciliation with:', this.files);
  }

  runReconciliation() {
    this.router.navigate(['/result'], {
      state: {
        sourceDoc: this.files.source?.name,
        referenceDocs: [this.files.reference1?.name, this.files.reference2?.name]
      }
    });
  }

  fetchReferenceDocs() {
    this.http.get<string[]>('http://127.0.0.1:8000/upload/list-documents')
      .subscribe({
        next: (docs) => {
          this.referenceDocsFromServer = docs;
          this.showReferenceList = true;
          this.cd.detectChanges();
        },
        error: (err) => console.error('Error fetching documents:', err)
      });
  }

  getDocUrl(docName: string): string {
    return `http://127.0.0.1:8000/upload/documents/${encodeURIComponent(docName)}`;
  }
}
