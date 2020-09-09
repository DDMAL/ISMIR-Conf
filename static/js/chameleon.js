/**
 *
 *   _____ _    _          __  __ ______ _      ______ ____  _   _
 *  / ____| |  | |   /\   |  \/  |  ____| |    |  ____/ __ \| \ | |
 * | |    | |__| |  /  \  | \  / | |__  | |    | |__ | |  | |  \| |
 * | |    |  __  | / /\ \ | |\/| |  __| | |    |  __|| |  | | . ` |
 * | |____| |  | |/ ____ \| |  | | |____| |____| |___| |__| | |\  |
 *  \_____|_|  |_/_/    \_\_|  |_|______|______|______\____/|_| \_|
 *
 *
 * chameleon.js - A jQuery plugin to synchronize slide images with videos in JWPlayer 7, HTML5 or YouTube Player
 * @author WONG, Wing Kam - wingkwong.code@gmail.com
 * @version - 1.3.0
 */
;
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    var chameleon = 'chameleon';

    function Chameleon(element, o) {
        var el = element;
        var $el = $(element);

        o = $.extend({}, $.fn[chameleon].defaults, o);

        var $chameleon = $('.chameleon'),
            $this = $(this),
            $headerContainer = '<div class="header-container"></div>',
            $videoContainer = '<div class="video-container"></div>',
            $slideContainer = '<div class="slide-container"><img/></div>',
            $infoPanelContainer = '<div class="info-panel"></div>',
            $carouselContainer = '<div class="carousel-container"></div>',
            $downloadContainer = '<div class="download-container"></div>',
            $previewSlideContainer = '<div class="preview-slide-container"></div>',
            $carouselItem = '<div class="carousel-item"></div>',
            $previewImage = '<div class="thumbnail-container"><div class="slide-image"><img/></div><div class="slide-number"></div></div>',
            $carouselControl = '<a class="carousel-control prev"></a><a class="carousel-control next"></a>',
            $downloadIcon = '<span class="download-icon"></span>',
            chameleonContext = {},
            jwPlayerInst = {},
            maxImgInARow = 5;

        var jw = {
            'base': '<div id="jwplayer" class="chameleon-jwplayer-video"></div>'
        };

        var html5 = {
            'base': '<video id="chameleon-html5-video" class="chameleon-html5-video" controls preload="auto" width="100%" height="100%"/>',
            'source': '<source/>'
        };

        var youtube = {
            'base': '<div id="chameleon-youtube-video" class="chameleon-youtube-video" width="100%" height="100%" frameborder="0" allowfullscreen></div>'
        };

        var infoPanel = {
            'base': '<div class="dropdown-box"></div>',
            'header': '<div class="dropdown-header"></div>',
            'button': '<div class="dropdown-btn-wrapper">Markers <span class="dropdown-btn up"></span></div>',
            'content': '<div class="dropdown-content"></div>'
        };

        var infoPanelSlide = {
            'base': '<a href="javascript:;" class="info-panel-slide"></a>',
            'slideThumbnail': '<div class="slide-thumbnail"><img/></div>',
            'slideNumber': '<div class="slide-number"></div>',
            'slideTitle': '<div class="slide-title-wrapper"><div class="slide-title"></div></div>',
            'slideTime': '<div class="slide-time"></div>',
        };

        function _initChameleon() {
            if ($.isEmptyObject(o.chameleonContext)) {
                throw new Error("Chameleon chameleonContext hasn't been defined.");
            }

            /*
                Header Container
            */
            if (o.chameleonContext.title || !$.isEmptyObject($o.chameleonContext.download)) {
                $chameleon.append($headerContainer);

                /*
                  Video Title
                */
                if (o.chameleonContext.title) {
                    $chameleon.find('.header-container').append('<div class="video-title"></div>');
                    $chameleon.find('.video-title').html(o.chameleonContext.title);
                }

                /*
                  Download Buttons
                */
                if (o.showDownloadPanel && !$.isEmptyObject(o.chameleonContext.download)) {
                    $chameleon.find('.header-container').append($downloadContainer);

                    if (typeof o.chameleonContext.download.slides != "undefined" &&
                        typeof o.chameleonContext.download.slides === "object") {

                        if (typeof o.chameleonContext.download.slides.url != "undefined" &&
                            typeof o.chameleonContext.download.slides.url === "string") {
                            $chameleon.find('.download-container').append('<a class="download-btn download-slides" target="_blank" download></a>');
                            $chameleon.find('.download-slides').attr("href", o.chameleonContext.download.slides.url);
                        }

                        if ($chameleon.find('.download-slides').length > 0 &&
                            typeof o.chameleonContext.download.slides.title != "undefined" &&
                            typeof o.chameleonContext.download.slides.title === "string") {
                            $chameleon.find('.download-slides').prepend($downloadIcon);
                            $chameleon.find('.download-slides').attr("title", o.chameleonContext.download.slides.title);
                        }


                    }

                    if (typeof o.chameleonContext.download.video != "undefined" &&
                        typeof o.chameleonContext.download.video === "object") {
                        if (typeof o.chameleonContext.download.video.url != "undefined" &&
                            typeof o.chameleonContext.download.video.url === "string") {
                            $chameleon.find('.download-container').append('<a class="download-btn download-video" target="_blank" download></a>');
                            $chameleon.find('.download-video').attr("href", o.chameleonContext.download.video.url);
                        }

                        if ($chameleon.find('.download-video').length > 0 &&
                            typeof o.chameleonContext.download.video.title != "undefined" &&
                            typeof o.chameleonContext.download.video.title === "string") {
                            $chameleon.find('.download-video').prepend($downloadIcon);
                            $chameleon.find('.download-video').attr("title", o.chameleonContext.download.video.title);
                        }
                    }

                    if (typeof o.chameleonContext.download.transcript != "undefined" &&
                        typeof o.chameleonContext.download.transcript === "object") {
                        if (typeof o.chameleonContext.download.transcript.url != "undefined" &&
                            typeof o.chameleonContext.download.transcript.url === "string") {
                            $chameleon.find('.download-container').append('<a class="download-btn download-transcript" target="_blank" download></a>');
                            $chameleon.find('.download-transcript').attr("href", o.chameleonContext.download.transcript.url);
                        }

                        if ($chameleon.find('.download-transcript').length > 0 &&
                            typeof o.chameleonContext.download.transcript.title != "undefined" &&
                            typeof o.chameleonContext.download.transcript.title === "string") {
                            $chameleon.find('.download-transcript').prepend($downloadIcon);
                            $chameleon.find('.download-transcript').attr("title", o.chameleonContext.download.transcript.title);
                        }
                    }
                }
            }

            /*
                Video Container
            */
            $chameleon.append($videoContainer);

            /*
                Slide Container
            */
            $chameleon.append($slideContainer);

            if (!o.responsive)
                $chameleon.css("width", o.width).css("height", o.height);

            if (typeof o.chameleonContext === "object") {
                $this.chameleonContext = o.chameleonContext;
                _initContextValidator();
            }

            if (typeof o.chameleonContext === "string") {
                var regex = /(?:\.([^.]+))?$/;

                if (regex.exec(o.chameleonContext)[1] == "json") {
                    $.getJSON(o.chameleonContext, function (data) {
                        $this.chameleonContext = data;
                    }).done(function () {
                        _initContextValidator();
                    });
                } else {
                    throw new Error("JSON file required.");
                }
            }
        }

        function _initContextValidator() {
            if (o.player == "jwplayer" && typeof $this.chameleonContext.jwplayerSetup === "undefined") {
                throw new Error("JWPlayer setup object hasn't been defined in chameleonContext.");
            } else if (o.player == "html5" && typeof $this.chameleonContext.html5Setup === "undefined") {
                throw new Error("HTML5 Player setup object hasn't been defined in chameleonContext.");
            } else if (o.player == "youtube" && typeof $this.chameleonContext.youtubeSetup === "undefined") {
                throw new Error("YouTube Player setup object hasn't been defined in chameleonContext.");
            }

            if (typeof $this.chameleonContext.slides === "undefined" || typeof $this.chameleonContext.slides != "object") {
                throw new Error("slides hasn't been defined in chameleonContext.");
            }

            if ($this.chameleonContext.slides.length == 0) {
                throw new Error("No slide hasn't been defined in chameleonContext.");
            }

            _buildHabitat();
        }

        function _buildHabitat() {

            _initPlayer();

            // Set the first slide as a cover
            _setSlide(0);

            /*
                Building Carousel Container
            */
            if(o.showCarousel) {
                $chameleon.append($carouselContainer);
                            // Building Slides Carousel
                $chameleon.find('.carousel-container').append($previewSlideContainer).append($carouselControl);

                for (var i = 1; i <= $this.chameleonContext.slides.length; i++) {
                    var $cItem = $($carouselItem).append($previewImage);
                    $cItem.find('.slide-image').attr('data-index', i);
                    $cItem.find('.slide-image img').attr('src', $this.chameleonContext.slides[i - 1].img);
                    $cItem.find('.slide-image img').attr('title', $this.chameleonContext.slides[i - 1].title);
                    $cItem.find('.slide-image img').attr('alt', $this.chameleonContext.slides[i - 1].alt);
                    $cItem.find('.slide-number').html((i) + '/' + $this.chameleonContext.slides.length);
                    $chameleon.find('.preview-slide-container').append($cItem);
                }

                $chameleon.find('.carousel-item:first').addClass("active");

                // Building multiple sets of carousel items

                if ($this.chameleonContext.slides.length > o.numOfCarouselSlide) {
                    $chameleon.find('.carousel-item').each(function () {
                        var itemToClone = $(this);
                        for (var i = 1; i < o.numOfCarouselSlide; i++) {
                            itemToClone = itemToClone.next();
                            if (!itemToClone.length) {
                                itemToClone = $(this).siblings(':first');
                            }
                            itemToClone.children(':first-child').clone()
                                .addClass("js-chameleon-" + (i))
                                .appendTo($(this));
                        }
                    });

                    var carouselInnerWidth = $chameleon.find('.carousel-item.active').width();
                    var imageWidth = $chameleon.find('.carousel-item.active .thumbnail-container:first').width();
                    $this.maxImgInARow = Math.floor(carouselInnerWidth / imageWidth);

                    if ((o.numOfCarouselSlide > $this.maxImgInARow) && $this.maxImgInARow > 5) {
                        $chameleon.find('.carousel-item .js-chameleon-3').addClass("current-slide");
                    } else {
                        var total = $chameleon.find('.carousel-item.active .thumbnail-container').length;
                        if (Math.floor(total / 2) >= 1) {
                            var i = $chameleon.find('.carousel-item.active .thumbnail-container:nth-child( ' + Math.floor(total / 2) + ') .slide-image').attr("data-index");
                            $chameleon.find('.carousel-item .js-chameleon-' + i + '').addClass("current-slide");
                        } else {
                            $chameleon.find('.carousel-control').remove();
                            $chameleon.find('.carousel-item .thumbnail-container').addClass("current-slide");
                        }
                    }

                    $chameleon.find('.current-slide img').css("width", "120px");

                    _updateSlideCarouel(0);

                } else {
                    $chameleon.find('.carousel-control').remove();
                    $chameleon.find('.carousel-item').addClass("active");
                }

            }

            /*
                Building Info Panel Container
            */
           if(o.showMarkers && o.responsive) {
                $chameleon.append($infoPanelContainer);

                // Building Info Panel
                $infoPanelContainer = $chameleon.find('.info-panel');
                $infoPanel = $(infoPanel.base);
                $header = $(infoPanel.header).append(infoPanel.button);
                $content = $(infoPanel.content);
                $ip = $infoPanel.append($header).append($content);
                $infoPanelContainer.append($ip);

                // Building Info Panel - slide
                for (var i = 0; i < $this.chameleonContext.slides.length; i++) {
                    $infoPanelSlide = $(infoPanelSlide.base)
                        .append(infoPanelSlide.slideNumber)
                        .append(infoPanelSlide.slideThumbnail)
                        .append(infoPanelSlide.slideTime)
                        .append(infoPanelSlide.slideTitle);
                    $infoPanelSlide.attr("data-index", i);
                    $infoPanelSlide.find('.slide-number').html("#" + (i + 1));
                    $infoPanelSlide.find('.slide-thumbnail img').attr("src", $this.chameleonContext.slides[i].img);
                    $infoPanelSlide.find('.slide-time').html($this.chameleonContext.slides[i].time);
                    if (typeof $this.chameleonContext.slides[i].title === "undefined" || $this.chameleonContext.slides[i].title == '') {
                        $infoPanelSlide.find('.slide-title').html("-");
                    } else {
                        $infoPanelSlide.find('.slide-title').html($this.chameleonContext.slides[i].title);
                    }
                    $chameleon.find('.dropdown-content').append($infoPanelSlide);
                }

           }

            // Register Click Events
            _registerClickEvents();


            _responsify();

        }

        function _initPlayer() {
            /*
                Create container for a specific player
            */
            switch (o.player) {
                case 'jwplayer':
                    $chameleon.find('.video-container').append(jw.base);
                    _initJWPlayer();
                    break;

                case 'html5':
                    $chameleon.find('.video-container').append(html5.base);
                    _initHTML5Player();
                    break;

                case 'youtube':
                    $chameleon.find('.video-container').append(youtube.base);
                    _initYoutubePlayer();
                    break;

                default:
                    throw new Error(o.player + " is not supported");

            }
        }

        function _initJWPlayer() {

            $this.jwPlayerInst = jwplayer("jwplayer").setup($this.chameleonContext.jwplayerSetup);

            $this.jwPlayerInst.onTime(function () {
                var time = $this.jwPlayerInst.getPosition();
                _slideCarouselHandler(time);
            });

            $this.jwPlayerInst.onComplete(function () {
                _setSlide(0);
                _updateSlideCarouel(0);
            });
        }

        function _initHTML5Player() {
            var o = $this.chameleonContext.html5Setup;
            var $video = $chameleon.find('.chameleon-html5-video');
            if (!$.isArray(o.sources)) {
                $html5Source = $(html5.source);
                $html5Source.attr({
                    "src": o.sources.file,
                    "type": o.sources.type
                });
                $video.append($html5Source);
            } else {
                for (var i = 0; i < o.sources.length; i++) {
                    $html5Source = $(html5.source);
                    $html5Source.attr({
                        "src": o.sources[i].file,
                        "type": o.sources[i].type
                    });
                    $video.append($html5Source);
                }
            }

            if (o.poster != null && o.poster != '') {
                $video.attr("poster", o.poster);
            }

            $video.bind('timeupdate', function () {
                var time = $(this).get(0).currentTime;
                _slideCarouselHandler(time);
            });

            $video.bind('ended', function () {
                _setSlide(0);
                _updateSlideCarouel(0);
            });
        }

        function _initYoutubePlayer() {
            var $video = $chameleon.find('.chameleon-youtube-video');
            var o = $this.chameleonContext.youtubeSetup;

            $.getScript('//www.youtube.com/iframe_api').fail(function (jqxhr, settings, exception) {
                    console.log(exception);
                })
                .done(function () {
                    window.onYouTubeIframeAPIReady = function () {
                        $this.ytPlayer = new YT.Player('chameleon-youtube-video', {
                            height: '100%',
                            width: '100%',
                            videoId: o.videoId,
                            events: {
                                'onReady': function () {
                                    _bindYTonTimeChange();
                                }
                            }
                        });
                    }
                });
        }

        function _bindYTonTimeChange() {
            setInterval(function () {
                _slideCarouselHandler($this.ytPlayer.getCurrentTime());
            }, 1000);
        }


        function _registerClickEvents() {
            $chameleon.find('.slide-image').click(function () {
                var id = $(this).attr("data-index");
                _seek(_parseStrTime($this.chameleonContext.slides[id - 1].time));
            });

            $chameleon.find('.carousel-control.prev').click(function () {
                var id = $('.active .current-slide .slide-image').attr("data-index");
                id = parseInt(id) - 1;
                if (id == 0) {
                    id = $this.chameleonContext.slides.length;
                }
                _seek(_parseStrTime($this.chameleonContext.slides[id - 1].time));
            });

            $chameleon.find('.carousel-control.next').click(function () {
                var id = $chameleon.find('.active .current-slide .slide-image').attr("data-index");
                if (id == $this.chameleonContext.slides.length) {
                    id = 0;
                }
                _seek(_parseStrTime($this.chameleonContext.slides[id].time));
            });

            $chameleon.find('.info-panel-slide').click(function () {
                var me = $(this);
                var id = me.attr("data-index");
                _seek(_parseStrTime($this.chameleonContext.slides[id].time));
            });

            $chameleon.find('.info-panel .dropdown-btn-wrapper').click(function () {
                var me = $(this).find('.dropdown-btn');
                if (me.hasClass("down")) {
                    me.parent().parent().parent().find(".dropdown-content").slideDown();
                    me.removeClass("down").addClass("up");
                } else {
                    me.parent().parent().parent().find(".dropdown-content").slideUp();
                    me.removeClass("up").addClass("down");
                }
            });
        }

        function _seek(time) {
            switch (o.player) {
                case 'jwplayer':
                    $this.jwPlayerInst.seek(time)
                    break;

                case 'html5':
                    var $video = $chameleon.find('.chameleon-html5-video').get(0);
                    $video.currentTime = time;
                    $video.play();
                    break;

                case 'youtube':
                    $this.ytPlayer.seekTo(time);
                    break;

                default:
                    throw new Error(o.player + " is not supported");
            }
        }

        function _responsify() {
            if (o.responsive) {
                $chameleon.addClass("chameleon-responsive");
                $chameleon.find('.video-container').addClass("col-md-5 col-xs-12");
                $chameleon.find('.video-container').css({
                    'padding': '0px',
                    'height': '400px'
                });
                $chameleon.find('.slide-container').addClass("col-md-7 col-xs-12");

                $chameleon.find('.slide-container img').css({
                    'margin-left': 'auto',
                    'margin-right': 'auto',
                    'padding': '0px'
                });

                $chameleon.find('.header-container').addClass('col-xs-12');
                $chameleon.find('.header-container .video-title').addClass('col-xs-6');
                $chameleon.find('.header-container .download-container').addClass("col-xs-6");
                $chameleon.find('.info-panel').addClass("col-xs-12");
                $chameleon.find('.carousel-container').addClass("col-xs-12 hidden-xs");

                $chameleon.find('.download-btn').css({
                    'margin': '10px 0px'
                });

                $chameleon.find('.info-panel-slide').addClass("col-xs-12 col-sm-6 col-lg-4");
                $chameleon.find('.info-panel-slide .slide-number').addClass("col-xs-12 col-md-1");
                $chameleon.find('.info-panel-slide .slide-thumbnail').addClass("col-xs-12 col-sm-6 col-lg-4");
                $chameleon.find('.info-panel-slide .slide-time').addClass("col-xs-2");
                $chameleon.find('.info-panel-slide .slide-title-wrapper').addClass("col-xs-12 col-lg-6");


            } else {
                $chameleon.find('.video-container').css({
                    'float': 'left',
                    'width': '50%',
                    'height': '100%'
                });

                $chameleon.find('.slide-container').css({
                    'width': '50%',
                    'height': '100%',
                    'float': 'left'
                });

                $chameleon.find('.download-container').css({
                    'width': '50%',
                    'height': '40px',
                    'float': 'left',
                    'line-height': '40px'
                });

                $chameleon.find('.video-title').css({
                    'width': '50%',
                    'float': 'left'
                })

                $chameleon.find('.info-panel .slide-number, .info-panel .slide-time').css({
                    'width': '8.33333333%',
                    'float': 'left',
                    'text-align': 'center'
                });

                $chameleon.find('.info-panel .slide-title-wrapper').css({
                    'width': '83.33333333%',
                    'float': 'left',
                    'text-align': 'center'
                });

                $chameleon.find('.info-panel .slide-title').css({
                    'padding-left': '30px'
                });



            }
        }

        function _updateSlideCarouel(index) {
            var index = parseInt(index) + 1;
            var target = $('.current-slide .slide-image[data-index="' + index + '"]').parent().parent();
            $('.carousel-item.active').removeClass("active");
            target.addClass("active");
        }

        function _parseStrTime(time) {
            // parse time : '00:00:15'
            var hms = time.split(':');
            return (parseInt(hms[0] * 60 * 60) + parseInt(hms[1] * 60) + parseInt(hms[2]));
        }

        function _slideCarouselHandler(time) {
            if (time >= _parseStrTime($this.chameleonContext.slides[$this.chameleonContext.slides.length - 1].time)) {
                if ($this.chameleonContext.slides.length > o.numOfCarouselSlide) {
                    _updateSlideCarouel($this.chameleonContext.slides.length - 1);
                }
                _setSlide($this.chameleonContext.slides.length - 1);
                _highlightMarkers($this.chameleonContext.slides.length - 1)
            } else {
                for (var i = 0, j = 1; i < $this.chameleonContext.slides.length; i++, j++) {
                    if (time >= _parseStrTime($this.chameleonContext.slides[i].time) && time < _parseStrTime($this.chameleonContext.slides[j].time)) {
                        if ($this.chameleonContext.slides.length > o.numOfCarouselSlide) {
                            _updateSlideCarouel(i);
                            _highlightMarkers(i);
                        }
                        _setSlide(i);
                    }
                }
            }
        }

        function _setSlide(index) {
            $chameleon.find('.slide-container img').attr('src', $this.chameleonContext.slides[index].img);
            $chameleon.find('.slide-container img').attr('title', $this.chameleonContext.slides[index].title);
            $chameleon.find('.slide-container img').attr('alt', $this.chameleonContext.slides[index].alt);
        }

        function _highlightMarkers(index) {
            $chameleon.find('.chameleon-hightlighted').removeClass('chameleon-hightlighted');
            $chameleon.find(".info-panel-slide[data-index='" + index + "']").addClass('chameleon-hightlighted');
        }

        //-----------------CHAMLEON--------------------//

        _initChameleon();

        //-----------------CHAMLEON--------------------//
    }

    $.fn[chameleon] = function (o) {
        if (typeof arguments[0] === 'string') {
            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var returnVal;
            this.each(function () {
                if ($.data(this, 'plugin_' + chameleon) && typeof $.data(this, 'plugin_' + chameleon)[methodName] === 'function') {
                    returnVal = $.data(this, 'plugin_' + chameleon)[methodName].apply(this, args);
                } else {
                    throw new Error('Method ' + methodName + ' does not exist on jQuery.' + chameleon);
                }
            });
            if (returnVal !== undefined) {
                return returnVal;
            } else {
                return this;
            }
        } else if (typeof o === "object" || !o) {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + chameleon)) {
                    $.data(this, 'plugin_' + chameleon, new Chameleon(this, o));
                }
            });
        }
    };

    $.fn[chameleon].defaults = {
        width: '968px', // width of chameleon container
        height: '270px', // height of chameleon container
        chameleonContext: {}, // slides JSON file / object
        numOfCarouselSlide: 5, // number of slides showing in carousel
        responsive: false,
        player: 'html5',
        showMarkers: false,
        showCarousel: false,
        showDownloadPanel: false,
    };
}));
