//This is where we apply opacity to the arrow
$(window).scroll( function(){

    //get scroll position
    var topWindow = $(window).scrollTop();
    //multiply by 1.5 so the arrow will become transparent half-way up the page
    var topWindow = topWindow * 1.5;

    //get height of window
    var windowHeight = $(window).height();

    //set position as percentage of how far the user has scrolled
    var position = topWindow / windowHeight;
    //invert the percentage
    position = 1 - position;

    //define arrow opacity as based on how far up the page the user has scrolled
    //no scrolling = 1, half-way up the page = 0
    $('.arrow-wrap').css('opacity', position);

});

$(function() {

    //From css-tricks for smooth scrolling:
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    /*========================================
     =            Animated Letters            =
     ========================================*/
    var animationDelay = 3000,
        lettersDelay = 100;

    function singleLetters($words) {
        $words.each(function(){
            var word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (var i in letters) {
                letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
            }
            var newLetters = letters.join('');
            word.html(newLetters).css('opacity', 1);
        });
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');
        if(!$letter.is(':last-child')) {
            setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else if($bool) {
            setTimeout(function(){ hideWord(takeNext($word)); }, animationDelay);
        }
        if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');
        if(!$letter.is(':last-child')) {
            setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else {
            if(!$bool) { setTimeout(function(){ hideWord($word); }, animationDelay); }
        }
    }

    function hideWord($word) {
        var nextWord = takeNext($word);
        var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
        hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
        showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function(){
            var headline = $(this);
            setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ); }, duration);
        });
    }

    function initHeadline() {
        singleLetters($('.animated-letters').find('b'));
        animateHeadline($('.animated-letters'));
    }

    initHeadline();

    /*-----Dropable & Draggable-----*/

    $( ".social-link" ).draggable({
        cursor: "crosshair",
        revert: "valid",
        containment: "#connect"
    });
    $( ".drag-place" ).droppable({
        hoverClass: "social-drag-hover",
        drop: function( event, ui ) {
            window.open(ui.draggable.attr("href"));
        }
    });

    /* IsometricGrid */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    new IsoGrid(document.querySelector('.isolayer--deco1'), {
        transform : 'translateX(33vw) translateY(-340px) rotateX(45deg) rotateZ(45deg)',
        stackItemsAnimation : {
            properties : function(pos) {
                return {
                    translateZ: (pos+1) * 30,
                    rotateZ: getRandomInt(-4, 4)
                };
            },
            options : function(pos, itemstotal) {
                return {
                    type: dynamics.bezier,
                    duration: 500,
                    points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}],
                    delay: (itemstotal-pos-1)*40
                };
            }
        },
        onGridLoaded : function() {
            classie.add(document.body, 'grid-loaded');
        }
    });
});