import { OnlinejudgeClientPage } from './app.po';

describe('onlinejudge-client App', () => {
  let page: OnlinejudgeClientPage;

  beforeEach(() => {
    page = new OnlinejudgeClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
