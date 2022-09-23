import Player from "./player";
export default class MediaSession {
  public constructor(public player: Player) {
    const actionHandlers: ([MediaSessionAction, MediaSessionActionHandler])[] = [
      ['play',          () => { 
        this.player.isPlaying() ? this.player.pause() : this.player.play();
      }],
      ['pause',         () => { 
        !this.player.isPlaying() ? this.player.play() : this.player.pause();
      }],
      ['previoustrack', () => {  
        this.player.previous();
      }],
      ['nexttrack',     () => { 
        this.player.next();
      }],
      ['stop',          () => { 
        this.player.pause();
        this.player.setCurrentlyPlayingIndex(0);
      }],
      ['seekbackward',  (details) => { this.player.seekBackward(details.seekOffset || undefined) }],
      ['seekforward',   (details) => { this.player.seekForward(details.seekOffset || undefined) }],
      ['seekto',        (details) => { details.seekTime && this.player.seekTo(details.seekTime) }],
    ];
    
    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.log(`The media session action "${action}" is not supported yet.`);
      }
    }

    this.player.on("play", () => {
      navigator.mediaSession.playbackState = "playing";
    })

    this.player.on("pause", () => {
      navigator.mediaSession.playbackState = "paused";
    })

    // this.player.on("metadata", meta => {
    //   navigator.mediaSession.metadata = new MediaMetadata({
    //     title: 'Unforgettable',
    //     artist: 'Nat King Cole',
    //     album: 'The Ultimate Collection (Remastered)',
    //     artwork: [
    //       { src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png' },
    //       { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
    //       { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
    //       { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
    //       { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
    //       { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
    //     ]
    //   });

    //   console.log(navigator.mediaSession.metadata);

    // });
  }
}