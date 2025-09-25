import { Component } from '@angular/core';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css'
})
export class Result {


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

}
