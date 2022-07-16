const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUCSIC_PLAYER'

const playlist = $('.playlist')
const player = $('.player')
const cd =$('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn =$('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn =$('.btn-random')
const repeatBtn = $('.btn-repeat')
const app = {
  currentIndex:0,
  isPlaying:false,
  isRandom:false,
  isRepeat:false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Vì mẹ anh bắt chia tay",
      singer: "miu lê, karik",
      image: "./images/02.jpg",
      path: "./music/02.mp3",
    },
    {
      name: "Mama boy",
      singer: "amme",
      image: "./images/01.jpg",
      path: "./music/01.mp3",
    },
    {
      name: "Shay Nắnggg",
      singer: "amme, obito",
      image: "./images/03.jpg",
      path: "./music/03.mp3",
    },
    {
      name: "Chạy khỏi thế giới này",
      singer: "Da LAB, Phương Ly",
      image: "./images/04.jpg",
      path: "./music/04.mp3",
    },
    {
      name: "QUERRY ",
      singer: "QNT, TRUNG TRẦN, RPT MCK",
      image: "./images/05.jpg",
      path: "./music/05.mp3",
    },
    {
      name: "Gác lại âu lo",
      singer: "dalab, miu lê",
      image: "./images/06.jpg",
      path: "./music/06.mp3",
    },
    {
      name: "Matchanah",
      singer: "híu, bâu",
      image: "./images/07.jpg",
      path: "./music/07.mp3",
    },
    {
      name: "Lời đường mật",
      singer: "lyly, hiếu thứ hai",
      image: "./images/08.jpg",
      path: "./music/08.mp3",
    },
    {
      name: "Cô gái vàng",
      singer: "huyr, tùng viu",
      image: "./images/09.jpg",
      path: "./music/09.mp3",
    },
    {
      name: "Cho mình em",
      singer: "đen, binz",
      image: "./images/10.jpg",
      path: "./music/10.mp3",
    },
  ],
  setConfig : function(key ,value) {
    this.config[key] = value
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index===this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `;
    });
   playlist.innerHTML = htmls.join('')
  },
  defineProperties : function() {
    Object.defineProperty(this , 'currentSong',{
      get: function() {
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEven:function () {
    const _this =this
    const cdWidth = cd.offsetWidth
    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ], {
      duration: 10000, //10 seconds
      iterations:Infinity
    })
    cdThumbAnimate.pause()
    // Xử lý phóng to /thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
      cd.style.opacity = newCdWidth / cdWidth
    }
    // Xử lý khi Click play
    playBtn.onclick = function () {
      if(_this.isPlaying){
        audio.pause();
      }else {
        audio.play();
      }
    }
    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }
    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }
    // Khi tiến độ bài hát được thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration){
        const progressPercen = Math.floor(audio.currentTime / audio.duration *100)
        progress.value = progressPercen
      }
    }
    // Xử lý khi tua song
    progress.oninput = function (e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }
    // Khi next song 
    nextBtn.onclick = function () {
      if(_this.isRandom){
        _this.playRandomSong()
      }else {
        _this.nextSong();
      }
      audio.play();
      _this.render()
      _this.scrollToActiveSong()
    }
    // Khi prev song 
    prevBtn.onclick = function () {
      if(_this.isRandom){
        _this.playRandomSong();
      }else {
        _this.prevSong();
      }
      audio.play();
      _this.render()
      _this.scrollToActiveSong()
    }
    // Xử lý bật / tắt random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom
      _this.setConfig('isRandom',_this.isRandom)
      randomBtn.classList.toggle('active',_this.isRandom)
    }
    // Xử lý bật / tắt repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat
      _this.setConfig('isRepeat',_this.isRepeat)
      repeatBtn.classList.toggle('active',_this.isRepeat)
    }
    // Xử lý next song khi audio ended
    audio.onended = function () {
      if(_this.isRepeat){
        audio.play()
      }else {
        nextBtn.click()
      }
    }
    //Lắng nghe hành vi khi click vào play
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)')
      if(songNode || e.target.closest('.option')) {
        // Xử lý khi click vào song
         if(songNode) {
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
         }
        //  Xử lí khi click vào song option
        if(e.target.closest('.option')){

        }
      }
    }
  },
  scrollToActiveSong: function () {
    setTimeout (() => {
      $('.song.active').scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    },300)
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path

  },
  loadConfig : function() {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },
  nextSong : function () {
    this.currentIndex++
    if(this.currentIndex>=this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  prevSong : function () {
    this.currentIndex--
    if(this.currentIndex< 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },
  playRandomSong : function () {
    let newIndex 
    do {
      newIndex =Math.floor(Math.random() *this.songs.length)
    }while(newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
    this.render()
  },
  start: function () {
    // Gắn cấu hình từ config vào ứng dụng
    this.loadConfig()
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();
    // Lắng nghe / xử lý các sự kiện (Dom events)
    this.handleEven();
    // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
    this.loadCurrentSong();
    // Render play List
    this.render();
    // Hiển thị trang thái ban đầu của Repeat & Random
    randomBtn.classList.toggle('active',_this.isRandom)
    repeatBtn.classList.toggle('active',_this.isRepeat)
  },
};

app.start();
