import { Component } from '@angular/core';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css'
})
export class Result {

  activeTab: string = 'results'; // <-- added default active tab

  issues = [
    {
      page: 'Page 5',
      severity: 'High',
      confidence: '89%',
      reference: 'Doc A',
      text: 'Some non-compliant text',
      explanation: 'Why it is non-compliant...',
      recommendation: 'Fix this by...'
    },
    {
      page: 'Page 3',
      severity: 'Medium',
      confidence: '90%',
      reference: 'Doc B',
      text: 'Some other issue...',
      explanation: 'Explanation here...',
      recommendation: 'Recommended fix...'
    },
    {
      page: 'Page 7',
      severity: 'Low',
      confidence: '91%',
      reference: 'Doc C',
      text: 'Low severity text...',
      explanation: 'Minor violation...',
      recommendation: 'Optional fix...'
    }
  ];

  selectedIssue: any = null;

  selectIssue(issue: any) {
    this.selectedIssue = issue;
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.selectedIssue = null; // clear inline details when switching
  }

  // 🔽 ADDED for Analytics Tab
  scannedDocuments = [
    {
      name: 'Document1',
      date: '2025-05-15',
      score: '88%',
      violations: 2
    },
    {
      name: 'Doc1 (Ref1)',
      date: '2025-05-14',
      score: '89%',
      violations: 2
    },
    {
      name: 'Doc2 (Ref2)',
      date: '2025-05-13',
      score: '87%',
      violations: 3
    }
  ];

  topViolations = [
    {
      name: 'Missing Clause',
      percent: '40%',
      percentValue: 40
    },
    {
      name: 'Inconsistent Term',
      percent: '30%',
      percentValue: 30
    }
  ];
}
