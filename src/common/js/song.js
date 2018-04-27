export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,

    url: `http://dl.stream.qqmusic.qq.com/${musicData.songid}.m4a?vkey=A7B31D53461BA39D7AD4B5EAB717C13018DB811D7F342A3CA8A455900B2FC713ED72ECC3ECA05DA6BFD10B17BDFAC2C2354369310F44FAC6&guid=8827589084&uin=1456943876&fromtag=66`
  })
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach((s) => {
    ret.push(s.name);
  });
  return ret.join('/');
}
