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

  private readonly BASE_URL = 'http://127.0.0.1:8080';

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

  uploadResponse: any = null; 
  jobId: string | null = null; 

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

    // Automatically upload when mandatory files are selected
    if (this.files.source && this.files.reference1) {
      this.uploadAllFiles();
    }
  }

  uploadAllFiles() {
    if (!this.files.source || !this.files.reference1) {
      alert('Please select Source and Reference 1 before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('source_file', this.files.source);
    formData.append('reference_file1', this.files.reference1);
    if (this.files.reference2) {
      formData.append('reference_file2', this.files.reference2);
    }

    this.uploadProgress = { source: 0, reference1: 0, reference2: this.files.reference2 ? 0 : -1 };

    this.http.post(`${this.BASE_URL}/upload/upload-pdfs/`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          this.uploadProgress.source = percentDone;
          this.uploadProgress.reference1 = percentDone;
          if (this.files.reference2) this.uploadProgress.reference2 = percentDone;
          this.cd.detectChanges();
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress.source = 100;
          this.uploadProgress.reference1 = 100;
          if (this.files.reference2) this.uploadProgress.reference2 = 100;
          this.uploadResponse = event.body; 
          this.jobId = event.body?.job_id?.trim();   
          this.cd.detectChanges();
          console.log('All files uploaded successfully.', event.body);

          alert('Upload complete! Job ID: ' + this.jobId);
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.uploadProgress = { source: -1, reference1: -1, reference2: this.files.reference2 ? -1 : -1 };
      }
    });
  }

  uploadFile(file: File, type: 'source' | 'reference1' | 'reference2') {
    // Unused, kept for reference
  }

  show() {
    this.fetchReferenceDocs();
    console.log('Running reconciliation with:', this.files);
  }

  runReconciliation() {
    if (!this.jobId) {
      alert('Please upload at least Source and Reference 1 first.');
      return;
    }

    const trimmedJobId = this.jobId.trim();
    this.http.post(`${this.BASE_URL}/reconcile/reconcile/${trimmedJobId}`, {})
      .subscribe({
        next: (res) => {
          console.log('Reconciliation result:', res);
          this.router.navigate(['/result'], { state: { result: res } });
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching reconciliation result:', err);
        }
      });
  }

  fetchReferenceDocs() {
    this.http.get<string[]>(`${this.BASE_URL}/upload/list-documents`)
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
    return `${this.BASE_URL}/upload/documents/${encodeURIComponent(docName)}`;
  }
}
