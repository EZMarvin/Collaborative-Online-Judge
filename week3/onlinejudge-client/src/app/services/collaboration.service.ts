import { Injectable } from '@angular/core';

declare var io: any;
declare var ace: any;
@Injectable()
export class CollaborationService {
 collaborationSocket: any;
 clientsInfo: Object = {};
 clientNum: number = 0;
  constructor() { }

  init(editor: any, sessionId: string): void {
    this.collaborationSocket = io(window.location.origin,
                                  {query: 'sessionId=' +sessionId});

    this.collaborationSocket.on('change', (delta: string) => {
      console.log('change' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    })
    // this.collaborationSocket.on('message', (message) => {
    //   console.log("message from server" + message);
    // });

    this.collaborationSocket.on('cursormove', (cursor: string) => {
      console.log('received move postion ' + cursor);
      cursor = JSON.parse(cursor);
      let x = ;
      let y = ;
      let changeClientId = ;

      let session = editor.getSession();
      if (changeClientId in this.clientsInfo) {
        session.removeMarker(this.clientsInfo[changeClientId]['marker']);
      } else {
        this.clientsInfo[changeClientId] = {};
        let css = document.createElement('style');
        css.type = ;
        css.innerHTML = ;
        document.body;
        this.clientNum++;
      }

      let Range = ace.require('ace/range').Range;
      let newMarker = session.addMarker();
      this.clientsInfo[changeClientId]['marker'] = newMarker;

    })
  }

  //listener for cursor

  
  change(delta: string) {
    this.collaborationSocket.emit('change', delta);
  }



}
