"use strict";
(function () {
  // Global variables
  var
    userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),

    $document = $(document),
    $window = $(window),
    $html = $("html"),
    $body = $("body"),

    isDesktop = $html.hasClass("desktop"),
    isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    windowReady = false,
    isNoviBuilder = false,
    livedemo = true,

    plugins = {
      bootstrapTooltip: $("[data-toggle='tooltip']"),
      bootstrapModalDialog: $('.modal'),
      bootstrapTabs: $(".tabs-custom"),
      customToggle: $("[data-custom-toggle]"),
      counter: $(".counter"),
      circleProgress: $(".progress-bar-circle"),
      captcha: $('.recaptcha'),
      campaignMonitor: $('.campaign-mailform'),
      copyrightYear: $(".copyright-year"),
      checkbox: $("input[type='checkbox']"),
      dateCountdown: $('.DateCountdown'),
      isotope: $(".isotope-wrap"),
      lightGallery: $("[data-lightgallery='group']"),
      lightGalleryItem: $("[data-lightgallery='item']"),
      lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
      materialParallax: $(".parallax-container"),
      mailchimp: $('.mailchimp-mailform'),
      owl: $(".owl-carousel"),
      popover: $('[data-toggle="popover"]'),
      progressLinear: $(".progress-linear"),
      preloader: $(".preloader"),
      rdNavbar: $(".rd-navbar"),
      rdMailForm: $(".rd-mailform"),
      rdInputLabel: $(".form-label"),
      regula: $("[data-constraints]"),
      radio: $("input[type='radio']"),
      swiper: $(".swiper-container"),
      search: $(".rd-search"),
      searchResults: $('.rd-search-results'),
      statefulButton: $('.btn-stateful'),
      viewAnimate: $('.view-animate'),
      wow: $(".wow"),
      maps: $(".google-map-container")
    };

  /**
   * @desc Check the element was been scrolled into the view
   * @param {object} elem - jQuery object
   * @return {boolean}
   */
  function isScrolledIntoView ( elem ) {
    if ( isNoviBuilder ) return true;
    return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
  }

  /**
   * @desc Calls a function when element has been scrolled into the view
   * @param {object} element - jQuery object
   * @param {function} func - init function
   */
  function lazyInit( element, func ) {
    var scrollHandler = function () {
      if ( ( !element.hasClass( 'lazy-loaded' ) && ( isScrolledIntoView( element ) ) ) ) {
        func.call();
        element.addClass( 'lazy-loaded' );
      }
    };

    scrollHandler();
    $window.on( 'scroll', scrollHandler );
  }

  // Initialize scripts that require a loaded page
  $window.on('load', function () {
    // Page loader & Page transition
    if (plugins.preloader.length && !isNoviBuilder) {
      pageTransition({
        target: document.querySelector( '.page' ),
        delay: 0,
        duration: 500,
        classIn: 'fadeIn',
        classOut: 'fadeOut',
        classActive: 'animated',
        conditions: function (event, link) {
          return !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
        },
        onTransitionStart: function ( options ) {
          setTimeout( function () {
            plugins.preloader.removeClass('loaded');
          }, options.duration * .75 );
        },
        onReady: function () {
          plugins.preloader.addClass('loaded');
          windowReady = true;
        }
      });
    }

    // jQuery Count To
    if ( plugins.counter.length ) {
      for ( var i = 0; i < plugins.counter.length; i++ ) {
        var
          counter = $(plugins.counter[i]),
          initCount = function () {
            var counter = $(this);
            if ( !counter.hasClass( "animated-first" ) && isScrolledIntoView( counter ) ) {
              counter.countTo({
                refreshInterval: 40,
                speed: counter.attr("data-speed") || 1000,
                from: 0,
                to: parseInt( counter.text(), 10 )
              });
              counter.addClass('animated-first');
            }
          };

        $.proxy( initCount, counter )();
        $window.on( "scroll", $.proxy( initCount, counter ) );
      }
    }

    // Progress bar
    if ( plugins.progressLinear.length ) {
      for ( var i = 0; i < plugins.progressLinear.length; i++) {
        var
          bar = $(plugins.progressLinear[i]),
          initProgress = function() {
            var
              bar = $(this),
              end = parseInt($(this).find('.progress-value').text(), 10);

            if ( !bar.hasClass( "animated-first" ) && isScrolledIntoView( bar ) ) {
              bar.find('.progress-bar-linear').css({width: end + '%'});
              bar.find('.progress-value').countTo({
                refreshInterval: 40,
                from: 0,
                to: end,
                speed: 1000
              });
              bar.addClass('animated-first');
            }
          };
ff
f

        $.proxy( initProgress, bar )();
        $window.on( "scroll", $.proxy( initProgress, bar ) );
      }
    }

    // Circle Progress
    if ( plugins.circleProgress.length ) {
      for ( var i = 0; i < plugins.circleProgress.length; i++ ) {
        var circle = $(plugins.circleProgress[i]);

        circle.circleProgress({
          value: circle.attr('data-value'),
          size: circle.attr('data-size') ? circle.attr('data-size') : 175,
          fill: {
            gradient: circle.attr('data-gradient').split(","),
            gradientAngle: Math.PI / 4
          },
          startAngle: -Math.PI / 4 * 2,
          emptyFill: circle.attr('data-empty-fill') ? circle.attr('data-empty-fill') : "rgb(245,245,245)"
        }).on('circle-animation-progress', function (event, progress, stepValue) {
          $(this).find('span').text( String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1') );
        });

        if ( isScrolledIntoView( circle ) ) circle.addClass('animated-first');

        $window.on( 'scroll', $.proxy( function() {
          var circle = $(this);
          if ( !circle.hasClass( "animated-first" ) && isScrolledIntoView( circle ) ) {
            circle.circleProgress( 'redraw' );
            circle.addClass( 'animated-first' );
          }
        }, circle ) );
      }
    }

    // Isotope
    if ( plugins.isotope.length ) {
      for ( var i = 0; i < plugins.isotope.length; i++ ) {
        var
          wrap = plugins.isotope[ i ],
          filterHandler = function ( event ) {
            event.preventDefault();
            for ( var n = 0; n < this.isoGroup.filters.length; n++ ) this.isoGroup.filters[ n ].classList.remove( 'active' );
            this.classList.add( 'active' );
            this.isoGroup.isotope.arrange( { filter: this.getAttribute( "data-isotope-filter" ) !== '*' ? '[data-filter*="' + this.getAttribute( "data-isotope-filter" ) + '"]' : '*' } );
          },
          resizeHandler = function () {
            this.isoGroup.isotope.layout();
          };

        wrap.isoGroup = {};
        wrap.isoGroup.filters = wrap.querySelectorAll( '[data-isotope-filter]' );
        wrap.isoGroup.node = wrap.querySelector( '.isotope' );
        wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) ? wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) : 'masonry';
        wrap.isoGroup.isotope = new Isotope( wrap.isoGroup.node, {
          itemSelector: '.isotope-item',
          layoutMode: wrap.isoGroup.layout,
          filter: '*',
        } );

        for ( var n = 0; n < wrap.isoGroup.filters.length; n++ ) {
          var filter = wrap.isoGroup.filters[ n ];
          filter.isoGroup = wrap.isoGroup;
          filter.addEventListener( 'click', filterHandler );
        }

        window.addEventListener( 'resize', resizeHandler.bind( wrap ) );
      }
    }

    // Material Parallax
    if ( plugins.materialParallax.length ) {
      if ( !isNoviBuilder && !isIE && !isMobile) {
        plugins.materialParallax.parallax();
      } else {
        for ( var i = 0; i < plugins.materialParallax.length; i++ ) {
          var $parallax = $(plugins.materialParallax[i]);

          $parallax.addClass( 'parallax-disabled' );
          $parallax.css({ "background-image": 'url('+ $parallax.data("parallax-img") +')' });
        }
      }
    }
  });

  // Initialize scripts that require a finished document
  $(function () {
    isNoviBuilder = window.xMode;

    /**
     * @desc Toggle swiper videos on active slides
     * @param {object} swiper - swiper slider
     */
    function toggleSwiperInnerVideos(swiper) {
      var prevSlide = $(swiper.slides[swiper.previousIndex]),
        nextSlide = $(swiper.slides[swiper.activeIndex]),
        videos,
        videoItems = prevSlide.find("video");

      for (var i = 0; i < videoItems.length; i++) {
        videoItems[i].pause();
      }

      videos = nextSlide.find("video");
      if (videos.length) {
        videos.get(0).play();
      }
    }

    /**
     * @desc Toggle swiper animations on active slides
     * @param {object} swiper - swiper slider
     */
    function toggleSwiperCaptionAnimation(swiper) {
      var prevSlide = $(swiper.container).find("[data-caption-animate]"),
        nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
        delay,
        duration,
        nextSlideItem,
        prevSlideItem;

      for (var i = 0; i < prevSlide.length; i++) {
        prevSlideItem = $(prevSlide[i]);

        prevSlideItem.removeClass("animated")
          .removeClass(prevSlideItem.attr("data-caption-animate"))
          .addClass("not-animated");
      }


      var tempFunction = function (nextSlideItem, duration) {
        return function () {
          nextSlideItem
            .removeClass("not-animated")
            .addClass(nextSlideItem.attr("data-caption-animate"))
            .addClass("animated");
          if (duration) {
            nextSlideItem.css('animation-duration', duration + 'ms');
          }
        };
      };

      for (var i = 0; i < nextSlide.length; i++) {
        nextSlideItem = $(nextSlide[i]);
        delay = nextSlideItem.attr("data-caption-delay");
        duration = nextSlideItem.attr('data-caption-duration');
        if (!isNoviBuilder) {
          if (delay) {
            setTimeout(tempFunction(nextSlideItem, duration), parseInt(delay, 10));
          } else {
            tempFunction(nextSlideItem, duration);
          }

        } else {
          nextSlideItem.removeClass("not-animated")
        }
      }
    }

    /**
     * @desc Initialize owl carousel plugin
     * @param {object} c - carousel jQuery object
     */
    function initOwlCarousel(c) {
      var aliaces = ["-", '-xs-', "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
        values = [0, 480, 576, 768, 992, 1200, 1600],
        responsive = {};

      for (var j = 0; j < values.length; j++) {
        responsive[values[j]] = {};
        for (var k = j; k >= -1; k--) {
          if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
            responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
          }
          if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
            responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
          }
          if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
            responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
          }
        }
      }

      // Enable custom Navigation
      if (c.attr('data-nav-custom')) {
        c.on("initialized.owl.carousel", function (event) {
          var carousel = $(event.currentTarget),
            customNav = $(carousel.attr("data-nav-custom"));

          // Custom Navigation Events
          customNav.find(".owl-arrow-next").click(function (e) {
            e.preventDefault();
            carousel.trigger('next.owl.carousel');
          });
          customNav.find(".owl-arrow-prev").click(function (e) {
            e.preventDefault();
            carousel.trigger('prev.owl.carousel');
          });
        });
      }

      // Enable custom pagination
      if (c.attr('data-dots-custom')) {
        c.on("initialized.owl.carousel", function (event) {
          var carousel = $(event.currentTarget),
            customPag = $(carousel.attr("data-dots-custom")),
            active = 0;

          if (carousel.attr('data-active')) {
            active = parseInt(carousel.attr('data-active'), 10);
          }

          carousel.trigger('to.owl.carousel', [active, 300, true]);
          customPag.find("[data-owl-item='" + active + "']").addClass("active");

          customPag.find("[data-owl-item]").on('click', function (e) {
            e.preventDefault();
            carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
          });

          carousel.on("translate.owl.carousel", function (event) {
            customPag.find(".active").removeClass("active");
            customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
          });
        });
      }

      c.on("initialized.owl.carousel", function () {
        initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
      });

      c.owlCarousel({
        autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
        loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
        items: 3,
        center: c.attr("data-center") === "true",
        dotsContainer: c.attr("data-pagination-class") || false,
        navContainer: c.attr("data-navigation-class") || false,
        mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
        nav: c.attr("data-nav") === "true",
        dots: c.attr("data-dots") === "true",
        dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
        animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
        animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
        responsive : {
          0 : {
            items: 1
          },
          480 : {
            items: 1
          },
          768 : {
            items: 2
          },
          1140 : {
            items: 3
          }
        },
        navText: c.attr("data-nav-text") ? $.parseJSON( c.attr("data-nav-text") ) : [],
        navClass: c.attr("data-nav-class") ? $.parseJSON( c.attr("data-nav-class") ) : ['owl-prev', 'owl-next']
      });
    }

    /**
     * @desc Initialize the gallery with set of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} addClass - additional gallery class
     */
    function initLightGallery(itemsToInit, addClass) {
      if (!isNoviBuilder) {
        $(itemsToInit).lightGallery({
          thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
          selector: "[data-lightgallery='item']",
          autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
          pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
          addClass: addClass,
          mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
          loop: $(itemsToInit).attr("data-lg-loop") !== "false"
        });
      }
    }

    /**
     * @desc Initialize the gallery with dynamic addition of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} addClass - additional gallery class
     */
    function initDynamicLightGallery(itemsToInit, addClass) {
      if (!isNoviBuilder) {
        $(itemsToInit).on("click", function () {
          $(itemsToInit).lightGallery({
            thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
            selector: "[data-lightgallery='item']",
            autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
            pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
            addClass: addClass,
            mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
            loop: $(itemsToInit).attr("data-lg-loop") !== "false",
            dynamic: true,
            dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
          });
        });
      }
    }

    /**
     * @desc Initialize the gallery with one image
     * @param {object} itemToInit - jQuery object
     * @param {string} addClass - additional gallery class
     */
    function initLightGalleryItem(itemToInit, addClass) {
      if (!isNoviBuilder) {
        $(itemToInit).lightGallery({
          selector: "this",
          addClass: addClass,
          counter: false,
          youtubePlayerParams: {
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
            controls: 0
          },
          vimeoPlayerParams: {
            byline: 0,
            portrait: 0
          }
        });
      }
    }

    // Additional class on html if mac os.
    if (navigator.platform.match(/(Mac)/i)) {
      $html.addClass("mac-os");
    }

    // Adds some loosing functionality to IE browsers (IE Polyfills)
    if (isIE) {
      if (isIE === 12) $html.addClass("ie-edge");
      if (isIE === 11) $html.addClass("ie-11");
      if (isIE < 10) $html.addClass("lt-ie-10");
      if (isIE < 11) $html.addClass("ie-10");
    }

    // UI To Top
    if (isDesktop && !isNoviBuilder) {
      $().UItoTop({
        easingType: 'easeOutQuad',
        containerClass: 'ui-to-top fa fa-angle-up'
      });
    }

    // RD Navbar
    if (plugins.rdNavbar.length) {
      var aliaces, i, j, len, value, values, responsiveNavbar;

      aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
      values = [0, 576, 768, 992, 1200, 1600];
      responsiveNavbar = {};

      for (i = j = 0, len = values.length; j < len; i = ++j) {
        value = values[i];
        if (!responsiveNavbar[values[i]]) {
          responsiveNavbar[values[i]] = {};
        }
        if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
          responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
        }
        if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
          responsiveNavbar[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
        }
        if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
          responsiveNavbar[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
        }
        if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
          responsiveNavbar[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
        }

        if (isNoviBuilder) {
          responsiveNavbar[values[i]]['stickUp'] = false;
        } else if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
          responsiveNavbar[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
        }

        if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
          responsiveNavbar[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
        }
      }


      plugins.rdNavbar.RDNavbar({
        anchorNav: !isNoviBuilder,
        stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
        responsive: responsiveNavbar,
        autoHeight: plugins.rdNavbar.attr("data-auto-height") === 'false' ? false : true,
          callbacks: {
          onStuck: function () {
            var navbarSearch = this.$element.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
            }
          },
          onDropdownOver: function () {
            return !isNoviBuilder;
          },
          onUnstuck: function () {
            if (this.$clone === null)
              return;

            var navbarSearch = this.$clone.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
              navbarSearch.trigger('blur');
            }

          }
        }
      });


      if (plugins.rdNavbar.attr("data-body-class")) {
        document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
      }
    }

    // RD Search
    if (plugins.search.length || plugins.searchResults) {
      var handler = "bat/rd-search.php";
      var defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
        '<p>...#{token}...</p>' +
        '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
      var defaultFilter = '*.html';

      if (plugins.search.length) {
        for (var i = 0; i < plugins.search.length; i++) {
          var searchItem = $(plugins.search[i]),
            options = {
              element: searchItem,
              filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
              template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
              live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
              liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
              current: 0, processed: 0, timer: {}
            };

          var $toggle = $('.rd-navbar-search-toggle');
          if ($toggle.length) {
            $toggle.on('click', (function (searchItem) {
              return function () {
                if (!($(this).hasClass('active'))) {
                  searchItem.find('input').val('').trigger('propertychange');
                }
              }
            })(searchItem));
          }

          if (options.live) {
            var clearHandler = false;

            searchItem.find('input').on("input propertychange", $.proxy(function () {
              this.term = this.element.find('input').val().trim();
              this.spin = this.element.find('.input-group-addon');

              clearTimeout(this.timer);

              if (this.term.length > 2) {
                this.timer = setTimeout(liveSearch(this), 200);

                if (clearHandler === false) {
                  clearHandler = true;

                  $body.on("click", function (e) {
                    if ($(e.toElement).parents('.rd-search').length === 0) {
                      $('#rd-search-results-live').addClass('cleared').html('');
                    }
                  })
                }

              } else if (this.term.length === 0) {
                $('#' + this.live).addClass('cleared').html('');
              }
            }, options, this));
          }

          searchItem.submit($.proxy(function () {
            $('<input />').attr('type', 'hidden')
              .attr('name', "filter")
              .attr('value', this.filter)
              .appendTo(this.element);
            return true;
          }, options, this))
        }
      }

      if (plugins.searchResults.length) {
        var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
        var match = regExp.exec(location.search);

        if (match !== null) {
          $.get(handler, {
            s: decodeURI(match[1]),
            dataType: "html",
            filter: match[2],
            template: defaultTemplate,
            live: ''
          }, function (data) {
            plugins.searchResults.html(data);
          })
        }
      }
    }

    // Add class in viewport
    if (plugins.viewAnimate.length) {
      for (var i = 0; i < plugins.viewAnimate.length; i++) {
        var $view = $(plugins.viewAnimate[i]).not('.active');
        $document.on("scroll", $.proxy(function () {
          if (isScrolledIntoView(this)) {
            this.addClass("active");
          }
        }, $view))
          .trigger("scroll");
      }
    }

    // Swiper
    if (plugins.swiper.length) {
      for (var i = 0; i < plugins.swiper.length; i++) {
        var s = $(plugins.swiper[i]);
        var pag = s.find(".swiper-pagination"),
          next = s.find(".swiper-button-next"),
          prev = s.find(".swiper-button-prev"),
          bar = s.find(".swiper-scrollbar"),
          swiperSlide = s.find(".swiper-slide"),
          autoplay = false;

        for (var j = 0; j < swiperSlide.length; j++) {
          var $this = $(swiperSlide[j]),
            url;

          if (url = $this.attr("data-slide-bg")) {
            $this.css({
              "background-image": "url(" + url + ")",
              "background-size": "100%"
            })
          }
        }

        swiperSlide.end()
          .find("[data-caption-animate]")
          .addClass("not-animated")
          .end();

        s.swiper({
          autoplay: !isNoviBuilder && $.isNumeric( s.attr('data-autoplay') ) ? s.attr('data-autoplay') : false,
          direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
          effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
          speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
          keyboardControl: s.attr('data-keyboard') === "true",
          mousewheelControl: s.attr('data-mousewheel') === "true",
          mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
          nextButton: next.length ? next.get(0) : null,
          prevButton: prev.length ? prev.get(0) : null,
          pagination: pag.length ? pag.get(0) : null,
          paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
          paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (swiper, index, className) {
            return '<span class="' + className + '">' + '<span>' + '0' + (index + 1) + '</span>' + '</span>';
          } : null : null,
          scrollbar: bar.length ? bar.get(0) : null,
          scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
          scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
          loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
          simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
          onTransitionStart: function (swiper) {
            toggleSwiperInnerVideos(swiper);
          },
          onTransitionEnd: function (swiper) {
            toggleSwiperCaptionAnimation(swiper);
          },
          onInit: function (swiper) {
            toggleSwiperInnerVideos(swiper);
            toggleSwiperCaptionAnimation(swiper);
            initLightGalleryItem(s.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
          }
        });
      }
    }

    // Owl carousel
    if (plugins.owl.length) {
      for (var i = 0; i < plugins.owl.length; i++) {
        var c = $(plugins.owl[i]);
        plugins.owl[i].owl = c;

        initOwlCarousel(c);
      }
    }

    // WOW
    if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
      new WOW().init();
    }

    // RD Input Label
    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }

    // Regula
    if (plugins.regula.length) {
      attachFormValidator(plugins.regula);
    }

    // lightGallery
    if (plugins.lightGallery.length) {
      for (var i = 0; i < plugins.lightGallery.length; i++) {
        initLightGallery(plugins.lightGallery[i]);
      }
    }

    // lightGallery item
    if (plugins.lightGalleryItem.length) {
      // Filter carousel items
      var notCarouselItems = [];

      for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
        if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
          !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
          !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
          notCarouselItems.push(plugins.lightGalleryItem[z]);
        }
      }

      plugins.lightGalleryItem = notCarouselItems;

      for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
        initLightGalleryItem(plugins.lightGalleryItem[i]);
      }
    }

    // Dynamic lightGallery
    if (plugins.lightDynamicGalleryItem.length) {
      for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
        initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
      }
    }

    // Custom Toggles
    if (plugins.customToggle.length) {
      for (var i = 0; i < plugins.customToggle.length; i++) {
        var $this = $(plugins.customToggle[i]);

        $this.on('click', $.proxy(function (event) {
          event.preventDefault();

          var $ctx = $(this);
          $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
        }, $this));

        if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
          $body.on("click", $this, function (e) {
            if (e.target !== e.data[0]
              && $(e.data.attr('data-custom-toggle')).find($(e.target)).length
              && e.data.find($(e.target)).length === 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }

        if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
          $body.on("click", $this, function (e) {
            if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }
      }
    }

    // TimeCircles
    if (plugins.dateCountdown.length) {
      for ( var i = 0; i < plugins.dateCountdown.length; i++ ) {
        var
          dateCountdownItem = $( plugins.dateCountdown[ i ] ),
          countdownRender = function () {
            dateCountdownItem.TimeCircles( {
              time: { Seconds: { show: !( window.innerWidth < 768 ), } }
            } ).rebuild();
          };

        dateCountdownItem.TimeCircles( {
          color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "rgba(247, 247, 247, 1)",
          animation: "smooth",
          bg_width: dateCountdownItem.attr( "data-bg-width" ) ? dateCountdownItem.attr( "data-bg-width" ) : 0.6,
          circle_bg_color: dateCountdownItem.attr( "data-bg" ) ? dateCountdownItem.attr( "data-bg" ) : "rgba(0, 0, 0, 1)",
          fg_width: dateCountdownItem.attr( "data-width" ) ? dateCountdownItem.attr( "data-width" ) : 0.03,
          time: {
            Days: {
              text: "Days",
              show: true,
              color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
            },
            Hours: {
              text: "Hours",
              show: true,
              color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
            },
            Minutes: {
              text: "Minutes",
              show: true,
              color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
            },
            Seconds: {
              text: "Seconds",
              show: false,
              color: dateCountdownItem.attr( "data-color" ) ? dateCountdownItem.attr( "data-color" ) : "#f9f9f9"
            }
          }
        } );

        countdownRender();
        window.addEventListener( 'resize', countdownRender );
      }
    }
  });
}());
