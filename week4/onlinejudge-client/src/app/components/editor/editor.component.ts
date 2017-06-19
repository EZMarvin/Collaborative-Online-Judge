import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

declare var ace: any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;
  language: string = 'Java';
  languages: string[] = ['Java', 'C++', 'Python'];
  mode: string = 'java';
  sessionId: string;

  output: string;
  defaultContent = {
      'Java': `public class Example {
  public static void main(String[] args) { 
      // Type your Java code here 
      } 
  }`,
      'C++': `#include <iostream> 
  using namespace std; 
  int main() { 
    // Type your C++ code here 
    return 0; 
  }`, 
    'Python': `class Solution: 
   def example(): 
       # Write your Python code here`
  };
  constructor(@Inject('collaboration') private collaboration,
              @Inject('data') private data,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initEditor();
    });
    
  }

  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.setTheme('ace/theme/chrome');
    this.editor.setFontSize(18);
    this.editor.$blockScrolling = Infinity;
    this.resetEditor();
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;
    
    //get code changes
    this.editor.on('change', (e) => {
      console.log('Editor Component: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    });

    //get cursor changes
    this.editor.getSession().getSelection().on('changeCursor', () => {
      let cursor = this.editor.getSession().getSelection().getCursor();
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });
    
    // get preusers' code change
    this.collaboration.restoreBuffer();
  }

  resetEditor(): void {
    console.log(this.mode);
    this.editor.getSession().setMode(`ace/mode/${this.mode}`);
    this.editor.setValue(this.defaultContent[this.language]);
    this.output = '';
  }

  submit() {
    this.output = '';
    const userCodes = this.editor.getValue();
    console.log(userCodes);
    const codeData = {
      userCode: userCodes,
      lang: this.language.toLowerCase()
    };
    this.data.buildAndRun(codeData)
      .then(res => this.output = res.text);
  }


  setLanguage(language: string) {
    this.language = language;
    switch (language) {
      case 'Java':
        this.mode = 'java';
        break;
      case 'C++':
        this.mode = 'c_cpp';
        break;
      case 'Python':
        this.mode = 'python';
        break;
    }
    this.resetEditor();
  }

}
