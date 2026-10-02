/* Pure state boundaries shared by the browser and the focused persistence check. */
const DraftState = {
  restore(saved, queryDirection, validDirections) {
    const state = {direction:'study',motion:'auto',mix:false,picks:{hero:null,work:null,method:null},note:''};
    if(saved && typeof saved === 'object') {
      if(validDirections.includes(saved.direction)) state.direction = saved.direction;
      if(saved.motion === 'reduced') state.motion = 'reduced';
      if(typeof saved.note === 'string') state.note = saved.note.slice(0,2000);
      for(const part of Object.keys(state.picks)) if(validDirections.includes(saved.picks?.[part])) state.picks[part] = saved.picks[part];
      state.mix = Boolean(saved.mix) && Object.values(state.picks).some(Boolean);
    }
    if(validDirections.includes(queryDirection)) {state.direction = queryDirection;state.mix = false;}
    return state;
  },
  urlFor(href,direction) {
    const url = new URL(href);
    if(direction) url.searchParams.set('direction',direction);
    else url.searchParams.delete('direction');
    url.hash = '';
    return url.href;
  }
};
