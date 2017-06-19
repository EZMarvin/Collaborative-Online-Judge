import { Injectable } from '@angular/core';
import { COLORS } from '../../assets/colors'; 
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

    //receive info from server                              
    this.collaborationSocket.on('change', (delta: string) => {
      console.log('change' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    })

    this.collaborationSocket.on('cursorMove', (cursor: string) => {
      cursor = JSON.parse(cursor);
      const x = cursor['row'];
      const y = cursor['column'];
      let participantsId = cursor['socketId'];

      let session = editor.getSession();
      if (participantsId in this.clientsInfo) { // already join in the coding session
        session.removeMarker(this.clientsInfo[participantsId]['marker']);
      } else { // new participant in the coding session
        this.clientsInfo[participantsId] = {};
        let css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = '.editor_cursor_' + participantsId
                        + '{position: absolute; background: ' + COLORS[this.clientNum] + ';'
                        + 'z-index: 100; width: 3px !important;}';
        document.body.appendChild(css);
        this.clientNum++; 
      }

      let Range = ace.require('ace/range').Range;
      let newMarker = session.addMarker(new Range(x, y, x, y+1),
                                        'editor_cursor_' + participantsId,
                                        true);
      this.clientsInfo[participantsId]['marker'] = newMarker;
    })
    
  }

  change(delta: string) {
    this.collaborationSocket.emit('change', delta);
  }

  cursorMove(cursor: string) {
    this.collaborationSocket.emit('cursorMove', cursor);
  }

  restoreBuffer() {
    this.collaborationSocket.emit('restoreBuffer');
  }

}
